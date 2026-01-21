import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0056b3',
    secondary: '#997328',
    tertiary: '#614a19',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f8f9fa',
    surfaceVariant: '#e9ecef',
    onSurface: '#1f1f1f',
    onSurfaceVariant: '#6c757d',
  },
  roundness: 8,
};
