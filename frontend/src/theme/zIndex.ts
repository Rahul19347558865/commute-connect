/**
 * Centralized z-index layers design tokens for Commute Connect.
 * Prevents overlapping layer bugs and standardizes overlay hierarchies.
 */
export const zIndex = {
  base: '0',
  dropdown: '10',     // Popover boxes, drop lists
  sticky: '20',       // Main headers, layouts sticky
  bottomNav: '30',    // Mobile bottom navigation bar
  overlay: '40',      // Modal screen black overlay cover
  modal: '50',        // Dialog modal content window
  toast: '60',        // Float alert notifications
  tooltip: '70',      // Hover metadata description bubbles
} as const;

export type ZIndexType = typeof zIndex;
