
const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { PDFExtract } = require('pdf.js-extract');

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = path.join(__dirname, '../uploads');
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
});

// Initialize PDF extractor
const pdfExtract = new PDFExtract();

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

/**
 * @route   POST /api/pdf-summary
 * @desc    Extract and summarize text from a PDF file
 * @access  Public
 */
router.post('/pdf-summary', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file provided'
      });
    }

    const filePath = req.file.path;
    
    // Extract text from PDF
    const pdfData = await pdfExtract.extract(filePath, {});
    
    if (!pdfData || !pdfData.pages || pdfData.pages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to extract text from PDF or PDF is empty'
      });
    }
    
    // Concatenate all the content from pages
    let pdfText = '';
    pdfData.pages.forEach(page => {
      if (page.content && page.content.length > 0) {
        page.content.forEach(item => {
          pdfText += item.str + ' ';
        });
      }
    });

    // Check if we got any meaningful text
    if (pdfText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract meaningful text from the PDF'
      });
    }

    // Call OpenAI API to summarize the text
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing documents. Create a clear, concise summary that captures the main points and key details of the document. Organize the summary with headings and bullet points where appropriate."
        },
        {
          role: "user",
          content: `Summarize the following document text: "${pdfText.substring(0, 15000)}"`
        }
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    if (!response.choices || response.choices.length === 0) {
      console.error('OpenAI API Error:', response);
      return res.status(500).json({
        success: false,
        message: 'Failed to summarize PDF',
        error: 'No response from OpenAI'
      });
    }

    const summary = response.choices[0].message.content.trim();

    // Delete the temporary file
    try {
      fs.unlinkSync(filePath);
    } catch (unlinkError) {
      console.error('Error deleting temporary file:', unlinkError);
    }

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        summary: summary,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process PDF',
      error: error.message
    });
  }
});

module.exports = router;
