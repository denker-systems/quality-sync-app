import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outline';
  children: React.ReactNode;
}

export function Card({ variant = 'default', children, style, ...props }: CardProps) {
  const { isDark } = useTheme();

  const getVariantStyle = () => {
    const bgColor = isDark ? '#1A1A1A' : '#FFFFFF';
    const borderColor = isDark ? '#2E2E2E' : '#E5E5E5';

    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: bgColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: isDark ? '#3D3D3D' : '#E5E5E5',
        };
      default:
        return {
          backgroundColor: bgColor,
          borderWidth: 1,
          borderColor: borderColor,
        };
    }
  };

  return (
    <View style={[styles.base, getVariantStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

interface CardHeaderProps extends ViewProps {
  children: React.ReactNode;
}

export function CardHeader({ children, style, ...props }: CardHeaderProps) {
  return (
    <View style={[styles.header, style]} {...props}>
      {children}
    </View>
  );
}

interface CardContentProps extends ViewProps {
  children: React.ReactNode;
}

export function CardContent({ children, style, ...props }: CardContentProps) {
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
}

interface CardFooterProps extends ViewProps {
  children: React.ReactNode;
}

export function CardFooter({ children, style, ...props }: CardFooterProps) {
  return (
    <View style={[styles.footer, style]} {...props}>
      {children}
    </View>
  );
}

export default Card;
