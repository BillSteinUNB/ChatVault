/**
 * ErrorToast Component Tests
 * PRD-64: Test suite for Error Toast component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorToast } from './ErrorToast';
import { useStore } from '../lib/storage';

// Mock the store
vi.mock('../lib/storage');

// Mock timers for auto-dismiss testing
vi.useFakeTimers();

describe('ErrorToast Component', () => {
  const mockClearError = vi.fn();
  const mockError = {
    code: 'NETWORK_ERROR' as const,
    message: 'Network error details',
    userMessage: "Can't connect. Check your internet.",
    recoverable: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      error: mockError,
      clearError: mockClearError,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('when there is an error', () => {
    it('should render the toast with error message', () => {
      render(<ErrorToast />);

      expect(screen.getByText("Can't connect. Check your internet.")).toBeInTheDocument();
    });

    it('should display error icon', () => {
      const { container } = render(<ErrorToast />);

      const icon = container.querySelector('[aria-hidden="true"]');
      expect(icon).toBeInTheDocument();
    });

    it('should have correct role and aria attributes', () => {
      render(<ErrorToast />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('aria-live', 'assertive');
      expect(alert).toHaveAttribute('aria-atomic', 'true');
    });

    it('should show recoverable message for recoverable errors', () => {
      render(<ErrorToast />);

      expect(screen.getByText(/This action can be retried/)).toBeInTheDocument();
    });

    it('should position at bottom by default', () => {
      const { container } = render(<ErrorToast />);

      const toast = container.querySelector('.fixed.bottom-0');
      expect(toast).toBeInTheDocument();
    });

    it('should position at top when position prop is "top"', () => {
      const { container } = render(<ErrorToast position="top" />);

      const toast = container.querySelector('.fixed.top-0');
      expect(toast).toBeInTheDocument();
    });
  });

  describe('when there is no error', () => {
    beforeEach(() => {
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: null,
        clearError: mockClearError,
      });
    });

    it('should not render anything', () => {
      const { container } = render(<ErrorToast />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe('dismiss functionality', () => {
    it('should call clearError when dismiss button is clicked', async () => {
      const user = userEvent.setup();
      render(<ErrorToast />);

      const dismissButton = screen.getByLabelText('Dismiss error');
      await user.click(dismissButton);

      expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('should have accessible dismiss button', () => {
      render(<ErrorToast />);

      const dismissButton = screen.getByLabelText('Dismiss error');
      expect(dismissButton).toBeInTheDocument();
      expect(dismissButton).toHaveAttribute('type', 'button');
    });
  });

  describe('auto-dismiss', () => {
    it('should auto-dismiss after default timeout (5000ms)', async () => {
      render(<ErrorToast />);

      // Initially visible
      expect(screen.getByText("Can't connect. Check your internet.")).toBeInTheDocument();

      // Fast forward 5 seconds
      vi.advanceTimersByTime(5000);

      // Should be dismissed (clearError called)
      expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('should auto-dismiss after custom timeout', async () => {
      render(<ErrorToast autoDismissTimeout={3000} />);

      // Initially visible
      expect(screen.getByText("Can't connect. Check your internet.")).toBeInTheDocument();

      // Fast forward 3 seconds
      vi.advanceTimersByTime(3000);

      // Should be dismissed
      expect(mockClearError).toHaveBeenCalledTimes(1);
    });

    it('should not auto-dismiss before timeout', async () => {
      render(<ErrorToast autoDismissTimeout={5000} />);

      // Fast forward 2 seconds
      vi.advanceTimersByTime(2000);

      // Should not be dismissed yet
      expect(mockClearError).not.toHaveBeenCalled();
    });

    it('should clear timer when error changes', () => {
      const { rerender } = render(<ErrorToast />);

      // Fast forward 2 seconds
      vi.advanceTimersByTime(2000);

      // Change error
      const newError = {
        code: 'AUTH_ERROR' as const,
        message: 'Auth error',
        userMessage: 'Authentication failed. Please sign in.',
        recoverable: false,
      };
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: newError,
        clearError: mockClearError,
      });

      rerender(<ErrorToast />);

      // Fast forward another 3 seconds (total 5 seconds from start)
      vi.advanceTimersByTime(3000);

      // Should not have dismissed yet (timer should have reset)
      expect(mockClearError).not.toHaveBeenCalled();
    });
  });

  describe('error types', () => {
    it('should display NETWORK_ERROR message correctly', () => {
      const networkError = {
        code: 'NETWORK_ERROR' as const,
        message: 'Network error',
        userMessage: "Can't connect. Check your internet.",
        recoverable: true,
      };
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: networkError,
        clearError: mockClearError,
      });

      render(<ErrorToast />);

      expect(screen.getByText("Can't connect. Check your internet.")).toBeInTheDocument();
    });

    it('should display AUTH_ERROR message correctly', () => {
      const authError = {
        code: 'AUTH_ERROR' as const,
        message: 'Auth error',
        userMessage: 'Authentication failed. Please sign in.',
        recoverable: false,
      };
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: authError,
        clearError: mockClearError,
      });

      render(<ErrorToast />);

      expect(screen.getByText('Authentication failed. Please sign in.')).toBeInTheDocument();
    });

    it('should display STORAGE_FULL message correctly', () => {
      const storageError = {
        code: 'STORAGE_FULL' as const,
        message: 'Storage full',
        userMessage: 'Storage full. Delete chats or upgrade.',
        recoverable: false,
      };
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: storageError,
        clearError: mockClearError,
      });

      render(<ErrorToast />);

      expect(screen.getByText('Storage full. Delete chats or upgrade.')).toBeInTheDocument();
    });

    it('should display UNKNOWN error message correctly', () => {
      const unknownError = {
        code: 'UNKNOWN' as const,
        message: 'Unknown error',
        userMessage: 'Something went wrong. Try again.',
        recoverable: false,
      };
      (useStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        error: unknownError,
        clearError: mockClearError,
      });

      render(<ErrorToast />);

      expect(screen.getByText('Something went wrong. Try again.')).toBeInTheDocument();
    });
  });

  describe('styling and accessibility', () => {
    it('should apply correct styling classes', () => {
      const { container } = render(<ErrorToast />);

      const toastContainer = container.querySelector('.bg-red-50');
      expect(toastContainer).toBeInTheDocument();
    });

    it('should support dark mode classes', () => {
      const { container } = render(<ErrorToast />);

      const toastContainer = container.querySelector('.dark\\:bg-red-900\\/20');
      expect(toastContainer).toBeInTheDocument();
    });

    it('should have proper focus styles on dismiss button', () => {
      render(<ErrorToast />);

      const dismissButton = screen.getByLabelText('Dismiss error');
      expect(dismissButton).toHaveClass('focus:ring-2');
    });
  });
});
