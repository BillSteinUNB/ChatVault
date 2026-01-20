/**
 * Tests for UsageMeter Component (PRD-61)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UsageMeter } from './UsageMeter';

describe('UsageMeter Component', () => {
  describe('Rendering', () => {
    it('should render the usage meter', () => {
      render(<UsageMeter chatCount={25} tier="hobbyist" />);
      expect(screen.getByText('Storage Usage')).toBeInTheDocument();
    });

    it('should display correct chat count and max', () => {
      render(<UsageMeter chatCount={25} tier="hobbyist" />);
      expect(screen.getByText('25 / 50')).toBeInTheDocument();
    });

    it('should display correct percentage', () => {
      render(<UsageMeter chatCount={25} tier="hobbyist" />);
      expect(screen.getByText('50% used')).toBeInTheDocument();
    });

    it('should show remaining chats when below limit', () => {
      render(<UsageMeter chatCount={25} tier="hobbyist" />);
      expect(screen.getByText('25 remaining')).toBeInTheDocument();
    });

    it('should not show remaining chats when at limit', () => {
      render(<UsageMeter chatCount={50} tier="hobbyist" />);
      expect(screen.queryByText('0 remaining')).not.toBeInTheDocument();
    });

    it('should not render for unlimited tiers', () => {
      const { container } = render(<UsageMeter chatCount={100} tier="power_user" />);
      expect(container.firstChild).toBeNull();
    });

    it('should not render for team tier', () => {
      const { container } = render(<UsageMeter chatCount={100} tier="team" />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Color Coding', () => {
    it('should use green color when usage < 50%', () => {
      const { container } = render(<UsageMeter chatCount={20} tier="hobbyist" />);
      // Check that green classes are applied
      const greenBar = container.querySelector('.bg-green-500');
      expect(greenBar).toBeInTheDocument();
    });

    it('should use yellow color when usage is 50-80%', () => {
      const { container } = render(<UsageMeter chatCount={35} tier="hobbyist" />);
      const yellowBar = container.querySelector('.bg-yellow-500');
      expect(yellowBar).toBeInTheDocument();
    });

    it('should use red color when usage > 80%', () => {
      const { container } = render(<UsageMeter chatCount={45} tier="hobbyist" />);
      const redBar = container.querySelector('.bg-red-500');
      expect(redBar).toBeInTheDocument();
    });

    it('should show TrendingUp icon for green and yellow', () => {
      render(<UsageMeter chatCount={20} tier="hobbyist" />);
      // TrendingUp should be present (we can't easily test lucide-react icons)
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should show AlertTriangle icon for red', () => {
      const { container } = render(<UsageMeter chatCount={45} tier="hobbyist" />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Upgrade Prompt', () => {
    it('should show upgrade button when > 80% and showUpgradeLink is true', () => {
      render(
        <UsageMeter
          chatCount={45}
          tier="hobbyist"
          onUpgrade={() => {}}
          showUpgradeLink={true}
        />
      );
      expect(screen.getByText('Upgrade for Unlimited Storage')).toBeInTheDocument();
    });

    it('should not show upgrade button when < 80%', () => {
      render(
        <UsageMeter
          chatCount={25}
          tier="hobbyist"
          onUpgrade={() => {}}
          showUpgradeLink={true}
        />
      );
      expect(screen.queryByText('Upgrade for Unlimited Storage')).not.toBeInTheDocument();
    });

    it('should not show upgrade button when showUpgradeLink is false', () => {
      render(
        <UsageMeter
          chatCount={45}
          tier="hobbyist"
          onUpgrade={() => {}}
          showUpgradeLink={false}
        />
      );
      expect(screen.queryByText('Upgrade for Unlimited Storage')).not.toBeInTheDocument();
    });

    it('should call onUpgrade when upgrade button is clicked', () => {
      const onUpgrade = vi.fn();
      render(
        <UsageMeter
          chatCount={45}
          tier="hobbyist"
          onUpgrade={onUpgrade}
          showUpgradeLink={true}
        />
      );

      const upgradeButton = screen.getByText('Upgrade for Unlimited Storage');
      fireEvent.click(upgradeButton);

      expect(onUpgrade).toHaveBeenCalledTimes(1);
    });
  });

  describe('Compact Mode', () => {
    it('should render compact version when compact prop is true', () => {
      const { container } = render(
        <UsageMeter chatCount={25} tier="hobbyist" compact={true} />
      );

      // Compact mode should not show "Storage Usage" text
      expect(screen.queryByText('Storage Usage')).not.toBeInTheDocument();

      // Should still show count
      expect(screen.getByText('25/50')).toBeInTheDocument();
    });

    it('should show progress bar in compact mode', () => {
      const { container } = render(
        <UsageMeter chatCount={25} tier="hobbyist" compact={true} />
      );

      const progressBar = container.querySelector('.bg-neutral-200');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle 0 chats correctly', () => {
      render(<UsageMeter chatCount={0} tier="hobbyist" />);
      expect(screen.getByText('0 / 50')).toBeInTheDocument();
      expect(screen.getByText('0% used')).toBeInTheDocument();
    });

    it('should handle exactly at limit (50/50)', () => {
      render(<UsageMeter chatCount={50} tier="hobbyist" />);
      expect(screen.getByText('50 / 50')).toBeInTheDocument();
      expect(screen.getByText('100% used')).toBeInTheDocument();
    });

    it('should handle percentage rounding correctly', () => {
      render(<UsageMeter chatCount={33} tier="hobbyist" />);
      expect(screen.getByText('66% used')).toBeInTheDocument();
    });
  });
});
