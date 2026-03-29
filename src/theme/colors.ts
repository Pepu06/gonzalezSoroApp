export const colors = {
  // Primary - Green palette
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#A6EBC9',
    300: '#5EEB5B',
    400: '#61FF7E',
    500: '#62AB37',
    600: '#4d8a2b',
    700: '#3a6920',
    800: '#274816',
    900: '#393424',
  },

  // Secondary - Teal/Mint
  secondary: {
    50: '#f0fdf9',
    100: '#ccfbef',
    200: '#99f6e0',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },

  // Accent - keeping teal
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },

  // Success - Green
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  // Warning - Amber
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  // Error - Red
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Info - Blue
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },

  // Background - Light theme
  background: {
    primary: '#f8fafc',      // slate-50
    secondary: '#f1f5f9',    // slate-100
    tertiary: '#e2e8f0',     // slate-200
    card: '#ffffff',
    modal: 'rgba(248, 250, 252, 0.95)',
  },

  // Surface
  surface: {
    100: '#ffffff',
    200: '#f1f5f9',
    300: '#e2e8f0',
  },

  // Text
  text: {
    primary: '#0f172a',      // slate-900
    secondary: '#334155',    // slate-700
    tertiary: '#64748b',     // slate-500
    disabled: '#94a3b8',     // slate-400
    inverse: '#f8fafc',      // slate-50
  },

  // Border
  border: {
    light: '#e2e8f0',        // slate-200
    medium: '#cbd5e1',       // slate-300
    dark: '#94a3b8',         // slate-400
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.3)',
    dark: 'rgba(0, 0, 0, 0.5)',
  },

  // Gradients
  gradients: {
    primary: ['#61FF7E', '#62AB37'],
    secondary: ['#A6EBC9', '#5EEB5B'],
    accent: ['#5EEB5B', '#62AB37'],
    success: ['#10b981', '#62AB37'],
    dark: ['#f1f5f9', '#e2e8f0'],
    purple: ['#62AB37', '#393424'],
    blue: ['#A6EBC9', '#61FF7E'],
  },

  // Status
  status: {
    paid: '#62AB37',
    pending: '#f59e0b',
    overdue: '#ef4444',
    upcoming: '#5EEB5B',
  },

  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorPalette = typeof colors;