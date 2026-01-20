import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from './useOnboarding';

describe('useOnboarding', () => {
  const STORAGE_KEY = 'chatvault_onboarding';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.clear();
  });

  describe('initial state', () => {
    it('should load default state when no stored state exists', () => {
      const { result } = renderHook(() => useOnboarding());

      expect(result.current.completed).toBe(false);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.skipped).toBe(false);
    });

    it('should load stored state from localStorage', () => {
      const storedState = {
        completed: true,
        currentStep: 2,
        skipped: false,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storedState));

      const { result } = renderHook(() => useOnboarding());

      expect(result.current.completed).toBe(true);
      expect(result.current.currentStep).toBe(2);
      expect(result.current.skipped).toBe(false);
    });

    it('should merge partial stored state with defaults', () => {
      const partialState = {
        currentStep: 3,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(partialState));

      const { result } = renderHook(() => useOnboarding());

      expect(result.current.completed).toBe(false);
      expect(result.current.currentStep).toBe(3);
      expect(result.current.skipped).toBe(false);
    });
  });

  describe('nextStep', () => {
    it('should increment current step', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(1);

      act(() => {
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.currentStep).toBe(1);
      }
    });
  });

  describe('prevStep', () => {
    it('should decrement current step', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.nextStep();
      });

      expect(result.current.currentStep).toBe(3);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(2);
    });

    it('should not go below step 0', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);

      act(() => {
        result.current.prevStep();
      });

      expect(result.current.currentStep).toBe(0);
    });

    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
        result.current.prevStep();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.currentStep).toBe(0);
      }
    });
  });

  describe('complete', () => {
    it('should mark onboarding as completed', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.complete();
      });

      expect(result.current.completed).toBe(true);
      expect(result.current.skipped).toBe(false);
      expect(result.current.currentStep).toBe(0);
    });

    it('should preserve current step when completing', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.complete();
      });

      expect(result.current.completed).toBe(true);
      expect(result.current.currentStep).toBe(2);
      expect(result.current.skipped).toBe(false);
    });

    it('should persist completed state to localStorage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.complete();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.completed).toBe(true);
        expect(parsed.skipped).toBe(false);
      }
    });
  });

  describe('skip', () => {
    it('should mark onboarding as completed and skipped', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.skip();
      });

      expect(result.current.completed).toBe(true);
      expect(result.current.skipped).toBe(true);
      expect(result.current.currentStep).toBe(0);
    });

    it('should preserve current step when skipping', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.skip();
      });

      expect(result.current.completed).toBe(true);
      expect(result.current.currentStep).toBe(2);
      expect(result.current.skipped).toBe(true);
    });

    it('should persist skipped state to localStorage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.skip();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.completed).toBe(true);
        expect(parsed.skipped).toBe(true);
      }
    });
  });

  describe('reset', () => {
    it('should reset to default state', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.nextStep();
        result.current.nextStep();
        result.current.complete();
      });

      expect(result.current.completed).toBe(true);
      expect(result.current.currentStep).toBe(2);

      act(() => {
        result.current.reset();
      });

      expect(result.current.completed).toBe(false);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.skipped).toBe(false);
    });

    it('should clear localStorage', () => {
      const { result } = renderHook(() => useOnboarding());

      act(() => {
        result.current.complete();
      });

      expect(localStorage.getItem(STORAGE_KEY)).toBeDefined();

      act(() => {
        result.current.reset();
      });

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBeDefined();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.completed).toBe(false);
        expect(parsed.currentStep).toBe(0);
        expect(parsed.skipped).toBe(false);
      }
    });
  });

  describe('persistence', () => {
    it('should persist state changes across hook instances', () => {
      const { result: firstHook } = renderHook(() => useOnboarding());

      act(() => {
        firstHook.current.nextStep();
        firstHook.current.nextStep();
        firstHook.current.complete();
      });

      // Unmount first hook
      firstHook.current = null as any;

      // Mount second hook (simulating page reload)
      const { result: secondHook } = renderHook(() => useOnboarding());

      expect(secondHook.current.completed).toBe(true);
      expect(secondHook.current.currentStep).toBe(2);
      expect(secondHook.current.skipped).toBe(false);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');

      const { result } = renderHook(() => useOnboarding());

      // Should fall back to default state
      expect(result.current.completed).toBe(false);
      expect(result.current.currentStep).toBe(0);
      expect(result.current.skipped).toBe(false);
    });
  });
});
