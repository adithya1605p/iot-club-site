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
        neon: {
          cyan: '#00ff00',   // Retro Green (Terminal)
          purple: '#ff00ff', // Hot Pink (Magenta)
          blue: '#00ffff',   // Cyan
        },
        accent: {
          gold: '#ffff00', // Pure Yellow
        },
        background: '#000000', // Pure Black
        surface: '#111111',    // Very Dark Grey
        glass: 'rgba(0, 255, 0, 0.05)', // Green tint
      },
      fontFamily: {
        sans: ['"Rajdhani"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(6, 182, 212, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(6, 182, 212, 0.3), 0 0 10px rgba(37, 99, 235, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
