import { TextStyle } from 'react-native';

export const typography = {
  // Font families
  fonts: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  weights: {
    normal: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    extrabold: '800' as TextStyle['fontWeight'],
  },

  // Predefined text styles
  styles: {
    h1: {
      fontSize: 48,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 57.6,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 36,
      fontWeight: '700' as TextStyle['fontWeight'],
      lineHeight: 43.2,
      letterSpacing: -0.3,
    },
    h3: {
      fontSize: 30,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 36,
      letterSpacing: 0,
    },
    h4: {
      fontSize: 24,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 28.8,
      letterSpacing: 0,
    },
    h5: {
      fontSize: 20,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
      letterSpacing: 0,
    },
    h6: {
      fontSize: 18,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 21.6,
      letterSpacing: 0,
    },
    body1: {
      fontSize: 16,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 24,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 21,
      letterSpacing: 0,
    },
    subtitle1: {
      fontSize: 16,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 24,
      letterSpacing: 0.15,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 21,
      letterSpacing: 0.1,
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as TextStyle['fontWeight'],
      lineHeight: 24,
      letterSpacing: 0.5,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as TextStyle['fontWeight'],
      lineHeight: 18,
      letterSpacing: 0.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: '500' as TextStyle['fontWeight'],
      lineHeight: 15,
      letterSpacing: 1.5,
      textTransform: 'uppercase' as TextStyle['textTransform'],
    },
  },
};

export type Typography = typeof typography;
