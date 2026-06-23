/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        nequi: {
          pink: '#FF2D74',
          'pink-dark': '#E6005C',
          'pink-light': '#FF6B9D',
          yellow: '#FFD400',
          dark: '#1A0A2E',
          'dark-soft': '#2A1240',
          charcoal: '#16131C',
        },
      },
      boxShadow: {
        'nequi': '0 10px 30px -8px rgba(255, 45, 116, 0.35)',
        'soft': '0 8px 30px -10px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
