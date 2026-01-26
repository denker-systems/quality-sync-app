import React from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { Text } from './Text';
import { useTheme } from '@/contexts/ThemeContext';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  source?: ImageSourcePropType | string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
  '2xl': 120,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 40,
};

function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function Avatar({ source, name, size = 'md' }: AvatarProps) {
  const { isDark } = useTheme();
  const dimension = sizeMap[size];
  const fontSize = fontSizeMap[size];

  const backgroundColor = isDark ? '#2A2A2A' : '#E5EAE5';
  const textColor = isDark ? '#A8D5A2' : '#489A45';
  const borderColor = isDark ? '#3D3D3D' : '#FFFFFF';

  const containerStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    backgroundColor,
    borderWidth: size === 'lg' || size === 'xl' || size === '2xl' ? 3 : 2,
    borderColor,
  };

  if (source) {
    const imageSource = typeof source === 'string' ? { uri: source } : source;
    return <Image source={imageSource} style={[styles.image, containerStyle]} />;
  }

  const initials = name ? getInitials(name) : '?';

  return (
    <View style={[styles.fallback, containerStyle]}>
      <Text style={[styles.initials, { fontSize, color: textColor }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '600',
  },
});

export default Avatar;
