/**
 * Centralized color design tokens for Commute Connect.
 * Maps primary, semantic status, and neutral text/background colors.
 */
export const colors = {
  brand: {
    primary: '#2563EB', // Core Indigo/Blue
    hover: '#1D4ED8',   // Hover Blue
    success: '#22C55E', // Green status
    warning: '#F59E0B', // Amber status
    error: '#EF4444',   // Red status
  },
  neutral: {
    bg: '#F8FAFC',      // Slate 50 background
    surface: '#FFFFFF', // Pure white card/page surfaces
    textMain: '#111827', // Slate 900 primary readable text
    textSub: '#6B7280',  // Slate 500 secondary helper text
    borderLine: '#E5E7EB', // Slate 200 borders
  },
} as const;

export type ColorsType = typeof colors;
