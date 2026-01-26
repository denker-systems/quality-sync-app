/**
 * Animation Hooks
 *
 * Optimized hooks for high-performance animations
 * All hooks use memoization and worklets for maximum FPS
 */

import { useCallback, useMemo } from 'react';
import type { MotiPressableInteractionProp } from 'moti/interactions';

/**
 * Creates a memoized press animation callback
 * Optimized for components that re-render frequently
 *
 * @example
 * const pressAnimation = usePressAnimation({ scaleDown: 0.96 });
 * <MotiPressable animate={pressAnimation} />
 */
export function usePressAnimation(
  options: {
    scaleDown?: number;
    scaleUp?: number;
    opacityPressed?: number;
    isActive?: boolean;
  } = {},
) {
  const { scaleDown = 0.96, scaleUp = 1, opacityPressed = 0.85, isActive = false } = options;

  return useCallback<MotiPressableInteractionProp>(
    ({ pressed }) => {
      'worklet';
      return {
        scale: pressed ? scaleDown : isActive ? scaleUp : 1,
        opacity: pressed ? opacityPressed : 1,
      };
    },
    [scaleDown, scaleUp, opacityPressed, isActive],
  );
}

/**
 * Creates a memoized bounce press animation
 * More dramatic scale effect for engaging interactions
 */
export function useBouncyPress(isActive: boolean = false) {
  return useCallback<MotiPressableInteractionProp>(
    ({ pressed }) => {
      'worklet';
      return {
        scale: pressed ? 0.92 : isActive ? 1.08 : 1,
        opacity: pressed ? 0.8 : 1,
      };
    },
    [isActive],
  );
}

/**
 * Creates a memoized lift press animation
 * Scales up slightly on press for "lifting" effect
 */
export function useLiftPress() {
  return useCallback<MotiPressableInteractionProp>(({ pressed }) => {
    'worklet';
    return {
      scale: pressed ? 1.05 : 1,
      opacity: pressed ? 0.9 : 1,
    };
  }, []);
}

/**
 * Creates entrance animation config with stagger delay
 * Memoized to prevent recreation on every render
 */
export function useStaggeredEntrance(index: number, delayMs: number = 60) {
  return useMemo(
    () => ({
      from: { opacity: 0, translateY: 20, scale: 0.95 },
      animate: { opacity: 1, translateY: 0, scale: 1 },
      transition: {
        type: 'spring' as const,
        damping: 18,
        stiffness: 300,
        delay: index * delayMs,
      },
    }),
    [index, delayMs],
  );
}

/**
 * Creates a memoized loop animation for pulsing effects
 * Optimized for continuous animations like active states
 */
export function usePulseAnimation(
  isActive: boolean,
  options: {
    scaleMin?: number;
    scaleMax?: number;
    duration?: number;
  } = {},
) {
  const { scaleMin = 1, scaleMax = 1.05, duration = 2000 } = options;

  return useMemo(
    () => ({
      animate: isActive ? { scale: [scaleMin, scaleMax, scaleMin] } : { scale: 1 },
      transition: isActive
        ? { type: 'timing' as const, duration, loop: true }
        : { type: 'timing' as const, duration: 200 },
    }),
    [isActive, scaleMin, scaleMax, duration],
  );
}
