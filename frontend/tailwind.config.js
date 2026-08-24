/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        wheat: {
          50: "#FBF7EE",
          100: "#F5EDDB",
          200: "#EADFC0",
          300: "#DBC998",
        },
        mustard: {
          400: "#D9A441",
          500: "#C08A2E",
          600: "#9C6E22",
          700: "#7A5619",
        },
        ink: {
          800: "#2E2A24",
          900: "#211E1A",
        },
        brick: {
          500: "#A8492F",
          600: "#8A3A25",
        },
        leaf: {
          500: "#4C6B3F",
          600: "#3B5430",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(33, 30, 26, 0.06), 0 1px 6px rgba(33, 30, 26, 0.05)",
      },
    },
  },
  plugins: [],
};
