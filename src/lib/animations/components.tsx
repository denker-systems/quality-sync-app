/**
 * Optimized Animation Components
 *
 * Pre-built animated components with best practices baked in
 * All components use memoization and worklets for maximum FPS
 */

import React, { memo } from 'react';
import { MotiView } from 'moti';
import type { StyleProp, ViewStyle } from 'react-native';
import { SPRING_CONFIGS, ENTRANCE_PRESETS } from './configs';

interface AnimatedEntranceProps {
  preset?: keyof typeof ENTRANCE_PRESETS;
  delay?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Optimized entrance animation component
 * Memoized to prevent unnecessary re-renders
 */
export const AnimatedEntrance = memo(function AnimatedEntrance({
  preset = 'fadeInUp',
  delay = 0,
  children,
  style,
}: AnimatedEntranceProps) {
  const animation = ENTRANCE_PRESETS[preset];

  return (
    <MotiView
      from={animation.from}
      animate={animation.animate}
      transition={{ ...SPRING_CONFIGS.bouncy, delay }}
      style={style}
    >
      {children}
    </MotiView>
  );
});

interface AnimatedListItemProps {
  index: number;
  staggerDelay?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Optimized list item with staggered entrance
 * Perfect for FlatList or ScrollView items
 */
export const AnimatedListItem = memo(function AnimatedListItem({
  index,
  staggerDelay = 60,
  children,
  style,
}: AnimatedListItemProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -30, scale: 0.95 }}
      animate={{ opacity: 1, translateX: 0, scale: 1 }}
      transition={{
        ...SPRING_CONFIGS.bouncy,
        delay: index * staggerDelay,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
});

interface AnimatedGridItemProps {
  index: number;
  staggerDelay?: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Optimized grid item with dramatic entrance
 * Includes rotation for more engaging effect
 */
export const AnimatedGridItem = memo(function AnimatedGridItem({
  index,
  staggerDelay = 60,
  children,
  style,
}: AnimatedGridItemProps) {
  const rotateDirection = index % 2 === 0 ? '-5deg' : '5deg';

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.7, translateY: 30, rotate: rotateDirection }}
      animate={{ opacity: 1, scale: 1, translateY: 0, rotate: '0deg' }}
      transition={{
        ...SPRING_CONFIGS.bouncy,
        delay: index * staggerDelay,
      }}
      style={style}
    >
      {children}
    </MotiView>
  );
});
