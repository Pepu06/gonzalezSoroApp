export const animations = {
  // Duration in milliseconds
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },

  // Spring configs for Reanimated
  spring: {
    gentle: {
      damping: 20,
      stiffness: 90,
    },
    smooth: {
      damping: 15,
      stiffness: 120,
    },
    snappy: {
      damping: 10,
      stiffness: 150,
    },
    bouncy: {
      damping: 8,
      stiffness: 180,
    },
  },

  // Timing configs
  timing: {
    fast: { duration: 200 },
    normal: { duration: 300 },
    slow: { duration: 500 },
  },
};

export type Animations = typeof animations;
