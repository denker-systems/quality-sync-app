import React, { memo, useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Check, Lock, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type OnboardingNodeStatus = 'completed' | 'active' | 'locked' | 'upcoming';

interface OnboardingPathNodeProps {
  status: OnboardingNodeStatus;
  accentColor: string;
  image?: ImageSourcePropType;
}

export const OnboardingPathNode = memo(function OnboardingPathNode({
  status,
  accentColor,
  image,
}: OnboardingPathNodeProps) {
  const { isDark } = useTheme();

  const nodeStyle = useMemo(() => {
    const isCompleted = status === 'completed';
    const isActive = status === 'active';
    const backgroundColor = isCompleted || isActive ? accentColor : isDark ? '#2A2A2A' : '#E5E5E5';
    const borderColor = isActive ? accentColor : isDark ? '#3A3A3A' : '#E5E5E5';

    return { backgroundColor, borderColor };
  }, [status, accentColor, isDark]);

  const isActive = status === 'active';
  const isCompleted = status === 'completed';
  return (
    <MotiView
      style={[styles.node, nodeStyle]}
      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={
        isActive
          ? { type: 'timing', duration: 2000, loop: true }
          : { type: 'timing', duration: 200 }
      }
    >
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : isCompleted ? (
        <Check size={18} color={isDark ? '#0F0F0F' : '#FFFFFF'} />
      ) : status === 'locked' ? (
        <Lock size={16} color={isDark ? '#A3A3A3' : '#737373'} />
      ) : (
        <Star size={16} color={isDark ? '#0F0F0F' : '#FFFFFF'} />
      )}
    </MotiView>
  );
});

const styles = StyleSheet.create({
  node: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 120,
    height: 120,
  },
});

export default OnboardingPathNode;
