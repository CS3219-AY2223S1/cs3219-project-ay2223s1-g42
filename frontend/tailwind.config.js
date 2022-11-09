/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./*.html",
    "./src/**/*.css",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    // "./src/login/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/*.{js,ts,jsx,tsx}",
    "./src/**/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "512px",
      ...defaultTheme.screens,
      "3xl": "1600px",
    },
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.neutral.700"),
            h2: {
              color: theme("colors.neutral.800"),
            },
            h3: {
              color: theme("colors.netrual.800"),
            },
            a: {
              color: theme("colors.neutral.500"),
              "&:hover": {
                color: theme("colors.neutral.700"),
              },
            },
          },
        },
      }),
      fontFamily: {
        display: ["AllianceNo1", "sans-serif"],
        sans: ["AllianceNo2", "sans-serif"],
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
  plugins: [
    require("@tailwindcss/forms"),
    require("tailwind-scrollbar")({ nocompatible: true }),
  ],
};
