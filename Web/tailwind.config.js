/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        neutral: {
          950: '#0A0A0A',
          900: '#171717',
          800: '#262626',
        },
        primary: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        emerald: {
          400: '#34D399',
        },
      },
      backgroundImage: {
        'glass': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        'glass-hover': 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'cyber-grid': 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
      }
    }
  },
  plugins: [],
}
