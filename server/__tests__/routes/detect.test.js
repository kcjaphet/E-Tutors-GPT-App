
const request = require('supertest');
const express = require('express');
const dbHandler = require('../utils/db-handler');
const detectRoutes = require('../../routes/detect');
const DetectionResult = require('../../models/DetectionResult');

// Mock the detection service
jest.mock('../../services/detectionService', () => ({
  detectAIText: jest.fn().mockImplementation(async (text, userId) => {
    return {
      aiProbability: 65.5,
      confidenceLevel: 'Medium',
      analysis: 'Test analysis',
      textLength: text.length,
      timestamp: new Date().toISOString(),
      resultId: 'mocked-id-123'
    };
  })
}));

// Create a test express app
const app = express();
app.use(express.json());
app.use('/api', detectRoutes);

// Connect to in-memory database before tests
beforeAll(async () => await dbHandler.connect());

// Clear database between tests
afterEach(async () => await dbHandler.clearDatabase());

// Close database connection after tests
afterAll(async () => await dbHandler.closeDatabase());

describe('POST /api/detect-ai-text', () => {
  it('should detect AI text and return results', async () => {
    const response = await request(app)
      .post('/api/detect-ai-text')
      .send({ text: 'This is a test text', userId: 'test-user' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('aiProbability');
    expect(response.body.data).toHaveProperty('confidenceLevel');
    expect(response.body.data).toHaveProperty('analysis');
    expect(response.body.data).toHaveProperty('textLength');
  });

  it('should return 400 if text is empty', async () => {
    const response = await request(app)
      .post('/api/detect-ai-text')
      .send({ text: '', userId: 'test-user' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Text input is required');
  });

  it('should handle missing userId by using anonymous', async () => {
    const response = await request(app)
      .post('/api/detect-ai-text')
      .send({ text: 'This is a test text' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
