/** @type {import('tailwindcss').Config} */
export default {
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
    },
  },
  plugins: [],
}
