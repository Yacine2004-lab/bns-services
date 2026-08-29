/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dde5ff',
          200: '#c3d0ff',
          300: '#9ab0ff',
          400: '#6b8aff',
          500: '#1a3a8a',
          600: '#152e70',
          700: '#102356',
          800: '#0c1a42',
          900: '#070f28',
        },
        accent: '#e87722',
        accentSoft: '#f09050',
        dark: '#0f2557',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      animation: {
        'float-1': 'float 6s ease-in-out infinite',
        'float-2': 'float 5s ease-in-out infinite 0.5s',
        'float-3': 'float 7s ease-in-out infinite 1s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.2' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

