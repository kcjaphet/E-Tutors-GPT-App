
const express = require('express');
const router = express.Router();
const { OpenAI } = require("openai");

// Import the checkSubscription middleware
const checkSubscription = require('../middleware/checkSubscription');

// Initialize OpenAI API with timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000, // 60 second timeout
  maxRetries: 3,
});

/**
 * @route   POST /api/detect-ai-text
 * @desc    Detect if text is AI-generated using OpenAI
 * @access  Public
 */
router.post('/detect-ai-text', checkSubscription, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'No text provided'
      });
    }

    // OpenAI Moderation API call with error handling
    let moderation;
    try {
      const openaiResponse = await openai.moderations.create({
        input: text,
      });
      moderation = openaiResponse.results[0];
    } catch (moderationError) {
      console.error('OpenAI Moderation API Error:', moderationError);
      // Continue without moderation if it fails
      moderation = { flagged: false };
    }

    // Determine if text is flagged by OpenAI
    const isFlagged = moderation.flagged;

    // Use OpenAI to analyze the text with error handling
    let aiProbability = 50; // Default value
    let reasoning = "Unable to perform detailed analysis.";
    let highlightedSegments = [];
    
    try {
      // Get detailed analysis with reasoning
      const analyzeResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert AI detection system. Analyze the text for AI-generated content and provide:
1. A probability score (0-100) that the text was AI-generated
2. Detailed reasoning for your assessment
3. Specific segments that indicate AI generation (if any)

Respond in JSON format:
{
  "probability": number,
  "reasoning": "string explaining your assessment",
  "suspiciousSegments": ["array of text segments that seem AI-generated"]
}`
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      });

      // Parse the JSON response
      try {
        const responseText = analyzeResponse.choices[0].message.content.trim();
        const analysis = JSON.parse(responseText);
        
        if (analysis.probability !== undefined) {
          aiProbability = Math.max(0, Math.min(100, analysis.probability));
        }
        if (analysis.reasoning) {
          reasoning = analysis.reasoning;
        }
        if (analysis.suspiciousSegments && Array.isArray(analysis.suspiciousSegments)) {
          highlightedSegments = analysis.suspiciousSegments.filter(segment => 
            typeof segment === 'string' && segment.length > 0
          );
        }
      } catch (parseError) {
        console.error('Error parsing AI analysis:', parseError);
        // Fallback to simple analysis
        const probText = analyzeResponse.choices[0].message.content.trim();
        const match = probText.match(/\d+/);
        if (match) {
          aiProbability = parseFloat(match[0]);
        }
        reasoning = "Basic analysis performed due to parsing limitations.";
      }
    } catch (openaiError) {
      console.error('OpenAI Analysis Error:', openaiError);
      // Continue with default values
    }

    // If text is flagged by OpenAI moderation, increase the probability
    if (isFlagged) {
      aiProbability = Math.min(100, aiProbability + 20);
    }

    // Determine confidence level
    let confidenceLevel = 'Low';
    if (aiProbability > 30 && aiProbability <= 70) {
      confidenceLevel = 'Medium';
    } else if (aiProbability > 70) {
      confidenceLevel = 'High';
    }

    // Generate analysis
    let analysis = 'The text appears to be human-written.';
    if (aiProbability > 30 && aiProbability <= 70) {
      analysis = 'The text may contain AI-generated content.';
    } else if (aiProbability > 70) {
      analysis = 'The text is likely AI-generated.';
    }

    const result = {
      aiProbability,
      confidenceLevel,
      analysis,
      reasoning,
      highlightedSegments,
      textLength: text.length,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: result,
      message: 'AI detection analysis completed',
    });
  } catch (error) {
    console.error('Error detecting AI text:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to detect AI text',
      error: error.message || 'Connection error',
    });
  }
});

module.exports = router;
