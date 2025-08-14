import React, { createContext, useContext, ReactNode } from 'react';

export interface Theme {
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    borderColor: string;
    accentBlue: string;
    geminiGradient: string[];
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

const defaultTheme: Theme = {
  colors: {
    bgPrimary: '#131314',
    bgSecondary: '#1e1f20',
    bgTertiary: '#2a2b2c',
    textPrimary: '#e8eaed',
    textSecondary: '#9aa0a6',
    borderColor: '#3c4043',
    accentBlue: '#8ab4f8',
    geminiGradient: ['#4285f4', '#ea4335', '#fbbc04', '#34a853'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
};

const ThemeContext = createContext<Theme>(defaultTheme);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={defaultTheme}>
      {children}
    </ThemeContext.Provider>
  );
};
