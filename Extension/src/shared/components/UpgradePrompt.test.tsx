/**
 * PRD-60: UpgradePrompt Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpgradePrompt, LimitWarning } from './UpgradePrompt';

describe('UpgradePrompt Component', () => {
  const mockOnClose = vi.fn();
  const mockOnUpgrade = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('UpgradePrompt Modal', () => {
    it('should not render when isOpen is false', () => {
      const { container } = render(
        <UpgradePrompt
          isOpen={false}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('should render when isOpen is true', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      expect(screen.getByText('Chat Limit Reached')).toBeInTheDocument();
    });

    it('should display correct chat count', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      expect(screen.getByText('50 / 50')).toBeInTheDocument();
    });

    it('should display Infinity for unlimited tiers', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={100}
          maxChats={Infinity}
        />
      );
      expect(screen.getByText('100 / ∞')).toBeInTheDocument();
    });

    it('should call onClose when close button is clicked', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      const closeButton = screen.getByLabelText('Close');
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when Dismiss button is clicked', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onUpgrade when Upgrade Now button is clicked', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      const upgradeButton = screen.getByText('Upgrade Now');
      fireEvent.click(upgradeButton);
      expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
    });

    it('should display feature highlights', () => {
      render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      expect(screen.getByText('Unlimited chat storage')).toBeInTheDocument();
      expect(screen.getByText('Cloud sync across devices')).toBeInTheDocument();
      expect(screen.getByText('Advanced search & filtering')).toBeInTheDocument();
    });

    it('should close when clicking outside the modal', () => {
      const { container } = render(
        <UpgradePrompt
          isOpen={true}
          onClose={mockOnClose}
          onUpgrade={mockOnUpgrade}
          chatCount={50}
          maxChats={50}
        />
      );
      // Click on the overlay (first div with fixed position)
      const overlay = container.querySelector('.fixed.inset-0.bg-black\\/50');
      if (overlay) {
        fireEvent.click(overlay);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('LimitWarning Banner', () => {
    it('should render warning banner', () => {
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={vi.fn()}
        />
      );
      expect(screen.getByText('Approaching Chat Limit')).toBeInTheDocument();
    });

    it('should display correct percentage', () => {
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={vi.fn()}
        />
      );
      expect(screen.getByText(/80%/)).toBeInTheDocument();
    });

    it('should display chat count correctly', () => {
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={vi.fn()}
        />
      );
      expect(screen.getByText(/You're using 40 of 50 chats/)).toBeInTheDocument();
    });

    it('should call onUpgrade when Upgrade button is clicked', () => {
      const mockOnDismiss = vi.fn();
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={mockOnDismiss}
        />
      );
      const upgradeButton = screen.getByText('Upgrade');
      fireEvent.click(upgradeButton);
      expect(mockOnUpgrade).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when Dismiss button is clicked', () => {
      const mockOnDismiss = vi.fn();
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={mockOnDismiss}
        />
      );
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    it('should call onDismiss when X button is clicked', () => {
      const mockOnDismiss = vi.fn();
      render(
        <LimitWarning
          chatCount={40}
          maxChats={50}
          onUpgrade={mockOnUpgrade}
          onDismiss={mockOnDismiss}
        />
      );
      const closeButton = screen.getByLabelText('Dismiss warning');
      fireEvent.click(closeButton);
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
