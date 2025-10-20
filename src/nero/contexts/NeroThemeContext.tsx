import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface NeroThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const NeroThemeContext = createContext<NeroThemeContextType | undefined>(undefined);

export const NeroThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('nero-theme') as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setThemeState(initialTheme);
      document.documentElement.classList.add(initialTheme);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('nero-theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: NeroThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
  };

  return (
    <NeroThemeContext.Provider value={value}>
      {children}
    </NeroThemeContext.Provider>
  );
};

export const useNeroTheme = (): NeroThemeContextType => {
  const context = useContext(NeroThemeContext);
  if (!context) {
    throw new Error('useNeroTheme must be used within NeroThemeProvider');
  }
  return context;
};

