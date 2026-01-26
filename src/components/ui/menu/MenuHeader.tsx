import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { Text } from '../Text';
import { useTheme } from '@/contexts/ThemeContext';

interface MenuHeaderProps {
  title: string;
  onClose?: () => void;
}

export function MenuHeader({ title, onClose }: MenuHeaderProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';

  return (
    <View style={[styles.header, { backgroundColor: isDark ? '#0F0F0F' : '#FFFFFF' }]}>
      {/* Left - Placeholder */}
      <View style={styles.leftSection}>
        <View style={styles.placeholder} />
      </View>

      {/* Center - Title */}
      <View style={styles.centerSection}>
        <Text variant="h3" style={[styles.title, { color: textColor }]}>
          {title}
        </Text>
      </View>

      {/* Right - Menu icon */}
      <View style={styles.rightSection}>
        <Pressable style={styles.menuButton} onPress={onClose}>
          <X size={20} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  leftSection: {
    width: 48,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    width: 48,
    alignItems: 'flex-end',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 40,
    height: 40,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
