import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useReducedMotion, useReducedMotionConfig } from './useReducedMotion';

// Mock window.matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('useReducedMotion', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with reduced motion false by default', () => {
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('should initialize with reduced motion true when media query matches', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });

  it('should call matchMedia with correct query', () => {
    renderHook(() => useReducedMotion());
    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)');
  });

  it('should call window.matchMedia', () => {
    renderHook(() => useReducedMotion());
    expect(window.matchMedia).toHaveBeenCalled();
  });
});

describe('useReducedMotionConfig', () => {
  beforeEach(() => {
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return normal transition config when reduced motion is false', () => {
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current).toEqual({
      duration: 0.2,
      ease: 'easeInOut'
    });
  });

  it('should return reduced motion config when reduced motion is true', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current).toEqual({
      duration: 0.01,
      ease: 'linear'
    });
  });

  it('should return config with duration property', () => {
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current).toHaveProperty('duration');
  });

  it('should return config with ease property', () => {
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current).toHaveProperty('ease');
  });

  it('should use easeInOut when reduced motion is false', () => {
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current.ease).toBe('easeInOut');
  });

  it('should use linear easing when reduced motion is true', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current.ease).toBe('linear');
  });

  it('should use 0.2s duration when reduced motion is false', () => {
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current.duration).toBe(0.2);
  });

  it('should use 0.01s duration when reduced motion is true', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useReducedMotionConfig());
    expect(result.current.duration).toBe(0.01);
  });
});
