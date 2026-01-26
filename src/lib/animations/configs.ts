/**
 * Animation Configurations
 *
 * Optimized spring and timing configurations for 60+ FPS
 * All configs use worklet-compatible values
 */

import type { MotiTransition } from 'moti';

/**
 * Spring configurations optimized for different use cases
 * Lower damping = more bounce, higher stiffness = faster response
 */
export const SPRING_CONFIGS = {
  // Ultra-responsive for buttons and quick interactions (fastest)
  snappy: {
    type: 'spring',
    damping: 18,
    stiffness: 350,
    mass: 0.8,
  } as MotiTransition,

  // Bouncy and playful for engaging elements
  bouncy: {
    type: 'spring',
    damping: 12,
    stiffness: 300,
    mass: 0.6,
  } as MotiTransition,

  // Smooth and natural for page transitions
  smooth: {
    type: 'spring',
    damping: 22,
    stiffness: 280,
    mass: 1,
  } as MotiTransition,

  // Gentle and subtle for background animations
  gentle: {
    type: 'spring',
    damping: 26,
    stiffness: 200,
    mass: 1.2,
  } as MotiTransition,
} as const;

/**
 * Timing configurations for linear animations
 * Use sparingly - springs are generally more performant
 */
export const TIMING_CONFIGS = {
  fast: {
    type: 'timing',
    duration: 200,
  } as MotiTransition,

  medium: {
    type: 'timing',
    duration: 300,
  } as MotiTransition,

  slow: {
    type: 'timing',
    duration: 450,
  } as MotiTransition,
} as const;

/**
 * Stagger delays for sequential animations
 * Keep these small to avoid cumulative delay
 */
export const STAGGER_DELAYS = {
  fast: 40,
  medium: 60,
  slow: 80,
} as const;

/**
 * Common entrance animation presets
 * Use transform properties (translateX/Y, scale) for GPU acceleration
 */
export const ENTRANCE_PRESETS = {
  fadeInUp: {
    from: { opacity: 0, translateY: 20, scale: 0.95 },
    animate: { opacity: 1, translateY: 0, scale: 1 },
  },

  fadeInUpSubtle: {
    from: { opacity: 0, translateY: 12 },
    animate: { opacity: 1, translateY: 0 },
  },

  scaleIn: {
    from: { opacity: 0, scale: 0.85 },
    animate: { opacity: 1, scale: 1 },
  },

  slideInRight: {
    from: { opacity: 0, translateX: 30 },
    animate: { opacity: 1, translateX: 0 },
  },

  slideInLeft: {
    from: { opacity: 0, translateX: -30 },
    animate: { opacity: 1, translateX: 0 },
  },

  bounceIn: {
    from: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
  },

  rotateIn: {
    from: { opacity: 0, scale: 0.7, rotate: '-5deg' },
    animate: { opacity: 1, scale: 1, rotate: '0deg' },
  },
} as const;

/**
 * Exit animation presets
 */
export const EXIT_PRESETS = {
  fadeOut: {
    opacity: 0,
  },

  fadeOutDown: {
    opacity: 0,
    translateY: 20,
  },

  scaleOut: {
    opacity: 0,
    scale: 0.9,
  },
} as const;
