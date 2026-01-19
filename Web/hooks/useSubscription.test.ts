import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSubscription } from './useSubscription';
import { supabase } from '../services/supabase';

// Mock supabase
vi.mock('../services/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('useSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should start with loading state', () => {
      const { result } = renderHook(() => useSubscription());

      expect(result.current.loading).toBe(true);
      expect(result.current.subscription).toBeNull();
      expect(result.current.error).toBeNull();
    });

    it('should have default tier as hobbyist', () => {
      const { result } = renderHook(() => useSubscription());

      expect(result.current.tier).toBe('hobbyist');
    });

    it('should have default status as active', () => {
      const { result } = renderHook(() => useSubscription());

      expect(result.current.status).toBe('active');
    });
  });

  describe('when user is not authenticated', () => {
    it('should return null subscription', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: null },
      });

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('when user is authenticated', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    };

    const mockSubscription = {
      id: 'sub-123',
      user_id: 'user-123',
      stripe_customer_id: 'cus_123',
      stripe_subscription_id: 'sub_stripe_123',
      tier: 'power_user',
      status: 'active',
      current_period_end: '2024-12-31T23:59:59Z',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };

    beforeEach(() => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: mockUser },
      });
    });

    it('should fetch subscription successfully', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockSubscription,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription).toEqual(mockSubscription);
      expect(result.current.tier).toBe('power_user');
      expect(result.current.status).toBe('active');
      expect(result.current.error).toBeNull();
    });

    it('should handle database errors', async () => {
      const mockError = new Error('Database error');
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: null,
          error: mockError,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.subscription).toBeNull();
      expect(result.current.error).toEqual(mockError);
    });

    it('should format current period end date', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: mockSubscription,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentPeriodEnd).toBe('2024-12-31T23:59:59Z');
    });

    it('should return null current period end when not set', async () => {
      const subscriptionWithoutPeriodEnd = {
        ...mockSubscription,
        current_period_end: null,
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: subscriptionWithoutPeriodEnd,
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.currentPeriodEnd).toBeNull();
    });
  });

  describe('tier types', () => {
    it('should support hobbyist tier', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'hobbyist', status: 'active' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tier).toBe('hobbyist');
    });

    it('should support power_user tier', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'power_user', status: 'active' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tier).toBe('power_user');
    });

    it('should support team tier', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'team', status: 'active' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.tier).toBe('team');
    });
  });

  describe('status types', () => {
    it('should support active status', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'hobbyist', status: 'active' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('active');
    });

    it('should support past_due status', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'power_user', status: 'past_due' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('past_due');
    });

    it('should support canceled status', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'power_user', status: 'canceled' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('canceled');
    });

    it('should support unpaid status', async () => {
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: { id: 'user-123' } },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'power_user', status: 'unpaid' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.status).toBe('unpaid');
    });
  });

  describe('refetch function', () => {
    it('should provide a refetch function', () => {
      const { result } = renderHook(() => useSubscription());

      expect(typeof result.current.refetch).toBe('function');
    });

    it('should refetch subscription when called', async () => {
      const mockUser = { id: 'user-123' };
      (supabase.auth.getUser as any).mockResolvedValue({
        data: { user: mockUser },
      });

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({
          data: { tier: 'hobbyist', status: 'active' },
          error: null,
        }),
      };

      (supabase.from as any).mockReturnValue(mockQuery);

      const { result } = renderHook(() => useSubscription());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Call refetch
      act(() => {
        result.current.refetch();
      });

      // Should have called getUser and from again
      await waitFor(() => {
        expect(supabase.auth.getUser).toHaveBeenCalled();
        expect(supabase.from).toHaveBeenCalledWith('subscriptions');
      });
    });
  });
});
