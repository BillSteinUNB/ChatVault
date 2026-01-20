import { useEffect, useRef, useCallback } from 'react';

export type KeyboardHandler = (event: KeyboardEvent) => void;
export type KeyMap = Record<string, KeyboardHandler>;

/**
 * Hook for managing keyboard navigation within components
 * Supports arrow keys, Escape, Enter, and Space
 */
export const useKeyboardNavigation = (
  keyMap: KeyMap,
  isEnabled: boolean = true,
  elementRef?: React.RefObject<HTMLElement>
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isEnabled) return;

    const handler = keyMap[event.key];
    if (handler) {
      // Check if the event target is within the scoped element (if provided)
      if (elementRef && elementRef.current) {
        if (!elementRef.current.contains(event.target as Node)) {
          return;
        }
      }

      event.preventDefault();
      handler(event);
    }
  }, [keyMap, isEnabled, elementRef]);

  useEffect(() => {
    const targetElement = elementRef?.current || document;
    targetElement.addEventListener('keydown', handleKeyDown);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, elementRef]);
};

/**
 * Hook for managing arrow key navigation in lists/menus
 */
export const useArrowKeyNavigation = (
  itemCount: number,
  selectedIndex: number,
  onSelectIndex: (index: number) => void,
  isEnabled: boolean = true,
  elementRef?: React.RefObject<HTMLElement>
) => {
  useKeyboardNavigation(
    {
      ArrowDown: () => {
        const nextIndex = (selectedIndex + 1) % itemCount;
        onSelectIndex(nextIndex);
      },
      ArrowUp: () => {
        const prevIndex = (selectedIndex - 1 + itemCount) % itemCount;
        onSelectIndex(prevIndex);
      },
      Home: () => {
        onSelectIndex(0);
      },
      End: () => {
        onSelectIndex(itemCount - 1);
      },
    },
    isEnabled,
    elementRef
  );

  return { selectedIndex };
};

/**
 * Hook for managing Escape key to close overlays
 */
export const useEscapeKey = (
  callback: () => void,
  isEnabled: boolean = true,
  elementRef?: React.RefObject<HTMLElement>
) => {
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      // Check if the event target is within the scoped element (if provided)
      if (elementRef && elementRef.current) {
        if (!elementRef.current.contains(event.target as Node)) {
          return;
        }
      }
      callback();
    }
  }, [callback, elementRef]);

  useEffect(() => {
    if (!isEnabled) return;

    const targetElement = elementRef?.current || document;
    targetElement.addEventListener('keydown', handleEscape);

    return () => {
      targetElement.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape, isEnabled, elementRef]);
};
