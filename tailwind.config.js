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
        background: {
          DEFAULT: '#080B12',
          card: '#0D1220',
          elevated: '#111827',
          surface: '#151D2E',
          glass: 'rgba(13, 18, 32, 0.75)',
        },
        border: {
          subtle: '#1A2338',
          DEFAULT: '#222F4C',
          hover: '#334466',
        },
        mint: {
          DEFAULT: '#65F5B4',
          glow: 'rgba(101, 245, 180, 0.25)',
          muted: '#2BA875',
          dark: '#0E3B27',
        },
        cyan: {
          DEFAULT: '#55DDF5',
          glow: 'rgba(85, 221, 245, 0.25)',
          muted: '#279BB4',
        },
        lavender: {
          DEFAULT: '#A89BFA',
          glow: 'rgba(168, 155, 250, 0.25)',
          muted: '#6F61C7',
        },
        amber: {
          DEFAULT: '#FFC66D',
          glow: 'rgba(255, 198, 109, 0.25)',
          muted: '#B88737',
        },
        coral: {
          DEFAULT: '#FF777D',
          glow: 'rgba(255, 119, 125, 0.25)',
          muted: '#B84349',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-mint': '0 0 20px -3px rgba(101, 245, 180, 0.2)',
        'glow-cyan': '0 0 20px -3px rgba(85, 221, 245, 0.2)',
        'glow-lavender': '0 0 20px -3px rgba(168, 155, 250, 0.2)',
        'glow-coral': '0 0 20px -3px rgba(255, 119, 125, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'orbit-slow': 'orbit 28s linear infinite',
        'orbit-medium': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit-rev 24s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'orbit-rev': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
      },
    },
  },
  plugins: [],
}
