import React, { createContext, useContext, useState, useCallback } from 'react';
import { ErrorType, ErrorConfig } from '../types/error';
import { getErrorConfig } from '../utils/errorUtils';

interface ErrorContextType {
  currentError: Error | null;
  errorConfig: ErrorConfig | null;
  setError: (error: Error) => void;
  clearError: () => void;
  setErrorType: (type: ErrorType) => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const [errorConfig, setErrorConfig] = useState<ErrorConfig | null>(null);

  const setError = useCallback((error: Error) => {
    setCurrentError(error);
    setErrorConfig(getErrorConfig(error));
  }, []);

  const clearError = useCallback(() => {
    setCurrentError(null);
    setErrorConfig(null);
  }, []);

  const setErrorType = useCallback((type: ErrorType) => {
    const config: ErrorConfig = {
      type,
      title: type === 'notFound' ? 'Page Not Found' : 'Error',
      message: type === 'notFound' ? 'The page you are looking for does not exist.' : 'An error occurred.',
      showRetry: type !== 'notFound',
      showGoBack: true,
      showGoHome: true,
    };
    setErrorConfig(config);
  }, []);

  const value: ErrorContextType = {
    currentError,
    errorConfig,
    setError,
    clearError,
    setErrorType,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
}; 