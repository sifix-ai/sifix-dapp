/**
 * SIFIX Design System - 0G Chain Theme
 *
 * Complete design system tokens and utilities
 */

export const colors = {
  // Primary colors - 0G branding
  primary: {
    DEFAULT: '#ff6b6b',
    dark: '#e55a5a',
    light: '#ff8a8a',
  },

  // Secondary colors
  secondary: {
    DEFAULT: '#4ecdc4',
    dark: '#3db8b0',
    light: '#6ee8de',
  },

  // Background colors
  background: {
    DEFAULT: '#0a0a0f',
    surface: '#101111',
    card: '#18191a',
    elevated: '#1f1f22',
  },

  // Text colors
  text: {
    primary: '#ffffff',
    secondary: '#e5e5e5',
    tertiary: '#a1a1aa',
    muted: '#737373',
  },

  // Border colors
  border: {
    DEFAULT: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(78, 205, 196, 0.3)',
  },

  // Semantic colors
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
  info: '#3b82f6',

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
    primarySubtle: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(78, 205, 196, 0.1) 100%)',
    dark: 'linear-gradient(135deg, #0a0a0f 0%, #101111 100%)',
  },
};

export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '0.75rem',  // 12px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
};

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
};

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06).',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06).',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05).',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04).',
  glow: '0 0 20px rgba(255, 107, 107, 0.3)',
  glowAccent: '0 0 24px rgba(255, 107, 107, 0.4), 0 0 40px rgba(255, 107, 107, 0.2)',
};

export const animation = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Utility classes for common patterns
export const utils = {
  // Gradient text
  gradientText: 'bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent',

  // Glass morphism
  glass: 'bg-white/5 backdrop-blur-lg border border-white/10',

  // Glow effects
  glow: 'shadow-[0_0_20px_rgba(255,107,107,0.3)]',
  glowAccent: 'shadow-[0_0_24px_rgba(255,107,107,0.4),_0_0_40px_rgba(255,107,107,0.2)]',
};
