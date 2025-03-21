
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const detectRoutes = require('./routes/detect');
const humanizeRoutes = require('./routes/humanize');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api', detectRoutes);
app.use('/api', humanizeRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('GPTTextTools API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
