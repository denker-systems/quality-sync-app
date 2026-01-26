import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SurfaceProps extends ViewProps {
  elevation?: 0 | 1 | 2 | 3;
  children: React.ReactNode;
}

export function Surface({ elevation = 1, children, style, ...props }: SurfaceProps) {
  const { isDark } = useTheme();

  const backgroundColor = isDark ? '#1A1A1A' : '#FFFFFF';

  const shadowStyles = {
    0: {},
    1: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    2: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 4,
      elevation: 2,
    },
    3: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.5 : 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  };

  return (
    <View style={[styles.surface, { backgroundColor }, shadowStyles[elevation], style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    borderRadius: 8,
  },
});

export default Surface;
