
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use environment variable if available, otherwise fall back to hardcoded string
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://etutorsDB_admin:mymama123%40@cluster0.yoxj8bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
    
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
