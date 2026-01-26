import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// Storage key
const THEME_STORAGE_KEY = 'quality-sync-theme';

// Theme context interface
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoading: boolean;
  isDark: boolean;
}

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
}) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Get system theme preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  }, [systemColorScheme]);

  // Resolve theme (convert 'system' to actual theme)
  const resolveTheme = useCallback(
    (themeValue: Theme): ResolvedTheme => {
      if (themeValue === 'system') {
        return getSystemTheme();
      }
      return themeValue;
    },
    [getSystemTheme],
  );

  // Calculate resolved theme
  const resolvedTheme = resolveTheme(theme);
  const isDark = resolvedTheme === 'dark';

  // Set theme function
  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      console.log('🎨 THEME: Setting theme to:', newTheme);
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('❌ THEME: Error saving theme:', error);
    }
  }, []);

  // Toggle between light and dark (skip system)
  const toggleTheme = useCallback(() => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    console.log('🎨 THEME: Toggling from', resolvedTheme, 'to', newTheme);
    setTheme(newTheme);
  }, [resolvedTheme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        console.log('🎨 THEME: Loaded saved theme:', savedTheme);

        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('❌ THEME: Error loading theme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme !== 'system') return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('🎨 THEME: System theme changed to:', colorScheme);
      // Force re-render by updating state
      setThemeState('system');
    });

    return () => subscription.remove();
  }, [theme]);

  // Context value
  const contextValue: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isLoading,
    isDark,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Helper hook for theme-aware components
export const useThemeAware = () => {
  const { resolvedTheme, isDark } = useTheme();
  return {
    isDark,
    isLight: !isDark,
    resolvedTheme,
  };
};
