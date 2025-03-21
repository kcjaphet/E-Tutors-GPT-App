
/**
 * Configuration file for API endpoints
 */

// Use environment variable for API URL with fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoints
export const API_ENDPOINTS = {
  DETECT_AI_TEXT: `${API_BASE_URL}/api/detect-ai-text`,
  HUMANIZE_TEXT: `${API_BASE_URL}/api/humanize-text`,
};
