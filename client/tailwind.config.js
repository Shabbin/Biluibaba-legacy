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
      fontFamily: {
        sans: ['Nunito', 'Quicksand', 'Poppins', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        "header-bg":
          "url('/header.jpg'), linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 1))",
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        'pill': '9999px',
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        petzy: {
          // Soft pastel backgrounds
          'blue-light': '#F0F8FF',
          'mint-light': '#E6F7F8',
          'periwinkle': '#B8C5D6',
          'periwinkle-light': '#E8EDF5',
          'yellow-soft': '#FFF9E6',
          // Primary coral/salmon accent
          'coral': '#FF8A80',
          'coral-light': '#FFB3AB',
          'coral-dark': '#FF6B61',
          // Typography
          'slate': '#333333',
          'slate-light': '#666666',
        },
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
        'soft-lg': '0 15px 40px -15px rgba(0, 0, 0, 0.12)',
        'soft-xl': '0 30px 60px -20px rgba(0, 0, 0, 0.2)',
        'blob': '0 20px 50px -20px rgba(0, 0, 0, 0.15)',
        'glow': '0 0 20px rgba(255, 138, 128, 0.3)',
        'glow-lg': '0 0 40px rgba(255, 138, 128, 0.4)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        fadeIn: 'fadeIn 0.3s ease-out',
        slideIn: 'slideIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
      },
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
    require("@tailwindcss/line-clamp"),
  ],
};
