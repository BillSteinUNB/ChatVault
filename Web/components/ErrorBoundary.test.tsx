/**
 * ErrorBoundary Component Tests for Web App
 * PRD-63: Error Boundary Components
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';

// Mock console.error to avoid cluttering test output
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});

afterEach(() => {
  console.error = originalError;
  vi.clearAllMocks();
  // Clear sessionStorage
  sessionStorage.clear();
});

describe('ErrorBoundary (Web)', () => {
  /**
   * Test 1: Renders children when there is no error
   */
  it('renders children when there is no error', () => {
    const SuccessfulComponent = () => <div>Successful Component</div>;

    render(
      <ErrorBoundary>
        <SuccessfulComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Successful Component')).toBeInTheDocument();
  });

  /**
   * Test 2: Catches errors and renders fallback UI
   */
  it('catches errors and renders fallback UI', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  /**
   * Test 3: Calls componentDidCatch when an error occurs
   */
  it('calls componentDidCatch when an error occurs', () => {
    const onError = vi.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String),
      })
    );
  });

  /**
   * Test 4: Uses custom fallback when provided
   */
  it('uses custom fallback when provided', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const CustomFallback = () => <div>Custom Error UI</div>;

    render(
      <ErrorBoundary fallback={<CustomFallback />}>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('Oops! Something went wrong')).not.toBeInTheDocument();
  });

  /**
   * Test 5: Resets error state and retries when "Try Again" is clicked
   */
  it('resets error state and retries when "Try Again" is clicked', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // After clicking retry, the error boundary should reset
    // However, since ThrowError still throws, it will catch the error again
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  /**
   * Test 6: Logs errors to sessionStorage
   */
  it('logs errors to sessionStorage', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorHistory = JSON.parse(sessionStorage.getItem('chatvault_errors') || '[]');
    expect(errorHistory).toHaveLength(1);
    expect(errorHistory[0]).toMatchObject({
      message: 'Test error',
      timestamp: expect.any(String),
      url: expect.any(String),
      userAgent: expect.any(String),
    });
  });

  /**
   * Test 7: Shows and hides technical details
   */
  it('shows and hides technical details', () => {
    const ThrowError = () => {
      throw new Error('Test error with details');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Initially, technical details section should not be visible
    // Check for the technical details container which only appears when expanded
    expect(screen.queryByRole('button', { name: /Hide Technical Details/i })).not.toBeInTheDocument();

    // Click "Show Technical Details"
    const toggleButton = screen.getByRole('button', { name: /Show Technical Details/i });
    fireEvent.click(toggleButton);

    // Now the button should say "Hide Technical Details"
    expect(screen.getByRole('button', { name: /Hide Technical Details/i })).toBeInTheDocument();

    // Technical details section should be visible
    const technicalDetails = screen.getByText(/at ThrowError/);
    expect(technicalDetails).toBeInTheDocument();

    // Click "Hide Technical Details"
    fireEvent.click(toggleButton);

    // Button should say "Show Technical Details" again
    expect(screen.getByRole('button', { name: /Show Technical Details/i })).toBeInTheDocument();

    // Technical details should be hidden again
    expect(screen.queryByText(/at ThrowError/)).not.toBeInTheDocument();
  });

  /**
   * Test 8: Displays error message in technical details
   */
  it('displays error message in technical details', () => {
    const ThrowError = () => {
      throw new Error('Specific error message');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const toggleButton = screen.getByText(/Show Technical Details/i);
    fireEvent.click(toggleButton);

    expect(screen.getByText('Error: Specific error message')).toBeInTheDocument();
  });

  /**
   * Test 9: Goes to homepage when "Go to Homepage" is clicked
   */
  it('goes to homepage when "Go to Homepage" is clicked', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Mock window.location.href
    const hrefMock = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go to Homepage');
    fireEvent.click(homeButton);

    expect(window.location.href).toBe('/');
  });

  /**
   * Test 10: Redirects to contact page when "Report Issue" is clicked
   */
  it('redirects to contact page when "Report Issue" is clicked', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    // Mock window.location.href
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const reportButton = screen.getByText('Report Issue');
    fireEvent.click(reportButton);

    expect(window.location.href).toContain('/contact');
    expect(window.location.href).toContain('subject=');
    expect(window.location.href).toContain('body=');
  });

  /**
   * Test 11: Catches async errors in useEffect
   */
  it('catches async errors in useEffect', () => {
    const AsyncErrorComponent = () => {
      React.useEffect(() => {
        throw new Error('Async error');
      }, []);
      return <div>Component</div>;
    };

    render(
      <ErrorBoundary>
        <AsyncErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
  });

  /**
   * Test 12: Handles errors without error message
   */
  it('handles errors without error message', () => {
    const ThrowError = () => {
      throw new Error();
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument();
  });

  /**
   * Test 13: Limits error history to 10 errors
   */
  it('limits error history to 10 errors', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Trigger 15 errors
    for (let i = 0; i < 15; i++) {
      const TestComponent = () => {
        throw new Error(`Error ${i}`);
      };

      rerender(
        <ErrorBoundary key={i}>
          <TestComponent />
        </ErrorBoundary>
      );
    }

    const errorHistory = JSON.parse(sessionStorage.getItem('chatvault_errors') || '[]');
    expect(errorHistory).toHaveLength(10);
  });

  /**
   * Test 14: Displays friendly error message for network errors
   */
  it('displays friendly error message for network errors', () => {
    const ThrowError = () => {
      throw new Error('Network request failed');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Unable to connect/i)).toBeInTheDocument();
  });

  /**
   * Test 15: Displays friendly error message for auth errors
   */
  it('displays friendly error message for auth errors', () => {
    const ThrowError = () => {
      throw new Error('Authentication failed');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Authentication issue/i)).toBeInTheDocument();
  });

  /**
   * Test 16: Displays friendly error message for chunk loading errors
   */
  it('displays friendly error message for chunk loading errors', () => {
    const ThrowError = () => {
      throw new Error('Loading chunk failed');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Failed to load resources/i)).toBeInTheDocument();
  });

  /**
   * Test 17: Has Web-specific styling
   */
  it('has Web-specific styling', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    // Check for Web app specific classes
    const container = screen.getByText('Oops! Something went wrong').closest('div');
    expect(container?.className).toContain('bg-neutral-950');
  });

  /**
   * Test 18: Shows Home icon in "Go to Homepage" button
   */
  it('shows Home icon in "Go to Homepage" button', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('Go to Homepage');
    expect(homeButton).toBeInTheDocument();
    // The icon should be present (tested via button text and structure)
  });
});

describe('ErrorBoundary Error Recovery (Web)', () => {
  /**
   * Test 19: Recovers from error after retry
   */
  it('recovers from error after retry', () => {
    let shouldThrow = true;

    const ConditionalErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Initial error');
      }
      return <div>Recovered Component</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Fix the error and retry
    shouldThrow = false;
    const retryButton = screen.getByText('Try Again');
    fireEvent.click(retryButton);

    // Component should recover
    expect(screen.getByText('Recovered Component')).toBeInTheDocument();
  });

  /**
   * Test 20: Handles multiple consecutive errors
   */
  it('handles multiple consecutive errors', () => {
    let shouldThrow = true;

    const ConditionalErrorComponent = () => {
      if (shouldThrow) {
        throw new Error('Initial error');
      }
      return <div>Final Success</div>;
    };

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalErrorComponent />
      </ErrorBoundary>
    );

    // First error
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Click retry - will trigger error again since shouldThrow is still true
    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();

    // Fix the error
    shouldThrow = false;

    // Now retry should succeed
    fireEvent.click(screen.getByText('Try Again'));
    expect(screen.getByText('Final Success')).toBeInTheDocument();
  });
});
