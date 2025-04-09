
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
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing required environment variables: ${missingVars.join(', ')}`);
  }
};

module.exports = { loadEnv };
