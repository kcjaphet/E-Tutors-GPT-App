
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Import the checkSubscription middleware
const checkSubscription = require('../middleware/checkSubscription');

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @route   POST /api/humanize-text
 * @desc    Humanize AI-generated text using OpenAI
 * @access  Public
 */
router.post('/humanize-text', checkSubscription, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'No text provided'
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an assistant that rewrites text to sound more natural and human-like. Maintain the original meaning but make the text flow better, use varied sentence structures, and eliminate patterns typical of AI-generated content."
        },
        {
          role: "user",
          content: `Rewrite the following text to sound more human-like and natural: \n\n${text}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices || response.choices.length === 0) {
      console.error('OpenAI API Error:', response);
      return res.status(500).json({
        success: false,
        message: 'Failed to humanize text',
        error: 'No response from OpenAI'
      });
    }

    const humanizedText = response.choices[0].message.content.trim();

    // Check if the humanized text is the same as the original text
    if (humanizedText === text.trim()) {
      return res.json({
        success: true,
        data: {
          originalText: text,
          humanizedText: humanizedText,
          textLength: text.length,
          timestamp: new Date().toISOString(),
          note: "The text couldn't be humanized further."
        }
      });
    }

    res.json({
      success: true,
      data: {
        originalText: text,
        humanizedText: humanizedText,
        textLength: text.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error humanizing text:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to humanize text',
      error: error.message
    });
  }
});

module.exports = router;
