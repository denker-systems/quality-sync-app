import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { useTheme } from '@/contexts/ThemeContext';

interface MenuHeaderProps {
  title: string;
  onLogout?: () => void;
  logoutText: string;
}

export function MenuHeader({ title, onLogout, logoutText }: MenuHeaderProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const borderColor = isDark ? '#2A2A2A' : '#E5E5E5';

  return (
    <View style={[styles.header, { borderBottomColor: borderColor }]}>
      <Text variant="h2" style={{ color: textColor, flex: 1 }}>
        {title}
      </Text>
      <Pressable 
        style={styles.logoutButton}
        onPress={onLogout}
      >
        <Text style={styles.logoutText}>{logoutText}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 15,
  },
});
