import { ErrorType, ErrorConfig } from '../types/error';

export const getErrorConfig = (error?: Error): ErrorConfig => {
  if (!error) {
    return {
      type: 'unknown',
      title: 'Something went wrong',
      message: 'An unexpected error occurred. Please try again.',
      showRetry: false,
      showGoBack: false,
      showGoHome: true,
    };
  }

  // Check for network errors
  if (error.message.includes('Network Error') || error.message.includes('fetch')) {
    return {
      type: 'networkError',
      title: 'Connection Error',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      showRetry: false,
      showGoBack: false,
      showGoHome: true,
    };
  }

  // Check for HTTP status codes
  const statusMatch = error.message.match(/status\s*(\d+)/i);
  if (statusMatch) {
    const statusCode = parseInt(statusMatch[1]);
    
    switch (statusCode) {
      case 401:
      case 403:
        return {
          type: 'notAuthorized',
          title: 'Access Denied',
          message: 'You do not have permission to access this resource.',
          showRetry: false,
          showGoBack: false,
          showGoHome: true,
        };
      case 404:
        return {
          type: 'notFound',
          title: 'Page Not Found',
          message: 'The page you are looking for does not exist.',
          showRetry: false,
          showGoBack: false,
          showGoHome: true,
        };
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: 'serverError',
          title: 'Server Error',
          message: 'The server encountered an error. Please try again later.',
          showRetry: false,
          showGoBack: false,
          showGoHome: true,
        };
      default:
        return {
          type: 'unknown',
          title: 'Error',
          message: error.message || 'An unexpected error occurred.',
          showRetry: false,
          showGoBack: false,
          showGoHome: true,
        };
    }
  }

  // Default error configuration
  return {
    type: 'unknown',
    title: 'Error',
    message: error.message || 'An unexpected error occurred.',
    showRetry: false,
    showGoBack: false,
    showGoHome: true,
  };
};

export const logError = (error: Error, errorInfo?: any) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.error('Error caught by error boundary:', error);
    console.error('Error info:', errorInfo);
  }
  
  // In production, you could send to error reporting service
  // Example: Sentry.captureException(error, { extra: errorInfo });
};

export const isErrorBoundaryError = (error: Error): boolean => {
  // Check if this is an error that should be handled by error boundary
  return error instanceof Error && !error.message.includes('ResizeObserver');
}; 