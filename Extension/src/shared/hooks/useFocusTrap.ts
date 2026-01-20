import { useEffect, RefObject } from 'react';

/**
 * Trap focus within a container element (for modals, dropdowns, etc.)
 * Ensures Tab key cycles through focusable elements within the container
 */
export const useFocusTrap = (isEnabled: boolean, containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isEnabled || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements within the container
    const getFocusableElements = (): HTMLElement[] => {
      const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ');

      return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
    };

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If Shift + Tab on first element, move to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      // If Tab on last element, move to first
      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
        return;
      }
    };

    // Focus first element when trap is enabled
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Find the first element that doesn't have [data-no-initial-focus]
      const firstFocusable = focusableElements.find(
        el => !el.hasAttribute('data-no-initial-focus')
      ) || focusableElements[0];
      firstFocusable.focus();
    }

    container.addEventListener('keydown', handleTabKey);

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [isEnabled, containerRef]);
};
