export interface ErrorInfo {
  componentStack?: string | null | undefined;
}

export interface ErrorState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface ErrorPageProps {
  error?: Error;
  errorCode?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  onGoHome?: () => void;
}

export type ErrorType = 
  | 'notFound'
  | 'notAuthorized'
  | 'serverError'
  | 'networkError'
  | 'unknown';

export interface ErrorConfig {
  type: ErrorType;
  title: string;
  message: string;
  showRetry?: boolean;
  showGoBack?: boolean;
  showGoHome?: boolean;
} 