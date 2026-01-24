/**
 * Optimized Animation Library
 * 
 * High-performance animation utilities for 60+ FPS animations
 * Built on Moti and Reanimated best practices
 */

export * from './configs';
export * from './hooks';
export * from './components';
export * from './utils';

// Re-export commonly used items for convenience
export { SPRING_CONFIGS, TIMING_CONFIGS, STAGGER_DELAYS, ENTRANCE_PRESETS, EXIT_PRESETS } from './configs';
export { usePressAnimation, useBouncyPress, useLiftPress, useStaggeredEntrance, usePulseAnimation } from './hooks';
export { AnimatedEntrance, AnimatedListItem, AnimatedGridItem } from './components';
export { createPressAnimation, getStaggerDelay, createSpringConfig, logPerformanceWarning } from './utils';
