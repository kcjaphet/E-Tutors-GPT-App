
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple test schema for database verification
const TestSchema = new mongoose.Schema({
  message: String,
  timestamp: { type: Date, default: Date.now }
});

// Only create the model if it doesn't exist (prevents model overwrite errors)
const TestModel = mongoose.models.DbTest || mongoose.model('DbTest', TestSchema);

// Test route to verify database connectivity and operations
router.get('/test', async (req, res) => {
  try {
    // Create a test document
    const testDoc = new TestModel({
      message: 'Database test entry',
      timestamp: new Date()
    });
    
    // Save to database
    await testDoc.save();
    console.log('Test document saved:', testDoc._id);
    
    // Retrieve from database to verify it was stored
    const retrievedDoc = await TestModel.findById(testDoc._id);
    
    // Clean up test data
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log('Test document cleaned up');
    
    // Respond with success
    res.status(200).json({
      success: true,
      message: 'Database connection verified',
      connectionStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      databaseName: mongoose.connection.name,
      testData: {
        saved: testDoc,
        retrieved: retrievedDoc
      }
    });
  } catch (error) {
    console.error('Database test failed:', error);
    res.status(500).json({
      success: false,
      message: 'Database test failed',
      error: error.message,
      connectionStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
  }
});

// Get current database status
router.get('/status', async (req, res) => {
  try {
    const connectionStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const status = connectionStates[mongoose.connection.readyState];
    
    res.status(200).json({
      success: true,
      connectionStatus: status,
      databaseName: mongoose.connection.name,
      host: mongoose.connection.host,
      collections: Object.keys(mongoose.connection.collections).length
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check database status',
      error: error.message
    });
  }
});

module.exports = router;
