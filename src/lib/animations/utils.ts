/**
 * Animation Utilities
 * 
 * Helper functions for performance optimization
 * Based on Reanimated and Moti best practices
 */

/**
 * Creates a worklet-compatible press animation function
 * Optimized for maximum FPS with minimal overhead
 */
export const createPressAnimation = (options: {
  scaleDown?: number;
  opacityPressed?: number;
  isActive?: boolean;
  scaleActive?: number;
} = {}) => {
  const {
    scaleDown = 0.96,
    opacityPressed = 0.85,
    isActive = false,
    scaleActive = 1,
  } = options;

  return ({ pressed }: { pressed: boolean }) => {
    'worklet';
    return {
      scale: pressed ? scaleDown : isActive ? scaleActive : 1,
      opacity: pressed ? opacityPressed : 1,
    };
  };
};

/**
 * Calculates stagger delay for index
 * Prevents cumulative delays from becoming too large
 */
export const getStaggerDelay = (index: number, baseDelay: number = 60, maxDelay: number = 500): number => {
  return Math.min(index * baseDelay, maxDelay);
};

/**
 * Creates optimized spring config with custom parameters
 */
export const createSpringConfig = (options: {
  damping?: number;
  stiffness?: number;
  mass?: number;
  delay?: number;
} = {}) => {
  const {
    damping = 18,
    stiffness = 300,
    mass = 0.8,
    delay = 0,
  } = options;

  return {
    type: 'spring' as const,
    damping,
    stiffness,
    mass,
    ...(delay > 0 && { delay }),
  };
};

/**
 * Performance monitoring helper
 * Logs FPS warnings in development
 */
export const logPerformanceWarning = (metrics: { fps: number; droppedFrames: number }) => {
  if (__DEV__) {
    if (metrics.fps < 55) {
      console.warn('⚠️ Low FPS detected:', metrics.fps, 'fps');
    }
    if (metrics.droppedFrames > 5) {
      console.warn('⚠️ Dropped frames:', metrics.droppedFrames);
    }
  }
};
