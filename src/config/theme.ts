import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Brand colors - matching web app design system
// Primary is dark/light based on theme (like web app)
const brandColors = {
  // For light mode: dark primary, for dark mode: light primary
  primaryLight: '#171717', // Deep black for light mode
  primaryDark: '#fafafa', // Off-white for dark mode
  secondary: '#997328', // Gold accent
  secondaryLight: '#d4a636',
  secondaryDark: '#614a19',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6', // Keep blue for AI/info elements only
};

// Light theme - matching web app (dark primary on white)
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary: Deep black (like web app)
    primary: '#171717', // Deep black primary
    primaryContainer: '#f5f5f5',
    secondary: brandColors.secondary,
    secondaryContainer: '#fff8e1',
    tertiary: brandColors.secondaryDark,
    error: brandColors.error,
    errorContainer: '#fef2f2',
    // Pure whites matching web app
    background: '#ffffff', // Pure white
    surface: '#ffffff', // Pure white cards
    surfaceVariant: '#f5f5f5', // Light gray
    surfaceDisabled: '#fafafa',
    onPrimary: '#ffffff', // White text on black primary
    onPrimaryContainer: '#171717',
    onSecondary: '#ffffff',
    onSecondaryContainer: brandColors.secondaryDark,
    onSurface: '#171717', // Deep black text
    onSurfaceVariant: '#666666', // Muted text
    onSurfaceDisabled: '#a3a3a3',
    outline: '#e5e5e5', // Light border
    outlineVariant: '#f0f0f0',
    inverseSurface: '#171717',
    inverseOnSurface: '#fafafa',
    inversePrimary: '#fafafa',
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#fafafa',
      level3: '#f5f5f5',
      level4: '#f0f0f0',
      level5: '#e5e5e5',
    },
  },
  roundness: 8,
};

// Dark theme - matching web app exactly
// Web uses: --foreground: 0 0% 98% (#fafafa), --muted-foreground: 0 0% 65% (#a6a6a6)
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // Primary: Off-white (like web app dark mode)
    primary: '#fafafa', // hsl(0, 0%, 98%)
    primaryContainer: '#262626',
    secondary: brandColors.secondaryLight,
    secondaryContainer: '#3d2e14',
    tertiary: brandColors.secondaryLight,
    error: '#f87171',
    errorContainer: '#7f1d1d',
    // Pure grays matching web app
    background: '#0a0a0a', // hsl(0, 0%, 4%)
    surface: '#141414', // hsl(0, 0%, 8%)
    surfaceVariant: '#1f1f1f', // hsl(0, 0%, 12%)
    surfaceDisabled: '#141414',
    onPrimary: '#0a0a0a', // Dark text on light primary
    onPrimaryContainer: '#fafafa',
    onSecondary: '#0a0a0a',
    onSecondaryContainer: '#fff8e1',
    // TEXT COLORS - matching web app exactly
    onSurface: '#fafafa', // hsl(0, 0%, 98%) - main text
    onSurfaceVariant: '#a6a6a6', // hsl(0, 0%, 65%) - muted text
    onSurfaceDisabled: '#525252',
    outline: '#2e2e2e', // hsl(0, 0%, 18%)
    outlineVariant: '#1f1f1f',
    inverseSurface: '#fafafa',
    inverseOnSurface: '#141414',
    inversePrimary: '#171717',
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(0, 0, 0, 0.7)',
    elevation: {
      level0: 'transparent',
      level1: '#141414',
      level2: '#1a1a1a',
      level3: '#1f1f1f',
      level4: '#262626',
      level5: '#2e2e2e',
    },
  },
  roundness: 8,
};

// Default export (for backwards compatibility)
export const theme = lightTheme;

// Helper function to get theme by name
export const getTheme = (isDark: boolean) => (isDark ? darkTheme : lightTheme);
