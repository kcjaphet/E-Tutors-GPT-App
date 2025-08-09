/**
 * Centralized error handling utilities for production deployment
 */

export interface ErrorLog {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: string;
  url: string;
  userAgent: string;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Log error for monitoring (in production, send to monitoring service)
   */
  public logError(error: Error, context?: Record<string, any>): void {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorLog);
    } else {
      // In production, you would send this to your monitoring service
      // Example: Sentry, LogRocket, or custom endpoint
      this.sendToMonitoringService(errorLog);
    }
  }

  /**
   * Handle API errors with user-friendly messages
   */
  public handleApiError(error: unknown): string {
    // Type guard for error objects with message property
    if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
      // Supabase/PostgreSQL errors
      if (error.message.includes('JWT')) {
        return 'Your session has expired. Please log in again.';
      }
      if (error.message.includes('row-level security')) {
        return 'You do not have permission to access this resource.';
      }
      if (error.message.includes('duplicate key')) {
        return 'This record already exists.';
      }
      if (error.message.includes('foreign key')) {
        return 'Unable to complete operation due to related data.';
      }
      
      // Network errors
      if (error.message.includes('fetch')) {
        return 'Network error. Please check your connection and try again.';
      }
      
      return error.message;
    }

    // HTTP status codes
    if (error && typeof error === 'object' && 'status' in error && typeof error.status === 'number') {
      switch (error.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access denied. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 429:
          return 'Too many requests. Please wait and try again.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred.';
      }
    }

    return 'An unexpected error occurred. Please try again.';
  }

  /**
   * Wrap async functions with error handling
   */
  public async withErrorHandling<T>(
    operation: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      this.logError(error as Error, context);
      throw error;
    }
  }

  private sendToMonitoringService(errorLog: ErrorLog): void {
    // Implement your monitoring service integration here
    // Examples:
    // - Sentry.captureException()
    // - LogRocket.captureException()
    // - Custom API endpoint
    
    // For now, store in localStorage as fallback
    try {
      const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      logs.push(errorLog);
      // Keep only last 100 errors
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      localStorage.setItem('errorLogs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to store error log:', e);
    }
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Global error handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorHandler.logError(new Error(event.reason), { 
    type: 'unhandledrejection' 
  });
});

// Global error handler for uncaught errors
window.addEventListener('error', (event) => {
  errorHandler.logError(event.error, { 
    type: 'uncaughtError',
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});
