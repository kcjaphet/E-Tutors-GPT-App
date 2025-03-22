const express = require('express');
const router = express.Router();
const { Configuration, OpenAI } = require('openai');

// Import the checkSubscription middleware
const checkSubscription = require('../middleware/checkSubscription');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAI(configuration);

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

    const prompt = `Please rewrite the following text to sound more natural and human-like:\n\n${text}\n\nRewritten Text:`;

    const aiResponse = await openai.completions.create({
      model: 'gpt-3.5-turbo-instruct',
      prompt: prompt,
      max_tokens: 200,
      temperature: 0.7,
      n: 1,
      stop: null,
    });

    if (!aiResponse.choices || aiResponse.choices.length === 0) {
      console.error('OpenAI API Error:', aiResponse);
      return res.status(500).json({
        success: false,
        message: 'Failed to humanize text',
        error: 'No response from OpenAI'
      });
    }

    const humanizedText = aiResponse.choices[0].text.trim();

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
