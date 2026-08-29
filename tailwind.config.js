/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf4ff',
          100: '#dfeeff',
          200: '#c7ddff',
          300: '#9cc0ff',
          400: '#6297ff',
          500: '#0d3d9c',
          600: '#0a2f7d',
          700: '#08255e',
          800: '#071d49',
          900: '#050f2d',
        },
        accent: '#f57c20',
        accentSoft: '#ffb266',
        dark: '#071d49',
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

