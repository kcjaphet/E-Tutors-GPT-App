const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");
const { GPTZeroAPI } = require("gptzero");

// Import the checkSubscription middleware
const checkSubscription = require('../middleware/checkSubscription');

// Initialize OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Initialize GPTZero API
const gptZeroClient = new GPTZeroAPI(process.env.GPTZERO_API_KEY);

/**
 * @route   POST /api/detect-ai-text
 * @desc    Detect if text is AI-generated using GPTZero and OpenAI
 * @access  Public
 */
router.post('/detect-ai-text', checkSubscription, async (req, res) => {
  try {
    const { text } = req.body;

    // GPTZero API call
    const gptZeroOutput = await gptZeroClient.detectText(text);
    const gptZeroData = gptZeroOutput.completely_ai_generated;

    // OpenAI Moderation API call
    const openaiResponse = await openai.createModeration({
      input: text,
    });

    // Determine if text is flagged by OpenAI
    const isFlagged = openaiResponse.data.results[0].flagged;

    // Combine results and determine overall AI probability
    let aiProbability = 0;
    if (gptZeroData) {
      aiProbability += 70; // GPTZero indicates high probability
    }
    if (isFlagged) {
      aiProbability += 30; // OpenAI flagged the text
    }

    // Determine confidence level
    let confidenceLevel = 'Low';
    if (aiProbability > 30 && aiProbability <= 60) {
      confidenceLevel = 'Medium';
    } else if (aiProbability > 60) {
      confidenceLevel = 'High';
    }

    // Generate analysis
    let analysis = 'The text appears to be human-written.';
    if (aiProbability > 30) {
      analysis = 'The text may contain AI-generated content.';
    }
    if (aiProbability > 60) {
      analysis = 'The text is likely AI-generated.';
    }

    const result = {
      aiProbability,
      confidenceLevel,
      analysis,
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
      error: error.message,
    });
  }
});

module.exports = router;
