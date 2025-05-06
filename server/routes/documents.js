
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require('openai');
const Document = require('../models/Document');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a PDF document
 * @access  Private
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // In a production environment, you would process the PDF here
    // This would typically include:
    // 1. Extract text from PDF
    // 2. Process text with NLP or vector embeddings for retrieval
    // 3. Store in a vector database
    
    // For now, we'll just create a document record
    const newDocument = new Document({
      userId: req.body.userId,
      title: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
      // These would be determined during processing in production
      pageCount: 0,
      vectorized: false
    });

    await newDocument.save();
    
    res.status(200).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        documentId: newDocument._id,
        title: newDocument.title,
        size: newDocument.size,
        uploadDate: newDocument.createdAt
      }
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/documents/:userId
 * @desc    Get all documents for a user
 * @access  Private
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .select('-filePath -__v');
    
    res.status(200).json({
      success: true,
      data: documents
    });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/documents/:documentId/chat
 * @desc    Chat with a document using AI
 * @access  Private
 */
router.post('/:documentId/chat', async (req, res) => {
  try {
    const { documentId } = req.params;
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'No message provided'
      });
    }
    
    // Find the document
    const document = await Document.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // In a production environment, you would:
    // 1. Retrieve relevant chunks from the vector database
    // 2. Provide these chunks as context to the AI
    
    // For now, we'll simulate an AI response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant answering questions about a document titled "${document.title}". If you don't know the answer because the document content isn't available, explain that you can only simulate responses for now.`
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    const aiResponse = response.choices[0].message.content;
    
    // Update the document's last accessed timestamp
    document.lastAccessed = new Date();
    await document.save();
    
    res.status(200).json({
      success: true,
      data: {
        response: aiResponse,
        documentId,
        timestamp: new Date()
      }
    });
    
  } catch (error) {
    console.error('Error chatting with document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/documents/:documentId
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/:documentId', async (req, res) => {
  try {
    const { documentId } = req.params;
    
    const document = await Document.findById(documentId);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }
    
    // Delete the actual file
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }
    
    // Delete the document from the database
    await Document.findByIdAndDelete(documentId);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document',
      error: error.message
    });
  }
});

module.exports = router;
