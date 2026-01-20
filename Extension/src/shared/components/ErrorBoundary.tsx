/**
 * Error Boundary Component
 * PRD-63: React Error Boundary for Extension
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Class Component
 *
 * Wraps child components to catch and handle errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console
    console.error('[ChatVault ErrorBoundary] Caught error:', error, errorInfo);

    // Store error info in state
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error for debugging (in production, this would go to a service like Sentry)
    const errorLog = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    };

    // Store error in session storage for debugging
    try {
      const errorHistory = JSON.parse(sessionStorage.getItem('chatvault_errors') || '[]');
      errorHistory.push(errorLog);
      // Keep only last 10 errors
      sessionStorage.setItem('chatvault_errors', JSON.stringify(errorHistory.slice(-10)));
    } catch (e) {
      // Ignore storage errors
    }
  }

  handleRetry = (): void => {
    // Reset error state and retry
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    // Reload the entire page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback UI
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} onReload={this.handleReload} />;
    }

    return this.props.children;
  }
}

/**
 * ErrorFallback Component
 *
 * Displays a friendly error message with retry options
 */
interface ErrorFallbackProps {
  error: Error | null;
  onRetry: () => void;
  onReload: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry, onReload }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  // Get user-friendly error message
  const getErrorMessage = (): string => {
    if (!error) {
      return 'Something went wrong';
    }

    // Classify common errors
    const message = error.message.toLowerCase();

    if (message.includes('network') || message.includes('fetch')) {
      return 'Unable to connect. Please check your internet connection.';
    }

    if (message.includes('storage') || message.includes('quota')) {
      return 'Storage issue detected. Please try clearing some data.';
    }

    if (message.includes('chunk') || message.includes('loading')) {
      return 'Failed to load resources. Please refresh the page.';
    }

    return error.message || 'An unexpected error occurred';
  };

  const errorMessage = getErrorMessage();

  const handleReportIssue = (): void => {
    // Open contact page with error details pre-filled
    const subject = encodeURIComponent('ChatVault Error Report');
    const body = encodeURIComponent(
      `Error: ${errorMessage}\n\n` +
      `Error Message: ${error?.message}\n\n` +
      `Time: ${new Date().toISOString()}\n\n` +
      `User Agent: ${navigator.userAgent}\n\n` +
      `URL: ${window.location.href}`
    );

    // Open mailto link or redirect to contact page
    window.open(`mailto:support@chatvault.app?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-red-200 dark:border-red-800">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {errorMessage}
        </p>

        {/* Error details (always visible in summary, technical details toggled) */}
        {error && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors focus:outline-none focus:underline"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-900 rounded-md overflow-auto max-h-40">
                <p className="text-xs font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {error.name}: {error.message}

                  {error.stack && (
                    <>
                      {'\n\n'}
                      <span className="text-gray-500 dark:text-gray-600">{error.stack}</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={onReload}
            className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Reload Page
          </button>

          <button
            onClick={handleReportIssue}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            <MessageSquare className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;
