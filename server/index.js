
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const detectRoutes = require('./routes/detect');
const humanizeRoutes = require('./routes/humanize');
const paymentRoutes = require('./routes/payment');
const webhookRoutes = require('./routes/webhook');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Special handling for Stripe webhooks (needs raw body)
app.use('/api/webhook', webhookRoutes);

// Routes
app.use('/api', detectRoutes);
app.use('/api', humanizeRoutes);
app.use('/api', paymentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('GPTTextTools API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
