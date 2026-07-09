/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Mobile-first breakpoints matching system documentation
    screens: {
      'xs': '390px',   // Mobile Small/Standard
      'sm': '768px',   // Tablet
      'md': '1024px',  // Laptop
      'lg': '1440px',  // Desktop
    },
    extend: {
      // Centralized Color System
      colors: {
        brand: {
          primary: '#2563EB',
          hover: '#1D4ED8',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        neutral: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          textMain: '#111827',
          textSub: '#6B7280',
          borderLine: '#E5E7EB',
        }
      },
      // Centralized Typography System sizes
      fontSize: {
        'h1': ['36px', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['30px', { lineHeight: '1.25', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.5', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'tiny': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      // Centralized Spacing System
      spacing: {
        'spacing-xs': '4px',
        'spacing-sm': '8px',
        'spacing-md': '12px',
        'spacing-lg': '16px',
        'spacing-xl': '24px',
        'spacing-xxl': '32px',
        'spacing-xxxl': '48px',
        'spacing-huge': '64px',
      },
      // Centralized Border Radius System
      borderRadius: {
        'radius-sm': '8px',
        'radius-md': '12px',
        'radius-lg': '16px',
        'radius-pill': '999px',
      },
      // Centralized Elevation Shadows System
      boxShadow: {
        'shadow-small': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'shadow-medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'shadow-large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // Centralized Z-Index Hierarchy Layering
      zIndex: {
        'layer-base': '1',
        'layer-dropdown': '10',
        'layer-sticky': '20',
        'layer-bottomNav': '30',
        'layer-overlay': '40',
        'layer-drawer': '45',
        'layer-modal': '50',
        'layer-toast': '60',
        'layer-tooltip': '70',
      },
      // Consistent transition speed tokens
      transitionDuration: {
        'theme-fast': '150ms',
        'theme-normal': '250ms',
      }
    },
  },
  plugins: [],
}
