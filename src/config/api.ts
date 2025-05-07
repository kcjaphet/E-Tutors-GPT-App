
/**
 * Configuration file for API endpoints
 */

// Use environment variable for API URL with fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  DETECT_AI_TEXT: `${API_BASE_URL}/api/detect-ai-text`,
  HUMANIZE_TEXT: `${API_BASE_URL}/api/humanize-text`,
  LITERATURE_REVIEW: `${API_BASE_URL}/api/literature-review`,
  TEXT_PROCESS: `${API_BASE_URL}/api/text-process`,
  PDF_SUMMARY: `${API_BASE_URL}/api/pdf-summary`,
  AUTH: {
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  }
};

// API request configuration
export const API_CONFIG = {
  TIMEOUT: 60000, // 60 seconds timeout
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Configuration for optional features
export const FEATURES_CONFIG = {
  // Enable or disable features based on environment variables
  USE_GPTZERO: import.meta.env.VITE_USE_GPTZERO === 'true',
};

// Log API URL for debugging purposes
console.log('API configured with base URL:', API_BASE_URL);
