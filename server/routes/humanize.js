
const express = require('express');
const router = express.Router();
const { humanizeText } = require('../services/humanizationService');

// Import the checkSubscription middleware
const checkSubscription = require('../middleware/checkSubscription');

/**
 * @route   POST /api/humanize-text
 * @desc    Humanize AI-generated text using OpenAI
 * @access  Public
 */
router.post('/humanize-text', checkSubscription, async (req, res) => {
  try {
    const { text, userId = 'anonymous' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text input is required'
      });
    }

    // For trial users, limit text length
    if (userId === 'trial-user' && text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Trial users are limited to 500 characters'
      });
    }

    const result = await humanizeText(text, userId);

    res.json({
      success: true,
      data: result
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
