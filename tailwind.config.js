/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#b20007",
        "primary-container": "#d7261e",
        "on-primary": "#ffffff",
        surface: "#fff8f3",
        "surface-bright": "#ffffff",
        "surface-dim": "#e4d8ca",
        "surface-low": "#fef2e3",
        "surface-high": "#ede1d2",
        "on-surface": "#201b12",
        "outline-variant": "#e6bdb7",
        secondary: "#201b12",
      },
      fontFamily: {
        amiri: ['Amiri', 'serif'],
        cairo: ['Cairo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
