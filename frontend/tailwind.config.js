/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0B2942',
        // "harbor" = the site's primary navy scale, used throughout components
        harbor: {
          50: '#EEF3F8',
          100: '#DCE6F0',
          200: '#B7C9DC',
          300: '#8AA6C2',
          400: '#4D7399',
          500: '#2C5479',
          600: '#1B3E60',
          700: '#122E4A',
          800: '#0D2238',
          900: '#081627',
        },
        saffron: {
          DEFAULT: '#FF9933',
          dark: '#E07E1A',
        },
        indiagreen: {
          DEFAULT: '#128807',
          dark: '#0C6405',
        },
        sun: '#F2A93B',
        leaf: '#128807',
        clay: '#B3311C',
        paper: '#F5F4EF',
        night: {
          bg: '#081627',
          card: '#0D2238',
          border: '#1B3E60',
        },
      },
      fontFamily: {
        display: ['Merriweather', 'Georgia', 'serif'],
        body: ['"PT Sans"', 'Verdana', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 18px -8px rgba(8, 22, 39, 0.28)',
        card: '0 2px 10px -4px rgba(8, 22, 39, 0.18)',
      },
      borderRadius: {
        '2.5xl': '0.85rem',
        '3xl': '1rem',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.06)' },
        },
      },
      animation: {
        breathe: 'breathe 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
