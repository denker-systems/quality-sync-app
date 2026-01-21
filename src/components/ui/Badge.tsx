import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'online' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  showDot?: boolean;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot?: string }> = {
  default: {
    bg: '#F5F5F5',
    text: '#525252',
  },
  success: {
    bg: '#D1FAE5',
    text: '#059669',
  },
  warning: {
    bg: '#FEF3C7',
    text: '#D97706',
  },
  error: {
    bg: '#FEE2E2',
    text: '#DC2626',
  },
  info: {
    bg: '#DBEAFE',
    text: '#2563EB',
  },
  online: {
    bg: '#E8F5E9',
    text: '#2E7D32',
    dot: '#22C55E',
  },
  primary: {
    bg: '#D4E8D1',
    text: '#489A45',
  },
};

export function Badge({ children, variant = 'default', showDot = false }: BadgeProps) {
  const style = variantStyles[variant];
  const hasDot = showDot || variant === 'online';

  return (
    <View style={[styles.container, { backgroundColor: style.bg }]}>
      {hasDot && (
        <View style={[styles.dot, { backgroundColor: style.dot || style.text }]} />
      )}
      {typeof children === 'string' ? (
        <Text variant="tiny" style={[styles.text, { color: style.text }]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontWeight: '500',
  },
});

export default Badge;
