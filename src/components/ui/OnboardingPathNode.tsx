import React, { memo, useMemo } from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { MotiView } from 'moti';
import { Check, Lock, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export type OnboardingNodeStatus = 'completed' | 'active' | 'locked' | 'upcoming';

interface OnboardingPathNodeProps {
  status: OnboardingNodeStatus;
  accentColor: string;
  image?: ImageSourcePropType;
}

const getStepImage = (stepType: string): ImageSourcePropType | undefined => {
  switch (stepType) {
    case 'welcome':
      return require('../../../../assets/images/onboarding.png');
    case 'personal_info':
      return require('../../../../assets/images/profile.png');
    case 'contract_signing':
    case 'handbook':
      return require('../../../../assets/images/contract.png');
    case 'emergency_contact':
    case 'bank_details':
      return require('../../../../assets/images/schedule.png');
    default:
      return undefined;
  }
};

export const OnboardingPathNode = function OnboardingPathNode({ status, accentColor, image }: OnboardingPathNodeProps) {
  const { isDark } = useTheme();
  
  const nodeStyle = useMemo(() => {
    const isCompleted = status === 'completed';
    const isActive = status === 'active';
    const isLocked = status === 'locked';
    
    const backgroundColor = isCompleted || isActive ? accentColor : (isDark ? '#2A2A2A' : '#E5E5E5');
    const borderColor = isActive ? accentColor : (isDark ? '#3A3A3A' : '#E5E5E5');
    
    return { backgroundColor, borderColor };
  }, [status, accentColor, isDark]);

  const isActive = status === 'active';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  
  return (
    <MotiView
      style={[styles.node, nodeStyle]}
      animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
      transition={isActive ? { type: 'timing', duration: 2000, loop: true } : { type: 'timing', duration: 200 }}
    >
      {image ? (
        <Image 
          source={image} 
          style={styles.image} 
          resizeMode="contain" 
        />
      ) : isCompleted ? (
        <Check size={18} color={isDark ? '#0F0F0F' : '#FFFFFF'} />
      ) : isLocked ? (
        <Lock size={16} color={isDark ? '#A3A3A3' : '#737373'} />
      ) : (
        <Star size={16} color={isDark ? '#0F0F0F' : '#FFFFFF'} />
      )}
    </MotiView>
  );
}

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
