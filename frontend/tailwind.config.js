/* eslint-disable @typescript-eslint/naming-convention */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "512px",
      ...defaultTheme.screens,
      "3xl": "1600px",
    },
    extend: {
      fontFamily: {
        // sans: ['"Nunito Sans"', "sans-serif"],
        // mono: ['"Ubuntu Mono"', "monospace"],
      },
      colors: {
        violet: colors.violet,
        gray: {
          ...colors.slate,
          750: "#293548",
          850: "#172033",
          950: "#0C1322",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
