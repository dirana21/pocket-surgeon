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
        medical: {
          dark: '#070D1B',
          card: '#0B1326',
          surface: '#101B33',
          border: '#1E293B',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          accent: '#22D3EE',
          amber: '#F59E0B',
          crimson: '#EF4444',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
