/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '390px',
      'sm': '768px',
      'md': '1024px',
      'lg': '1440px',
    },
    extend: {
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
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'small': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
