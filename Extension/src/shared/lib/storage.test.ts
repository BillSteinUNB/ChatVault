/**
 * PRD-60: Chat Limit Enforcement Tests
 * Tests for tier limits, warning thresholds, and upgrade prompts
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from './storage';
import * as tierModule from './tier';

// Mock chrome.storage.local
const mockChromeStorage = {
  local: {
    get: vi.fn(),
    set: vi.fn(),
  },
};

// Mock chrome.runtime
const mockChromeRuntime = {
  sendMessage: vi.fn(),
  onMessage: {
    addListener: vi.fn(),
    removeListener: vi.fn(),
  },
};

global.chrome = {
  storage: mockChromeStorage,
  runtime: mockChromeRuntime,
} as any;

describe('PRD-60: Chat Limit Enforcement', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    mockChromeStorage.local.get.mockResolvedValue({});
    mockChromeStorage.local.set.mockResolvedValue(undefined);
  });

  describe('Tier State Management', () => {
    it('should have userTier state in store', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.userTier).toBeDefined();
    });

    it('should default to hobbyist tier', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.userTier).toBe('hobbyist');
    });

    it('should have setUserTier action', () => {
      const { result } = renderHook(() => useStore());
      expect(typeof result.current.setUserTier).toBe('function');
    });

    it('should update userTier when setUserTier is called', () => {
      const { result } = renderHook(() => useStore());
      act(() => {
        result.current.setUserTier('power_user');
      });
      expect(result.current.userTier).toBe('power_user');
    });

    it('should support all tier types', () => {
      const { result } = renderHook(() => useStore());
      act(() => {
        result.current.setUserTier('hobbyist');
      });
      expect(result.current.userTier).toBe('hobbyist');

      act(() => {
        result.current.setUserTier('power_user');
      });
      expect(result.current.userTier).toBe('power_user');

      act(() => {
        result.current.setUserTier('team');
      });
      expect(result.current.userTier).toBe('team');
    });
  });

  describe('Upgrade Prompt State Management', () => {
    it('should have showUpgradePrompt state in store', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.showUpgradePrompt).toBeDefined();
    });

    it('should default showUpgradePrompt to false', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.showUpgradePrompt).toBe(false);
    });

    it('should have setShowUpgradePrompt action', () => {
      const { result } = renderHook(() => useStore());
      expect(typeof result.current.setShowUpgradePrompt).toBe('function');
    });

    it('should update showUpgradePrompt when setShowUpgradePrompt is called', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.showUpgradePrompt).toBe(false);

      act(() => {
        result.current.setShowUpgradePrompt(true);
      });
      expect(result.current.showUpgradePrompt).toBe(true);

      act(() => {
        result.current.setShowUpgradePrompt(false);
      });
      expect(result.current.showUpgradePrompt).toBe(false);
    });
  });

  describe('Tier Limit Integration', () => {
    it('should correctly identify hobbyist tier limits (50 chats)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getMaxChats(tier)).toBe(50);
    });

    it('should correctly identify power_user tier limits (unlimited)', () => {
      const tier = 'power_user';
      expect(tierModule.getMaxChats(tier)).toBe(Infinity);
    });

    it('should correctly identify team tier limits (unlimited)', () => {
      const tier = 'team';
      expect(tierModule.getMaxChats(tier)).toBe(Infinity);
    });

    it('should detect approaching limit at 80% (40/50 chats)', () => {
      const tier = 'hobbyist';
      expect(tierModule.isApproachingLimit(tier, 40)).toBe(true);
    });

    it('should not detect approaching limit below 80% (30/50 chats)', () => {
      const tier = 'hobbyist';
      expect(tierModule.isApproachingLimit(tier, 30)).toBe(false);
    });

    it('should detect limit reached at exactly 50 chats', () => {
      const tier = 'hobbyist';
      expect(tierModule.isAtLimit(tier, 50)).toBe(true);
    });

    it('should detect limit exceeded at 51 chats', () => {
      const tier = 'hobbyist';
      expect(tierModule.isAtLimit(tier, 51)).toBe(true);
    });

    it('should allow saving chat below limit (49/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.canSaveChat(tier, 49)).toBe(true);
    });

    it('should not allow saving chat at limit (50/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.canSaveChat(tier, 50)).toBe(false);
    });

    it('should always allow saving for power_user tier', () => {
      const tier = 'power_user';
      expect(tierModule.canSaveChat(tier, 1000)).toBe(true);
      expect(tierModule.canSaveChat(tier, 10000)).toBe(true);
    });

    it('should always allow saving for team tier', () => {
      const tier = 'team';
      expect(tierModule.canSaveChat(tier, 1000)).toBe(true);
      expect(tierModule.canSaveChat(tier, 10000)).toBe(true);
    });
  });

  describe('Usage Percentage Calculation', () => {
    it('should calculate 50% usage correctly (25/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getUsagePercentage(tier, 25)).toBe(50);
    });

    it('should calculate 80% usage correctly (40/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getUsagePercentage(tier, 40)).toBe(80);
    });

    it('should calculate 100% usage correctly (50/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getUsagePercentage(tier, 50)).toBe(100);
    });

    it('should return null for unlimited tiers', () => {
      expect(tierModule.getUsagePercentage('power_user', 100)).toBe(null);
      expect(tierModule.getUsagePercentage('team', 100)).toBe(null);
    });

    it('should cap percentage at 100%', () => {
      const tier = 'hobbyist';
      expect(tierModule.getUsagePercentage(tier, 55)).toBe(100);
      expect(tierModule.getUsagePercentage(tier, 60)).toBe(100);
    });
  });

  describe('Remaining Chats Calculation', () => {
    it('should calculate remaining chats correctly (30 remaining)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getRemainingChats(tier, 20)).toBe(30);
    });

    it('should calculate remaining chats at 0 (50/50)', () => {
      const tier = 'hobbyist';
      expect(tierModule.getRemainingChats(tier, 50)).toBe(0);
    });

    it('should return null for unlimited tiers', () => {
      expect(tierModule.getRemainingChats('power_user', 100)).toBe(null);
      expect(tierModule.getRemainingChats('team', 100)).toBe(null);
    });
  });

  describe('PRD-64: Error State Management', () => {
    it('should have error state in store', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.error).toBeDefined();
    });

    it('should default error to null', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.error).toBeNull();
    });

    it('should have setError action', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.setError).toBeDefined();
      expect(typeof result.current.setError).toBe('function');
    });

    it('should have clearError action', () => {
      const { result } = renderHook(() => useStore());
      expect(result.current.clearError).toBeDefined();
      expect(typeof result.current.clearError).toBe('function');
    });

    it('should set error when setError is called', () => {
      const { result } = renderHook(() => useStore());
      const mockError = {
        code: 'NETWORK_ERROR' as const,
        message: 'Network error',
        userMessage: 'Cannot connect',
        recoverable: true,
      };

      act(() => {
        result.current.setError(mockError);
      });

      expect(result.current.error).toEqual(mockError);
    });

    it('should clear error when clearError is called', () => {
      const { result } = renderHook(() => useStore());
      const mockError = {
        code: 'NETWORK_ERROR' as const,
        message: 'Network error',
        userMessage: 'Cannot connect',
        recoverable: true,
      };

      // Set error first
      act(() => {
        result.current.setError(mockError);
      });
      expect(result.current.error).toEqual(mockError);

      // Clear error
      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });

    it('should update error state when setError is called multiple times', () => {
      const { result } = renderHook(() => useStore());
      const error1 = {
        code: 'NETWORK_ERROR' as const,
        message: 'Network error',
        userMessage: 'Cannot connect',
        recoverable: true,
      };
      const error2 = {
        code: 'AUTH_ERROR' as const,
        message: 'Auth error',
        userMessage: 'Authentication failed',
        recoverable: false,
      };

      act(() => {
        result.current.setError(error1);
      });
      expect(result.current.error).toEqual(error1);

      act(() => {
        result.current.setError(error2);
      });
      expect(result.current.error).toEqual(error2);
    });
  });
});
