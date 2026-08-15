/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#edfcf5',
          100: '#d3f8e7',
          200: '#aaf0d0',
          300: '#73e3b4',
          400: '#39ce94',
          500: '#15b478',
          600: '#0a9262',
          700: '#097451',
          800: '#0a5c42',
          900: '#094c38',
          950: '#042b20',
        },
        slate: {
          850: '#172032',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
