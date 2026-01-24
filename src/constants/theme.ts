/**
 * Centralized Theme Configuration
 * 
 * Single source of truth for all colors, spacing, and design tokens
 * Used throughout the app for consistent theming
 */

export const COLORS = {
  // Brand colors
  accent: {
    light: '#489A45',
    dark: '#6BBD68',
  },
  
  // Text colors
  text: {
    primary: {
      light: '#171717',
      dark: '#FAFAFA',
    },
    muted: {
      light: '#737373',
      dark: '#A3A3A3',
    },
    heading: {
      light: '#0F0F0F',
      dark: '#FFFFFF',
    },
  },
  
  // Background colors
  background: {
    primary: {
      light: '#FFFFFF',
      dark: '#0F0F0F',
    },
    secondary: {
      light: '#F5F5F5',
      dark: '#1A1A1A',
    },
    tertiary: {
      light: '#E5E5E5',
      dark: '#2A2A2A',
    },
  },
  
  // Border colors
  border: {
    light: '#E5E5E5',
    dark: '#2E2E2E',
  },
  
  // Input colors
  input: {
    background: {
      light: '#FFFFFF',
      dark: '#1A1A1A',
    },
    border: {
      light: '#E5E5E5',
      dark: '#333333',
    },
  },
  
  // Status colors
  success: {
    light: '#10b981',
    dark: '#10b981',
  },
  error: {
    light: '#ef4444',
    dark: '#ef4444',
  },
  warning: {
    light: '#f59e0b',
    dark: '#f59e0b',
  },
  info: {
    light: '#3b82f6',
    dark: '#3b82f6',
  },
  
  // Gamification colors
  streak: '#EF4444',
  trophy: '#F59E0B',
  xp: '#F59E0B',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
} as const;

/**
 * Get theme colors based on dark mode
 */
export const getThemeColors = (isDark: boolean) => ({
  accent: isDark ? COLORS.accent.dark : COLORS.accent.light,
  textPrimary: isDark ? COLORS.text.primary.dark : COLORS.text.primary.light,
  textMuted: isDark ? COLORS.text.muted.dark : COLORS.text.muted.light,
  textHeading: isDark ? COLORS.text.heading.dark : COLORS.text.heading.light,
  bgPrimary: isDark ? COLORS.background.primary.dark : COLORS.background.primary.light,
  bgSecondary: isDark ? COLORS.background.secondary.dark : COLORS.background.secondary.light,
  bgTertiary: isDark ? COLORS.background.tertiary.dark : COLORS.background.tertiary.light,
  border: isDark ? COLORS.border.dark : COLORS.border.light,
  inputBg: isDark ? COLORS.input.background.dark : COLORS.input.background.light,
  inputBorder: isDark ? COLORS.input.border.dark : COLORS.input.border.light,
  success: COLORS.success.light,
  error: COLORS.error.light,
  warning: COLORS.warning.light,
  info: COLORS.info.light,
  streak: COLORS.streak,
  trophy: COLORS.trophy,
  xp: COLORS.xp,
});
