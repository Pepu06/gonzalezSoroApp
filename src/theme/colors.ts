export const colors = {
  // Primary - Indigo/Purple gradient
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },

  // Secondary - Purple
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },

  // Accent - Cyan/Teal
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

  // Background - Dark theme
  background: {
    primary: '#0f172a',      // slate-900
    secondary: '#1e293b',    // slate-800
    tertiary: '#334155',     // slate-700
    card: '#1e293b',         // slate-800
    modal: 'rgba(15, 23, 42, 0.95)',
  },

  // Surface
  surface: {
    100: '#1e293b',
    200: '#334155',
    300: '#475569',
  },

  // Text
  text: {
    primary: '#f1f5f9',      // slate-100
    secondary: '#cbd5e1',    // slate-300
    tertiary: '#94a3b8',     // slate-400
    disabled: '#64748b',     // slate-500
    inverse: '#0f172a',      // slate-900
  },

  // Border
  border: {
    light: '#334155',        // slate-700
    medium: '#475569',       // slate-600
    dark: '#1e293b',         // slate-800
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.3)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  // Gradients
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    secondary: ['#06b6d4', '#3b82f6'],
    accent: ['#ec4899', '#8b5cf6'],
    success: ['#10b981', '#06b6d4'],
    dark: ['#1e293b', '#0f172a'],
    purple: ['#a855f7', '#6366f1'],
    blue: ['#3b82f6', '#06b6d4'],
  },

  // Status
  status: {
    paid: '#22c55e',         // green-500
    pending: '#f59e0b',      // amber-500
    overdue: '#ef4444',      // red-500
    upcoming: '#3b82f6',     // blue-500
  },

  // Utility
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export type ColorPalette = typeof colors;
