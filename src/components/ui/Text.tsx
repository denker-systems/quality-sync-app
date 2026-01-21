import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type TextVariant = 
  | 'display' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'body-lg' 
  | 'body' 
  | 'body-sm' 
  | 'caption' 
  | 'tiny';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  muted?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<TextVariant, TextStyle> = {
  display: { fontSize: 34, fontWeight: '600', letterSpacing: -0.5 },
  h1: { fontSize: 28, fontWeight: '600' },
  h2: { fontSize: 22, fontWeight: '600' },
  h3: { fontSize: 18, fontWeight: '500' },
  h4: { fontSize: 16, fontWeight: '500' },
  'body-lg': { fontSize: 17 },
  body: { fontSize: 15 },
  'body-sm': { fontSize: 13 },
  caption: { fontSize: 12 },
  tiny: { fontSize: 10, fontWeight: '500' },
};

export function Text({ 
  variant = 'body', 
  muted = false, 
  children, 
  style,
  ...props 
}: TextProps) {
  const { isDark } = useTheme();
  
  const textColor = muted 
    ? (isDark ? '#A3A3A3' : '#737373')
    : (isDark ? '#FAFAFA' : '#171717');

  return (
    <RNText 
      style={[variantStyles[variant], { color: textColor }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
}

export default Text;
