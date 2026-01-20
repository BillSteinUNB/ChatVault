import { useRef, useEffect } from 'react';

/**
 * Remember which element had focus before opening an overlay
 * and return focus to it when the overlay closes
 */
export const useFocusReturn = (isOpen: boolean) => {
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element when overlay opens
      previousActiveElementRef.current = document.activeElement as HTMLElement;
    } else {
      // Return focus to the previously focused element when overlay closes
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
        previousActiveElementRef.current = null;
      }
    }
  }, [isOpen]);

  return previousActiveElementRef;
};
