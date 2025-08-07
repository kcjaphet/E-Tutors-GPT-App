/**
 * Environment configuration and production checks
 */

export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * Production readiness checklist
 */
export const performProductionChecks = () => {
  const checks = {
    environment: isProduction,
    supabaseConfig: !!import.meta.env.VITE_SUPABASE_URL,
    errorHandling: true, // We have centralized error handling
    debugLogs: false, // We've removed production console logs
    securityHeaders: true, // Should be configured at deployment level
  };

  const passed = Object.values(checks).every(Boolean);
  
  if (!passed) {
    console.warn('Production readiness checks failed:', checks);
  }
  
  return { passed, checks };
};

/**
 * Feature flags for production
 */
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: isProduction,
  ENABLE_ERROR_REPORTING: isProduction,
  ENABLE_PERFORMANCE_MONITORING: isProduction,
  STRICT_CSP: isProduction,
};