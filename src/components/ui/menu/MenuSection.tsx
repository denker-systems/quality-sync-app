import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../Text';
import { MenuItem } from './MenuItem';
import { useTheme } from '@/contexts/ThemeContext';

export interface MenuItemData {
  key: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
}

interface MenuSectionProps {
  title: string;
  items: MenuItemData[];
  onItemPress: (key: string) => void;
}

export function MenuSection({ title, items, onItemPress }: MenuSectionProps) {
  const { isDark } = useTheme();
  const sectionTitleColor = isDark ? '#525252' : '#737373';

  return (
    <View style={styles.section}>
      {title && (
        <Text variant="body-sm" style={[styles.sectionTitle, { color: sectionTitleColor }]}>
          {title}
        </Text>
      )}
      {items.map((item) => (
        <MenuItem
          key={item.key}
          icon={item.icon}
          title={item.title}
          subtitle={item.subtitle}
          onPress={() => onItemPress(item.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginTop: 24,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
