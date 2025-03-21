
const express = require('express');
const router = express.Router();
const { humanizeText } = require('../services/humanizationService');

/**
 * @route   POST /api/humanize-text
 * @desc    Humanize AI-generated text to make it sound more natural
 * @access  Public (can be made private with auth middleware)
 */
router.post('/humanize-text', async (req, res) => {
  try {
    const { text, userId } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Text input is required' 
      });
    }

    const result = await humanizeText(text, userId || 'anonymous');
    
    return res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error in text humanization:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during humanization process',
      error: error.message
    });
  }
});

module.exports = router;
