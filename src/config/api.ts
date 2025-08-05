
/**
 * Configuration file for API endpoints
 */

// Use Supabase Edge Functions
export const API_BASE_URL = 'https://jusuwufpgirouvyrmaxe.supabase.co/functions/v1';

// API endpoints
export const API_ENDPOINTS = {
  DETECT_AI_TEXT: `${API_BASE_URL}/detect-ai-text`,
  HUMANIZE_TEXT: `${API_BASE_URL}/humanize-text`,
  LITERATURE_REVIEW: `${API_BASE_URL}/literature-review`,
  TEXT_PROCESS: `${API_BASE_URL}/text-process`,
  PDF_SUMMARY: `${API_BASE_URL}/pdf-summary`
};

// API request configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds timeout
  RETRY_ATTEMPTS: 2,
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
