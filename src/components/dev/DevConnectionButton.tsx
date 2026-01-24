/**
 * DevConnectionButton - Floating debug button overlay
 * Shows everywhere in the app during development
 */

import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Wifi } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface DevConnectionButtonProps {
  onPress: () => void;
}

export function DevConnectionButton({ onPress }: DevConnectionButtonProps) {
  const { isDark } = useTheme();

  const bgColor = isDark ? '#3B82F6' : '#2563EB';
  const iconColor = '#FFFFFF';

  // Only show in development
  if (__DEV__ === false) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Wifi size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100, // Längre ner på skärmen
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 9999,
  },
});
