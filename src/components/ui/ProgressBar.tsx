import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, height = 8, style }: ProgressBarProps) {
  const { isDark } = useTheme();
  
  const trackColor = isDark ? '#333333' : '#E5E5E5';
  const fillColor = isDark ? '#6BBD68' : '#489A45';
  
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={[styles.track, { backgroundColor: trackColor, height }, style]}>
      <View 
        style={[
          styles.fill, 
          { 
            backgroundColor: fillColor, 
            width: `${clampedProgress * 100}%` 
          }
        ]} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

export default ProgressBar;
