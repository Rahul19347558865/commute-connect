/**
 * Centralized typography design tokens for Commute Connect.
 * Enforces text size hierarchy, font weights, and line heights.
 */
export const typography = {
  fontFamily: "'Inter', sans-serif",
  sizes: {
    h1: '36px',     // 2.25rem
    h2: '30px',     // 1.875rem
    h3: '24px',     // 1.5rem
    h4: '20px',     // 1.25rem
    body: '16px',   // 1rem
    small: '14px',  // 0.875rem
    tiny: '12px',   // 0.75rem
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    normal: '1.5',
    tight: '1.25',
    none: '1',
  },
} as const;

export type TypographyType = typeof typography;
