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
        // V1 colors (kept for backward compat)
        neon: {
          cyan: '#00ff00',
          purple: '#ff00ff',
          blue: '#00ffff',
        },
        accent: { gold: '#ffff00' },
        surface: '#111111',
        glass: 'rgba(0, 255, 0, 0.05)',

        // V2 design system
        'cyber-lime': '#ccff00',
        'background-dark': '#05070a',
        'onyx': '#0d1117',
        'terminal-green': '#0f0',
        'primary': '#2b6cee',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1f2937 1px, transparent 1px), linear-gradient(to bottom, #1f2937 1px, transparent 1px)",
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(43,108,238,0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(43,108,238,0.3), 0 0 10px rgba(204,255,0,0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
}
