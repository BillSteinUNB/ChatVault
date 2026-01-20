import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Returns true if the user has prefers-reduced-motion set to reduce
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check initial preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes in preference
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};

/**
 * Default transition config that respects reduced motion preference
 * Use this in Framer Motion animations:
 * transition={useReducedMotionConfig()}
 */
export const useReducedMotionConfig = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    duration: prefersReducedMotion ? 0.01 : 0.2,
    ease: prefersReducedMotion ? 'linear' : 'easeInOut'
  } as const;
};
