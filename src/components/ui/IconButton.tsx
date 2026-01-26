import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type IconButtonVariant = 'default' | 'primary' | 'ghost' | 'outline';
type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends PressableProps {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
}

const sizeMap: Record<IconButtonSize, number> = {
  sm: 36,
  md: 44,
  lg: 56,
};

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  disabled = false,
  style,
  ...props
}: IconButtonProps) {
  const { isDark } = useTheme();
  const dimension = sizeMap[size];

  const getBackgroundColor = () => {
    if (disabled) return isDark ? '#1A1A1A' : '#F5F5F5';

    switch (variant) {
      case 'primary':
        return isDark ? '#FAFAFA' : '#1A1A1A';
      case 'ghost':
        return 'transparent';
      case 'outline':
        return 'transparent';
      default:
        return isDark ? '#2A2A2A' : '#F5F5F5';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return isDark ? '#3D3D3D' : '#E5E5E5';
    }
    return 'transparent';
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed && !disabled ? 0.95 : 1 }],
        },
        style as any,
      ]}
      disabled={disabled}
      {...props}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
