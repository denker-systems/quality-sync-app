/**
 * Global animation configurations for consistent, high-performance animations
 */

export const SPRING_CONFIGS = {
  // Snappy, responsive spring for buttons and interactions
  snappy: {
    type: 'spring' as const,
    damping: 18,
    stiffness: 350,
    mass: 0.8,
  },
  
  // Bouncy spring for playful elements
  bouncy: {
    type: 'spring' as const,
    damping: 12,
    stiffness: 300,
    mass: 0.6,
  },
  
  // Smooth spring for page transitions
  smooth: {
    type: 'spring' as const,
    damping: 22,
    stiffness: 280,
    mass: 1,
  },
  
  // Gentle spring for subtle animations
  gentle: {
    type: 'spring' as const,
    damping: 26,
    stiffness: 200,
    mass: 1.2,
  },
} as const;

export const TIMING_CONFIGS = {
  // Fast timing for quick transitions
  fast: {
    type: 'timing' as const,
    duration: 200,
  },
  
  // Medium timing for standard animations
  medium: {
    type: 'timing' as const,
    duration: 300,
  },
  
  // Slow timing for dramatic effects
  slow: {
    type: 'timing' as const,
    duration: 450,
  },
} as const;

export const ENTRANCE_ANIMATIONS = {
  // Fade in from bottom with scale
  fadeInUp: {
    from: { opacity: 0, translateY: 20, scale: 0.95 },
    animate: { opacity: 1, translateY: 0, scale: 1 },
  },
  
  // Fade in from bottom (subtle)
  fadeInUpSubtle: {
    from: { opacity: 0, translateY: 12 },
    animate: { opacity: 1, translateY: 0 },
  },
  
  // Scale in with fade
  scaleIn: {
    from: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },
  
  // Slide in from right
  slideInRight: {
    from: { opacity: 0, translateX: 30 },
    animate: { opacity: 1, translateX: 0 },
  },
  
  // Bounce in
  bounceIn: {
    from: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
  },
} as const;

export const PRESS_ANIMATIONS = {
  // Standard press - scale down slightly
  standard: ({ pressed }: { pressed: boolean }) => {
    'worklet';
    return {
      scale: pressed ? 0.96 : 1,
      opacity: pressed ? 0.85 : 1,
    };
  },
  
  // Bouncy press - more dramatic scale
  bouncy: ({ pressed }: { pressed: boolean }) => {
    'worklet';
    return {
      scale: pressed ? 0.92 : 1,
      opacity: pressed ? 0.8 : 1,
    };
  },
  
  // Lift press - scale up slightly
  lift: ({ pressed }: { pressed: boolean }) => {
    'worklet';
    return {
      scale: pressed ? 1.05 : 1,
      opacity: pressed ? 0.9 : 1,
    };
  },
  
  // Active state press - for tabs and toggles
  active: (isActive: boolean) => ({ pressed }: { pressed: boolean }) => {
    'worklet';
    return {
      scale: pressed ? 0.94 : isActive ? 1.08 : 1,
      opacity: pressed ? 0.85 : 1,
    };
  },
} as const;

export const STAGGER_DELAYS = {
  fast: 40,
  medium: 60,
  slow: 80,
} as const;
