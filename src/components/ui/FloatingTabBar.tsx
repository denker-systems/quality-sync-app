import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Home, User, Calendar, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface TabItem {
  key: string;
  icon: React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;
  labelKey: string;
}

const tabs: TabItem[] = [
  { key: 'home', icon: Home, labelKey: 'nav.home' },
  { key: 'profile', icon: User, labelKey: 'nav.profile' },
  { key: 'schedule', icon: Calendar, labelKey: 'nav.schedule' },
  { key: 'settings', icon: Settings, labelKey: 'nav.settings' },
];

interface FloatingTabBarProps {
  activeTab: string;
  onTabPress: (key: string) => void;
}

export function FloatingTabBar({ activeTab, onTabPress }: FloatingTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const handlePress = (key: string) => {
    onTabPress(key);
  };

  return (
    <View 
      style={[
        styles.container, 
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}
    >
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          
          return (
            <Pressable
              key={tab.key}
              onPress={() => handlePress(tab.key)}
              style={({ pressed }) => [
                styles.tabButton,
                isActive && (isDark ? styles.activeButtonDark : styles.activeButtonLight),
                !isActive && (isDark ? styles.inactiveButtonDark : styles.inactiveButtonLight),
                pressed && styles.pressed,
                isActive && styles.activeScale,
              ]}
            >
              <Icon 
                size={28} 
                color={isActive 
                  ? (isDark ? '#0F0F0F' : '#FFFFFF')
                  : (isDark ? '#A3A3A3' : '#737373')
                } 
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  tabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  overlapping: {
    marginLeft: -12,
  },
  activeButtonLight: {
    backgroundColor: '#1A1A1A',
  },
  activeButtonDark: {
    backgroundColor: '#FAFAFA',
  },
  inactiveButtonLight: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  inactiveButtonDark: {
    backgroundColor: '#2A2A2A',
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },
  activeScale: {
    transform: [{ scale: 1.05 }],
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});

export default FloatingTabBar;
