import { colors } from './colors';
import { typography } from './typography';
import { spacing, borderRadius, iconSizes } from './spacing';
import { shadows } from './shadows';
import { animations } from './animations';

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  iconSizes,
  shadows,
  animations,
} as const;

export type Theme = typeof theme;

// Export individual modules for convenience
export { colors } from './colors';
export { typography } from './typography';
export { spacing, borderRadius, iconSizes } from './spacing';
export { shadows } from './shadows';
export { animations } from './animations';
