/**
 * Centralized spacing design tokens for Commute Connect.
 * Enforces spacing consistency across margins, paddings, and flex/grid gaps.
 */
export const spacing = {
  xs: '4px',    // 0.25rem - Extra Small
  sm: '8px',    // 0.5rem - Small
  md: '12px',   // 0.75rem - Medium-Small
  lg: '16px',   // 1rem - Medium
  xl: '24px',   // 1.5rem - Large
  xxl: '32px',  // 2rem - Extra Large
  xxxl: '48px', // 3rem - Double Extra Large
  huge: '64px', // 4rem - Huge
} as const;

export type SpacingType = typeof spacing;
