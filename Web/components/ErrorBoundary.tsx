/**
 * Error Boundary Component
 * PRD-63: React Error Boundary for Web App
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the crashed component tree.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, MessageSquare, Home } from 'lucide-react';

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
      url: window.location.href,
      userAgent: navigator.userAgent,
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

  handleGoHome = (): void => {
    // Navigate to home page
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback UI
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} onGoHome={this.handleGoHome} />;
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
  onGoHome: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, onRetry, onGoHome }) => {
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

    if (message.includes('auth') || message.includes('unauthorized')) {
      return 'Authentication issue. Please sign in again.';
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

    // Redirect to contact page
    window.location.href = `/contact?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-200 p-4">
      <div className="max-w-md w-full bg-neutral-900 rounded-lg shadow-lg p-6 border border-red-500/30">
        {/* Error Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <h2 className="text-xl font-semibold text-white text-center mb-2">
          Oops! Something went wrong
        </h2>

        <p className="text-neutral-400 text-center mb-6">
          {errorMessage}
        </p>

        {/* Error details (always visible in summary, technical details toggled) */}
        {error && (
          <div className="mt-6 pt-6 border-t border-neutral-800">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-left text-sm text-neutral-500 hover:text-neutral-300 transition-colors focus:outline-none focus:underline"
            >
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </button>

            {showDetails && (
              <div className="mt-3 p-3 bg-neutral-950 rounded-md overflow-auto max-h-40">
                <p className="text-xs font-mono text-neutral-400 whitespace-pre-wrap">
                  {error.name}: {error.message}

                  {error.stack && (
                    <>
                      {'\n\n'}
                      <span className="text-neutral-600">{error.stack}</span>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>

          <button
            onClick={onGoHome}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </button>

          <button
            onClick={handleReportIssue}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
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
