import { useCallback } from 'react';
import { useError } from '../providers/ErrorProvider';
import { logError } from '../utils/errorUtils';

export const useErrorBoundary = () => {
  const { setError, clearError } = useError();

  const handleError = useCallback((error: Error, errorInfo?: any) => {
    // Log the error
    logError(error, errorInfo);
    
    // Set the error in context
    setError(error);
  }, [setError]);

  const handleReset = useCallback(() => {
    clearError();
  }, [clearError]);

  const navigateToHome = useCallback(() => {
    // Use a more reliable navigation approach
    const currentOrigin = window.location.origin;
    const baseUrl = import.meta.env.BASE_URL || '/';
    const homeUrl = `${currentOrigin}${baseUrl}`;
    
    // Force a complete page reload to ensure clean state
    window.location.href = homeUrl;
  }, []);

  return {
    handleError,
    handleReset,
    navigateToHome,
  };
}; 