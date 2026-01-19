import { useEffect, useRef, RefObject } from 'react';

interface UseSearchKeyboardOptions {
  onEscape?: () => void;
}

/**
 * Hook to manage keyboard shortcuts for search functionality.
 * Handles Cmd+K / Ctrl+K to focus search input and Escape to blur.
 */
export function useSearchKeyboard<T extends HTMLElement = HTMLInputElement>(
  options?: UseSearchKeyboardOptions
): RefObject<T> {
  const inputRef = useRef<T>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K (Mac) or Ctrl+K (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      // Escape key
      else if (e.key === 'Escape') {
        if (document.activeElement === inputRef.current) {
          e.preventDefault();
          inputRef.current?.blur();
          options?.onEscape?.();
        }
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [options]);

  return inputRef;
}
