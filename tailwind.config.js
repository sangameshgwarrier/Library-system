/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        library: {
          50: '#f6f7f9',
          100: '#edeef2',
          200: '#d7dbe3',
          300: '#b4bccb',
          400: '#8c99af',
          500: '#6d7b95',
          600: '#56627c',
          700: '#465066',
          800: '#3c4456',
          900: '#2c3340',
          950: '#1e222b',
        },
        parchment: {
          50: '#fbfaf6',
          100: '#f5f3e9',
          200: '#ede6d1',
          300: '#e1d4b2',
          400: '#d3bc8d',
          500: '#c5a56c',
        },
        accent: {
          blue: '#2563eb',
          amber: '#d97706',
          emerald: '#059669',
          rose: '#e11d48',
          indigo: '#4f46e5',
          violet: '#7c3aed',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'Cambria', 'serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(99, 102, 241, 0.6))' },
          '50%': { opacity: '0.7', filter: 'drop-shadow(0 0 5px rgba(99, 102, 241, 0.2))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        'gradient-x': {
          '0%, 100%': { 'background-size': '200% 200%', 'background-position': 'left center' },
          '50%': { 'background-size': '200% 200%', 'background-position': 'right center' },
        }
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2.5s infinite linear',
        scanline: 'scanline 8s linear infinite',
        'gradient-x': 'gradient-x 12s ease infinite',
      }
    },
  },
  plugins: [],
}
