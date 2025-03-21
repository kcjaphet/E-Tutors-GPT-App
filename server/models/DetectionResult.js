
const mongoose = require('mongoose');

const detectionResultSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  originalText: {
    type: String,
    required: true
  },
  detectionResults: {
    aiProbability: Number,
    confidenceLevel: String,
    analysis: String,
    textLength: Number
  },
  humanizedText: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DetectionResult', detectionResultSchema);
