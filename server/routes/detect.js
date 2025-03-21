
const express = require('express');
const router = express.Router();
const { detectAIText } = require('../services/detectionService');

/**
 * @route   POST /api/detect-ai-text
 * @desc    Detect if text is AI-generated
 * @access  Public (can be made private with auth middleware)
 */
router.post('/detect-ai-text', async (req, res) => {
  try {
    const { text, userId } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Text input is required' 
      });
    }

    const result = await detectAIText(text, userId || 'anonymous');
    
    return res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error in AI detection:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during detection process',
      error: error.message
    });
  }
});

module.exports = router;
