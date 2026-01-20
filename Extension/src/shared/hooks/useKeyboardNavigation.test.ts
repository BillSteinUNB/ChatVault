import { renderHook, act } from '@testing-library/react';
import { useFocusTrap } from './useFocusTrap';
import { useEscapeKey } from './useKeyboardNavigation';
import { useFocusReturn } from './useFocusReturn';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('useFocusTrap', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should focus the first focusable element when enabled', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    container.appendChild(button1);
    container.appendChild(button2);

    const ref = { current: container };

    renderHook(() => useFocusTrap(true, ref));

    expect(document.activeElement).toBe(button1);
  });

  it('should skip elements with data-no-initial-focus attribute', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    button1.setAttribute('data-no-initial-focus', 'true');
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    container.appendChild(button1);
    container.appendChild(button2);

    const ref = { current: container };

    renderHook(() => useFocusTrap(true, ref));

    expect(document.activeElement).toBe(button2);
  });

  it('should trap Tab key within container', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    container.appendChild(button1);
    container.appendChild(button2);

    const ref = { current: container };

    renderHook(() => useFocusTrap(true, ref));

    // Focus first button
    button1.focus();
    expect(document.activeElement).toBe(button1);

    // Press Tab to move to second button
    act(() => {
      const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      button1.dispatchEvent(tabEvent);
    });

    // Focus should still be within the container
    expect(container.contains(document.activeElement)).toBe(true);
  });

  it('should trap Shift+Tab within container', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    container.appendChild(button1);
    container.appendChild(button2);

    const ref = { current: container };

    renderHook(() => useFocusTrap(true, ref));

    // Focus second button
    button2.focus();
    expect(document.activeElement).toBe(button2);

    // Press Shift+Tab to move back to first button
    act(() => {
      const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
      button2.dispatchEvent(shiftTabEvent);
    });

    // Focus should still be within the container
    expect(container.contains(document.activeElement)).toBe(true);
  });

  it('should not trap when disabled', () => {
    const button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    const button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    const outsideButton = document.createElement('button');
    outsideButton.textContent = 'Outside';
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(outsideButton);

    const ref = { current: container };

    renderHook(() => useFocusTrap(false, ref));

    // Focus should not be trapped
    expect(document.activeElement).not.toBe(button1);
  });
});

describe('useFocusReturn', () => {
  it('should return focus to previously focused element when closed', () => {
    const button = document.createElement('button');
    button.textContent = 'Trigger';
    document.body.appendChild(button);

    button.focus();
    expect(document.activeElement).toBe(button);

    const { rerender } = renderHook(({ isOpen }) => useFocusReturn(isOpen), {
      initialProps: { isOpen: false }
    });

    // Open overlay - focus should move
    rerender({ isOpen: true });

    // Close overlay - focus should return
    rerender({ isOpen: false });

    expect(document.activeElement).toBe(button);

    document.body.removeChild(button);
  });

  it('should not return focus if element is no longer in DOM', () => {
    const button = document.createElement('button');
    button.textContent = 'Trigger';
    document.body.appendChild(button);

    button.focus();
    expect(document.activeElement).toBe(button);

    const { rerender } = renderHook(({ isOpen }) => useFocusReturn(isOpen), {
      initialProps: { isOpen: false }
    });

    // Open overlay
    rerender({ isOpen: true });

    // Remove button from DOM
    document.body.removeChild(button);

    // Close overlay - should not error
    rerender({ isOpen: false });

    // Should not throw error, just no focus return
    expect(document.activeElement).toBe(document.body);
  });
});

describe('useEscapeKey', () => {
  it('should call callback when Escape is pressed', () => {
    const callback = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderHook(() => useEscapeKey(callback, true));

    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
  });

  it('should not call callback when other keys are pressed', () => {
    const callback = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderHook(() => useEscapeKey(callback, true));

    act(() => {
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(enterEvent);
    });

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('should not call callback when disabled', () => {
    const callback = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    renderHook(() => useEscapeKey(callback, false));

    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    });

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });

  it('should attach event listener to scoped element when provided', () => {
    const callback = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const ref = { current: container };

    renderHook(() => useEscapeKey(callback, true, ref));

    // Event on container should trigger callback
    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      container.dispatchEvent(escapeEvent);
    });

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(container);
  });

  it('should clean up event listener on unmount', () => {
    const callback = vi.fn();
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { unmount } = renderHook(() => useEscapeKey(callback, true));

    unmount();

    act(() => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
    });

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(container);
  });
});
