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
        dark: {
          900: '#07090E',
          850: '#0B0F17',
          800: '#111827',
          750: '#161F30',
          700: '#1F2937',
          600: '#374151'
        },
        border: {
          dark: '#1E293B',
          light: '#334155'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
