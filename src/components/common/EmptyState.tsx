import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

interface EmptyStateProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  const { isDark } = useTheme();
  
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#737373' : '#A3A3A3';
  const iconColor = isDark ? '#525252' : '#D4D4D4';

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon size={64} color={iconColor} />
      </View>
      <Text variant="h3" style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      {description && (
        <Text variant="body" style={[styles.description, { color: mutedColor }]}>
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    minWidth: 160,
  },
});

export default EmptyState;
