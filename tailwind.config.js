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
        primary: {
          DEFAULT: '#1e293b', // Deep slate blue
          light: '#334155',
          dark: '#0f172a',
        },
        secondary: {
          DEFAULT: '#0891b2', // Cyan blue
          light: '#06b6d4',
          dark: '#0e7490',
        },
        accent: {
          DEFAULT: '#38bdf8', // Sky blue
          light: '#7dd3fc',
          dark: '#0284c7',
        },
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

