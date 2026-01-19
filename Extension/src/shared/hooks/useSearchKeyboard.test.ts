import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSearchKeyboard } from './useSearchKeyboard';

describe('useSearchKeyboard', () => {
  let mockPreventDefault: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockPreventDefault = vi.fn();
    vi.clearAllMocks();
  });

  describe('Cmd+K / Ctrl+K keyboard shortcut', () => {
    it('focuses input when Cmd+K is pressed on Mac', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate Cmd+K keyboard event
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        ctrlKey: false,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });

    it('focuses input when Ctrl+K is pressed on Windows/Linux', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate Ctrl+K keyboard event
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: false,
        ctrlKey: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });

    it('focuses input when both Cmd and Ctrl are pressed with K', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate Cmd+Ctrl+K keyboard event
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        ctrlKey: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });

    it('does not focus when K is pressed without modifier keys', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate K without modifier keys
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: false,
        ctrlKey: false,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).not.toHaveBeenCalled();
      expect(mockInput.focus).not.toHaveBeenCalled();
    });

    it('handles lowercase "k"', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate Ctrl+k (lowercase)
      const event = new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: false,
        ctrlKey: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });

    it('handles uppercase "K"', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.focus = vi.fn();
      result.current.current = mockInput;

      // Simulate Ctrl+K (uppercase)
      const event = new KeyboardEvent('keydown', {
        key: 'K',
        metaKey: false,
        ctrlKey: true,
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.focus).toHaveBeenCalled();
    });
  });

  describe('Escape key to blur', () => {
    it('blurs input when Escape is pressed while input is focused', () => {
      const { result } = renderHook(() => useSearchKeyboard());
      const mockOnEscape = vi.fn();

      // Recreate hook with onEscape callback
      const { result: resultWithCallback } = renderHook(() =>
        useSearchKeyboard({ onEscape: mockOnEscape })
      );

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.blur = vi.fn();
      resultWithCallback.current.current = mockInput;

      // Mock document.activeElement to be the input
      const originalActiveElement = document.activeElement;
      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        writable: true,
      });

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.blur).toHaveBeenCalled();
      expect(mockOnEscape).toHaveBeenCalled();

      // Restore original active element
      Object.defineProperty(document, 'activeElement', {
        value: originalActiveElement,
        writable: true,
      });
    });

    it('does not blur when Escape is pressed while input is not focused', () => {
      const { result } = renderHook(() => useSearchKeyboard());
      const mockOnEscape = vi.fn();

      // Recreate hook with onEscape callback
      const { result: resultWithCallback } = renderHook(() =>
        useSearchKeyboard({ onEscape: mockOnEscape })
      );

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.blur = vi.fn();
      resultWithCallback.current.current = mockInput;

      // Mock document.activeElement to NOT be the input
      const otherElement = document.createElement('div');
      const originalActiveElement = document.activeElement;
      Object.defineProperty(document, 'activeElement', {
        value: otherElement,
        writable: true,
      });

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).not.toHaveBeenCalled();
      expect(mockInput.blur).not.toHaveBeenCalled();
      expect(mockOnEscape).not.toHaveBeenCalled();

      // Restore original active element
      Object.defineProperty(document, 'activeElement', {
        value: originalActiveElement,
        writable: true,
      });
    });

    it('calls onEscape callback when Escape is pressed', () => {
      const mockOnEscape = vi.fn();

      const { result } = renderHook(() =>
        useSearchKeyboard({ onEscape: mockOnEscape })
      );

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.blur = vi.fn();
      result.current.current = mockInput;

      // Mock document.activeElement to be the input
      const originalActiveElement = document.activeElement;
      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        writable: true,
      });

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockOnEscape).toHaveBeenCalledTimes(1);

      // Restore original active element
      Object.defineProperty(document, 'activeElement', {
        value: originalActiveElement,
        writable: true,
      });
    });

    it('handles ESC key (alternative Escape code)', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      // Create a mock input element
      const mockInput = document.createElement('input');
      mockInput.blur = vi.fn();
      result.current.current = mockInput;

      // Mock document.activeElement to be the input
      const originalActiveElement = document.activeElement;
      Object.defineProperty(document, 'activeElement', {
        value: mockInput,
        writable: true,
      });

      // Simulate Escape key
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
      });
      Object.defineProperty(event, 'preventDefault', { value: mockPreventDefault });

      act(() => {
        document.dispatchEvent(event);
      });

      expect(mockPreventDefault).toHaveBeenCalled();
      expect(mockInput.blur).toHaveBeenCalled();

      // Restore original active element
      Object.defineProperty(document, 'activeElement', {
        value: originalActiveElement,
        writable: true,
      });
    });
  });

  describe('Ref management', () => {
    it('returns a ref object', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      expect(result.current).toHaveProperty('current');
      expect(result.current.current).toBeNull();
    });

    it('allows the ref to be attached to an element', () => {
      const { result } = renderHook(() => useSearchKeyboard());

      const mockInput = document.createElement('input');
      result.current.current = mockInput;

      expect(result.current.current).toBe(mockInput);
    });
  });

  describe('Event listener cleanup', () => {
    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useSearchKeyboard());

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      removeEventListenerSpy.mockRestore();
    });

    it('adds event listener on mount', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener');

      renderHook(() => useSearchKeyboard());

      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );

      addEventListenerSpy.mockRestore();
    });
  });
});
