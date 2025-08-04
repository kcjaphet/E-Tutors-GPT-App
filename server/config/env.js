
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const loadEnv = () => {
  const envPath = path.resolve(__dirname, '../.env');
  
  if (fs.existsSync(envPath)) {
    console.log('Loading environment variables from .env file');
    const result = dotenv.config({ path: envPath });
    
    if (result.error) {
      console.error('Error loading .env file:', result.error);
    }
  } else {
    console.log('No .env file found, using existing environment variables');
  }
  
  // Validate required environment variables
  const requiredVars = [
    'MONGO_URI',
    'OPENAI_API_KEY'
  ];
  
  // Optional environment variables with defaults
  const optionalVars = {
    'NODE_ENV': 'production',
    'PORT': '5000',
    'CORS_ORIGIN': '*'
  };
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Make sure to set these before using the API in production mode.');
    // Set default MongoDB URI if it's missing
    if (missingVars.includes('MONGO_URI')) {
      process.env.MONGO_URI = 'mongodb+srv://etutorsDB_admin:mymama123%40@cluster0.yoxj8bn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
      console.log('Using default MongoDB URI');
    }
  } else {
    console.log('All required environment variables are set');
  }
};

module.exports = { loadEnv };
