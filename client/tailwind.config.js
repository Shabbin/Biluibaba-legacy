/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/theme");

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "header-bg":
          "url('/header.jpg'), linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {},
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    heroui(),
    require("tailwind-scrollbar"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
};
