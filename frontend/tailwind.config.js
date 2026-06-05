/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#543310",
        secondary: "#74512D",
        accent: "#AF8F6F",
        cream: "#F8F4E1",
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
      },
      boxShadow: {
        'glow': '0 0 20px rgba(84, 49, 16, 0.3)',
        'glow-secondary': '0 0 20px rgba(116, 81, 45, 0.3)',
        'glow-accent': '0 0 20px rgba(175, 143, 111, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
