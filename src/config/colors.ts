// ZocDog-inspired color palette for Quality Sync App

export const colors = {
  // Primary (Mint Green - ZocDog)
  primary: {
    50: '#EDF5EC',
    100: '#D4E8D1',
    200: '#C5E1A5',
    300: '#A8D5A2',
    400: '#8BC985',
    500: '#6BBD68',
    600: '#5AAD57',
    700: '#489A45',
    800: '#367833',
    900: '#245622',
    DEFAULT: '#6BBD68',
  },

  // Accent (Purple)
  accent: {
    100: '#F3E8F7',
    200: '#E8D8F0',
    500: '#9C7BAE',
  },

  // Secondary (Gold)
  secondary: {
    300: '#F6D365',
    500: '#D4A636',
    700: '#997328',
    DEFAULT: '#D4A636',
  },

  // Semantic colors
  success: {
    DEFAULT: '#10B981',
    light: '#D1FAE5',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
  },
  error: {
    DEFAULT: '#EF4444',
    light: '#FEE2E2',
  },
  info: {
    DEFAULT: '#3B82F6',
    light: '#DBEAFE',
  },

  // Light mode
  light: {
    background: {
      0: '#FFFFFF',
      50: '#F5F7F5',
      100: '#EEF2EE',
      200: '#E5EAE5',
    },
    foreground: '#171717',
    muted: '#737373',
    mutedForeground: '#525252',
    border: '#E5E5E5',
  },

  // Dark mode
  dark: {
    background: {
      0: '#0F0F0F',
      50: '#1A1A1A',
      100: '#242424',
      200: '#2E2E2E',
    },
    foreground: '#FAFAFA',
    muted: '#737373',
    mutedForeground: '#A3A3A3',
    border: '#3D3D3D',
  },

  // CTA colors (ZocDog uses black buttons)
  cta: {
    light: {
      primary: '#1A1A1A',
      primaryText: '#FFFFFF',
    },
    dark: {
      primary: '#FAFAFA',
      primaryText: '#0F0F0F',
    },
  },
} as const;

export type Colors = typeof colors;
