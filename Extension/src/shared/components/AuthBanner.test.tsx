import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthBanner } from './AuthBanner';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock the Button component
vi.mock('./ui/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  AlertCircle: () => <span data-testid="alert-icon">⚠</span>,
  CheckCircle: () => <span data-testid="check-icon">✓</span>,
}));

// Mock chrome.runtime.sendMessage
const mockSendMessage = vi.fn();

global.chrome = {
  runtime: {
    sendMessage: mockSendMessage,
  },
  tabs: {
    create: vi.fn(),
  },
} as any;

describe('AuthBanner', () => {
  beforeEach(() => {
    mockSendMessage.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when loading', () => {
    it('returns null while loading', async () => {
      // Mock a delayed response
      mockSendMessage.mockImplementation(() => new Promise(() => {}));
      render(<AuthBanner />);
      
      await waitFor(() => {
        expect(screen.queryByText('Sign in')).not.toBeInTheDocument();
      });
    });
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockSendMessage.mockResolvedValue({
        authenticated: false,
        user: null
      });
    });

    it('shows sign in prompt', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('Sign in to sync your chats across devices')).toBeInTheDocument();
      });
    });

    it('shows sign in button', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        const button = screen.getByText('Sign in');
        expect(button).toBeInTheDocument();
      });
    });

    it('opens login page when sign in button is clicked', async () => {
      const mockCreate = vi.fn();
      global.chrome.tabs = { create: mockCreate } as any;

      render(<AuthBanner />);

      await waitFor(() => {
        const button = screen.getByText('Sign in');
        button.click();
      });

      expect(mockCreate).toHaveBeenCalledWith({
        url: 'http://localhost:5173/#/login'
      });
    });
  });

  describe('when user is verified', () => {
    const verifiedUser = {
      email: 'verified@example.com',
      email_confirmed_at: new Date().toISOString(),
    };

    beforeEach(() => {
      mockSendMessage.mockResolvedValue({
        authenticated: true,
        user: verifiedUser
      });
    });

    it('shows verified status', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('verified@example.com')).toBeInTheDocument();
        expect(screen.getByText('Verified')).toBeInTheDocument();
      });
    });

    it('shows green/emerald styling for verified user', async () => {
      const { container } = render(<AuthBanner />);

      await waitFor(() => {
        const banner = container.firstChild as HTMLElement;
        expect(banner).toHaveClass('bg-emerald-500/10');
        expect(banner).toHaveClass('border-emerald-500/30');
      });
    });

    it('shows sign out button', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('Sign out')).toBeInTheDocument();
      });
    });

    it('does not show resend button', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.queryByText('Resend')).not.toBeInTheDocument();
        expect(screen.queryByText('Sending...')).not.toBeInTheDocument();
      });
    });

    it('signs out when sign out button is clicked', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        const signOutButton = screen.getByText('Sign out');
        signOutButton.click();
      });

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith({ type: 'SIGN_OUT' });
      });
    });
  });

  describe('when user is not verified', () => {
    const unverifiedUser = {
      email: 'unverified@example.com',
      email_confirmed_at: null,
    };

    beforeEach(() => {
      mockSendMessage.mockResolvedValue({
        authenticated: true,
        user: unverifiedUser
      });
    });

    it('shows unverified status', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('unverified@example.com')).toBeInTheDocument();
        expect(screen.getByText('Please verify your email address')).toBeInTheDocument();
      });
    });

    it('shows yellow/warning styling for unverified user', async () => {
      const { container } = render(<AuthBanner />);

      await waitFor(() => {
        const banner = container.firstChild as HTMLElement;
        expect(banner).toHaveClass('bg-yellow-500/10');
        expect(banner).toHaveClass('border-yellow-500/30');
      });
    });

    it('shows resend button', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('Resend')).toBeInTheDocument();
      });
    });

    it('shows sign out button', async () => {
      render(<AuthBanner />);

      await waitFor(() => {
        expect(screen.getByText('Sign out')).toBeInTheDocument();
      });
    });

    it('resends verification email when resend button is clicked', async () => {
      mockSendMessage
        .mockResolvedValueOnce({
          authenticated: true,
          user: { email: 'unverified@example.com', email_confirmed_at: null }
        })
        .mockResolvedValueOnce({
          success: true
        });

      render(<AuthBanner />);

      await waitFor(async () => {
        const resendButton = await screen.findByText('Resend');
        resendButton.click();
      });

      await waitFor(() => {
        expect(mockSendMessage).toHaveBeenCalledWith({
          type: 'RESEND_VERIFICATION',
          email: 'unverified@example.com'
        });
      });
    });

    it('shows success message after successful resend', async () => {
      mockSendMessage
        .mockResolvedValueOnce({
          authenticated: true,
          user: { email: 'unverified@example.com', email_confirmed_at: null }
        })
        .mockResolvedValueOnce({
          success: true
        });

      render(<AuthBanner />);

      await waitFor(async () => {
        const resendButton = await screen.findByText('Resend');
        resendButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('Verification email sent! Check your inbox.')).toBeInTheDocument();
      });
    });

    it('shows error message after failed resend', async () => {
      mockSendMessage
        .mockResolvedValueOnce({
          authenticated: true,
          user: { email: 'unverified@example.com', email_confirmed_at: null }
        })
        .mockResolvedValueOnce({
          success: false,
          error: 'Failed to resend'
        });

      render(<AuthBanner />);

      await waitFor(async () => {
        const resendButton = await screen.findByText('Resend');
        resendButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to resend')).toBeInTheDocument();
      });
    });

    it('shows "Sending..." text while resending', async () => {
      let resolveResend: (value: any) => void;
      mockSendMessage
        .mockResolvedValueOnce({
          authenticated: true,
          user: { email: 'unverified@example.com', email_confirmed_at: null }
        })
        .mockReturnValueOnce(new Promise(resolve => {
          resolveResend = resolve;
        }));

      render(<AuthBanner />);

      await waitFor(async () => {
        const resendButton = await screen.findByText('Resend');
        resendButton.click();
      });

      await waitFor(() => {
        expect(screen.getByText('Sending...')).toBeInTheDocument();
      });

      resolveResend!({ success: true });
    });

    it('disables resend button while resending', async () => {
      let resolveResend: (value: any) => void;
      mockSendMessage
        .mockResolvedValueOnce({
          authenticated: true,
          user: { email: 'unverified@example.com', email_confirmed_at: null }
        })
        .mockReturnValueOnce(new Promise(resolve => {
          resolveResend = resolve;
        }));

      render(<AuthBanner />);

      await waitFor(async () => {
        const resendButton = await screen.findByText('Resend');
        resendButton.click();
      });

      await waitFor(() => {
        const button = screen.getByText('Sending...');
        expect(button).toBeDisabled();
      });

      resolveResend!({ success: true });
    });
  });
});
