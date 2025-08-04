
const express = require('express');
const cors = require('cors');
const { loadEnv } = require('./config/env');
const connectDB = require('./config/db');
const detectRoutes = require('./routes/detect');
const humanizeRoutes = require('./routes/humanize');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');
const authRoutes = require('./routes/auth');
const textToolsRoutes = require('./routes/textTools');
const dbTestRoutes = require('./routes/db-test');
const fs = require('fs');
const path = require('path');

// Load environment variables
loadEnv();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
app.use('/api', textToolsRoutes);
app.use('/api/db', dbTestRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('GPTTextTools API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});
