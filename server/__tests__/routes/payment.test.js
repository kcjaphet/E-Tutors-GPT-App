
const request = require('supertest');
const express = require('express');
const paymentRoutes = require('../../routes/payment');
const Subscription = require('../../models/Subscription');
const dbHandler = require('../utils/db-handler');

describe('Payment API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api', paymentRoutes);
  
  // Connect to a test database before running tests
  beforeAll(async () => await dbHandler.connect());
  
  // Clear all test data after each test
  afterEach(async () => await dbHandler.clearDatabase());
  
  // Disconnect and close the DB after all tests
  afterAll(async () => await dbHandler.closeDatabase());

  describe('GET /api/subscription/:userId', () => {
    it('should return free plan if no subscription exists', async () => {
      const res = await request(app).get('/api/subscription/testuser123');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.planType).toBe('free');
      expect(res.body.data.status).toBe('active');
    });
    
    it('should return existing subscription data if it exists', async () => {
      // Create a test subscription
      const subscription = new Subscription({
        userId: 'testuser123',
        planType: 'monthly',
        status: 'active',
        usageThisMonth: {
          detections: 2,
          humanizations: 1
        }
      });
      
      await subscription.save();
      
      const res = await request(app).get('/api/subscription/testuser123');
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.planType).toBe('monthly');
      expect(res.body.data.usageThisMonth.detections).toBe(2);
      expect(res.body.data.usageThisMonth.humanizations).toBe(1);
    });
  });
  
  describe('POST /api/update-usage', () => {
    it('should increment usage counter for detections', async () => {
      const res = await request(app)
        .post('/api/update-usage')
        .send({
          userId: 'testuser123',
          type: 'detection'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.detections).toBe(1);
      
      // Verify in database
      const subscription = await Subscription.findOne({ userId: 'testuser123' });
      expect(subscription.usageThisMonth.detections).toBe(1);
    });
    
    it('should increment usage counter for humanizations', async () => {
      const res = await request(app)
        .post('/api/update-usage')
        .send({
          userId: 'testuser123',
          type: 'humanization'
        });
      
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.humanizations).toBe(1);
    });
    
    it('should return 400 if type is invalid', async () => {
      const res = await request(app)
        .post('/api/update-usage')
        .send({
          userId: 'testuser123',
          type: 'invalid'
        });
      
      expect(res.statusCode).toEqual(400);
    });
  });
});
