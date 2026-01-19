import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useStore } from '../lib/storage';
import { Settings } from '../types';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider - Provides theme context and manages dark/light mode
 * 
 * Features:
 * - Reads theme from settings
 * - Handles 'system' preference using matchMedia
 * - Applies theme class to document root
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const settings = useStore(state => state.settings);
  const updateSettings = useStore(state => state.updateSettings);
  
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() => {
    return getEffectiveTheme(settings.theme);
  });

  // Function to determine the effective theme based on settings and system preference
  function getEffectiveTheme(themeSetting: 'light' | 'dark' | 'system'): 'light' | 'dark' {
    if (themeSetting === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeSetting;
  }

  // Listen for system theme changes if using system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.theme === 'system') {
        setEffectiveTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [settings.theme]);

  // Update effective theme when settings change
  useEffect(() => {
    setEffectiveTheme(getEffectiveTheme(settings.theme));
  }, [settings.theme]);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [effectiveTheme]);

  // Set theme function
  const setTheme = (theme: 'light' | 'dark' | 'system') => {
    updateSettings({ theme });
  };

  return (
    <ThemeContext.Provider value={{ theme: effectiveTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * useTheme hook - Access theme context
 * 
 * @returns Theme context with current theme and setTheme function
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
