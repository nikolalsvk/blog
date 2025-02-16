/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/templates/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      colors: {
        primary: "var(--color-primary)",
        orange: {
          600: "rgb(224, 109, 6)", // from value - darker orange
          400: "rgb(255, 167, 0)", // to value - lighter orange
        },
      },
    },
  },
  plugins: [],
}
