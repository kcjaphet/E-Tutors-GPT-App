
const express = require('express');
const cors = require('cors');
const { loadEnv } = require('./config/env');
const connectDB = require('./config/db');
const detectRoutes = require('./routes/detect');
const humanizeRoutes = require('./routes/humanize');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');

// Load environment variables
loadEnv();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Special handling for Stripe webhooks (needs raw body)
app.use('/api/webhook', webhookRoutes);

// Regular JSON parsing for all other routes
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', detectRoutes);
app.use('/api', humanizeRoutes);
app.use('/api', paymentRoutes);
app.use('/api/auth', authRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('GPTTextTools API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
