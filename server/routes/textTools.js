
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @route   POST /api/text-process
 * @desc    Process text using OpenAI for various operations
 * @access  Public
 */
router.post('/text-process', async (req, res) => {
  try {
    const { text, operation, options = {} } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'No text provided'
      });
    }

    if (!operation) {
      return res.status(400).json({
        success: false,
        message: 'No operation specified'
      });
    }

    // Build the system prompt based on the operation
    let systemPrompt = "You are a helpful text processing assistant.";
    let userPrompt = "";

    switch (operation) {
      case 'summarize':
        systemPrompt = "You are an expert at summarizing text. Create a concise summary while keeping all important information.";
        userPrompt = `Summarize the following text: "${text}"`;
        break;
      
      case 'paraphrase':
        systemPrompt = "You are an expert at paraphrasing. Rewrite the text while keeping the original meaning.";
        userPrompt = `Paraphrase the following text: "${text}"`;
        break;
      
      case 'translate':
        if (!options.language) {
          return res.status(400).json({
            success: false,
            message: 'Target language not specified for translation'
          });
        }
        systemPrompt = `You are an expert translator. Translate text into ${options.language} accurately.`;
        userPrompt = `Translate the following text to ${options.language}: "${text}"`;
        break;
      
      case 'grammar':
        systemPrompt = "You are an expert at grammar correction. Fix any grammatical errors in the text.";
        userPrompt = `Fix the grammar in the following text: "${text}"`;
        break;
      
      case 'tone':
        if (!options.tone) {
          return res.status(400).json({
            success: false,
            message: 'Target tone not specified'
          });
        }
        systemPrompt = `You are an expert at adjusting the tone of text. Make the text sound more ${options.tone}.`;
        userPrompt = `Adjust the tone of the following text to be more ${options.tone}: "${text}"`;
        break;
      
      case 'enhance':
        systemPrompt = "You are an expert writer. Enhance the quality and professionalism of the text.";
        userPrompt = `Enhance the following text to make it more professional and well-written: "${text}"`;
        break;
      
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid operation specified'
        });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    if (!response.choices || response.choices.length === 0) {
      console.error('OpenAI API Error:', response);
      return res.status(500).json({
        success: false,
        message: 'Failed to process text',
        error: 'No response from OpenAI'
      });
    }

    const processedText = response.choices[0].message.content.trim();

    res.json({
      success: true,
      data: {
        originalText: text,
        processedText: processedText,
        operation: operation,
        options: options,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing text:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process text',
      error: error.message
    });
  }
});

module.exports = router;
