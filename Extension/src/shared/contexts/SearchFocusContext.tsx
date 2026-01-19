import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SearchFocusContextType {
  registerFocusFunction: (focusFn: () => void) => void;
  unregisterFocusFunction: () => void;
  focusSearch: () => void;
}

const SearchFocusContext = createContext<SearchFocusContextType | undefined>(undefined);

export const SearchFocusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const focusFunctions = useState<(() => void)[]>([])[0];
  const [focusFunctionsList, setFocusFunctionsList] = useState<(() => void)[]>([]);

  const registerFocusFunction = useCallback((focusFn: () => void) => {
    setFocusFunctionsList(prev => [...prev, focusFn]);
  }, []);

  const unregisterFocusFunction = useCallback(() => {
    setFocusFunctionsList(prev => prev.slice(0, -1));
  }, []);

  const focusSearch = useCallback(() => {
    // Call the most recently registered focus function (topmost SearchBar)
    if (focusFunctionsList.length > 0) {
      focusFunctionsList[focusFunctionsList.length - 1]();
    }
  }, [focusFunctionsList]);

  return (
    <SearchFocusContext.Provider value={{ registerFocusFunction, unregisterFocusFunction, focusSearch }}>
      {children}
    </SearchFocusContext.Provider>
  );
};

export const useSearchFocus = () => {
  const context = useContext(SearchFocusContext);
  if (!context) {
    throw new Error('useSearchFocus must be used within SearchFocusProvider');
  }
  return context;
};
