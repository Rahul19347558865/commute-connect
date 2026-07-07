/**
 * Centralized border-radius design tokens for Commute Connect.
 * Establishes consistent corner rounding configurations.
 */
export const radius = {
  small: '8px',    // Input fields, small badges
  medium: '12px',  // Cards, dropdown list container frames
  large: '16px',   // Main popover modals, onboarding containers
  pill: '999px',   // Rounded avatar frames, pills badges
} as const;

export type RadiusType = typeof radius;
