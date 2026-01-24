import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/contexts/ThemeContext';

interface OnboardingSpeechBubbleProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function OnboardingSpeechBubble({
  title,
  description,
  actionLabel = 'Öppna',
  onAction,
  style,
}: OnboardingSpeechBubbleProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#A3A3A3' : '#737373';
  const bubbleBg = isDark ? '#1A1A1A' : '#FFFFFF';

  return (
    <MotiView
      style={[styles.container, { backgroundColor: bubbleBg }, style]}
      from={{ opacity: 0, scale: 0.98, translateY: 8 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 220 }}
    >
      <Text variant="body-lg" style={[styles.title, { color: textColor }]}>
        {title}
      </Text>
      {description ? (
        <Text variant="body-sm" style={[styles.description, { color: mutedColor }]}>
          {description}
        </Text>
      ) : null}
      {onAction ? (
        <View style={styles.actionRow}>
          <Button variant="outline" onPress={onAction}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
      <View style={[styles.tail, { backgroundColor: bubbleBg }]} />
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 14,
    position: 'relative',
  },
  title: {
    fontWeight: '600',
  },
  description: {
    marginTop: 4,
  },
  actionRow: {
    marginTop: 10,
    alignItems: 'flex-start',
  },
  tail: {
    position: 'absolute',
    width: 12,
    height: 12,
    bottom: -6,
    left: 18,
    transform: [{ rotate: '45deg' }],
    borderRadius: 2,
  },
});

export default OnboardingSpeechBubble;
