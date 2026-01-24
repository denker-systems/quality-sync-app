import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Menu } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useMenu } from '@/contexts/MenuContext';

export function MenuButton() {
  const { isDark } = useTheme();
  const menuContext = useMenu();
  
  // Don't render if menu context is not available
  if (!menuContext) {
    return null;
  }
  
  const bgColor = isDark ? '#1A1A1A' : '#F5F5F5';
  const iconColor = isDark ? '#FAFAFA' : '#171717';

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={menuContext.openMenu}
      activeOpacity={0.7}
    >
      <Menu size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuButton;
