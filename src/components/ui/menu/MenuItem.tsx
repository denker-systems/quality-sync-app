import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from '../Text';
import { useTheme } from '@/contexts/ThemeContext';

const ICON_SIZE = 44;

interface MenuItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export function MenuItem({ icon: Icon, title, subtitle, onPress }: MenuItemProps) {
  const { isDark } = useTheme();
  const textColor = isDark ? '#FAFAFA' : '#171717';
  const mutedColor = isDark ? '#737373' : '#737373';
  const iconBgColor = isDark ? 'rgba(107,189,104,0.15)' : '#EDF5EC';
  const iconColor = isDark ? '#A8D5A2' : '#489A45';

  return (
    <Pressable
      style={({ pressed }) => [
        pressed && { backgroundColor: isDark ? '#1A1A1A' : '#F5F5F5' },
      ]}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={[styles.icon, { backgroundColor: iconBgColor }]}>
          <Icon size={20} color={iconColor} />
        </View>
        
        <View style={styles.textArea}>
          <Text 
            variant="body-lg"
            style={{ color: textColor }}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text 
              variant="body-sm"
              style={{ color: mutedColor, marginTop: 2 }}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
        </View>
        
        <ChevronRight size={20} color={mutedColor} style={styles.chevron} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    minHeight: 64,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  textArea: {
    flex: 1,
    justifyContent: 'center',
  },
  chevron: {
    flexShrink: 0,
    marginLeft: 8,
  },
});
