/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
        height: "max-height",
      },
      colors: {
        tangerine: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        red: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4452",
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },
        light: {
          primary: "#0F1A2A",
          secondary: "#0F1A2A75",
          muted: "#0F1A2A55",
          line: "#F0F0F0",
          background: {
            DEFAULT: "#FAFAFA",
            secondary: "#FFFFFF",
          },
        },
        dark: {
          primary: "#FFFFFF",
          secondary: "#FFFFFF75",
          muted: "#FFFFFF55",
          line: "#3B3B3B",
          background: {
            DEFAULT: "#181818",
            secondary: "#292929",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("selected-page", '&[data-active="true"]');
    }),
  ],
};
