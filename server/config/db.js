
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    if (!mongoUri) {
      throw new Error('MONGO_URI environment variable is not set');
    }
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Helper function to check database connection status
const checkConnection = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return {
    isConnected: mongoose.connection.readyState === 1,
    status: states[mongoose.connection.readyState],
    db: mongoose.connection.db?.databaseName || null
  };
};

module.exports = connectDB;
module.exports.checkConnection = checkConnection;
