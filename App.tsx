import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { MFAGate } from './src/features/mfa';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import { lightTheme, darkTheme } from './src/config/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Inner app component that uses theme context
const ThemedApp = () => {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <MFAGate>
        <AppNavigator />
      </MFAGate>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system">
          <ThemedApp />
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
