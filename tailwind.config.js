/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Background layers (ZocDog)
        background: {
          0: "rgb(var(--color-bg-0) / <alpha-value>)",
          50: "rgb(var(--color-bg-50) / <alpha-value>)",
          100: "rgb(var(--color-bg-100) / <alpha-value>)",
          200: "rgb(var(--color-bg-200) / <alpha-value>)",
        },
        // Primary (Mint Green - ZocDog)
        primary: {
          50: "#EDF5EC",
          100: "#D4E8D1",
          200: "#C5E1A5",
          300: "#A8D5A2",
          400: "#8BC985",
          500: "#6BBD68",
          600: "#5AAD57",
          700: "#489A45",
          800: "#367833",
          900: "#245622",
          DEFAULT: "#6BBD68",
        },
        // Accent (Purple)
        accent: {
          100: "#F3E8F7",
          200: "#E8D8F0",
          500: "#9C7BAE",
        },
        // Secondary (Gold)
        secondary: {
          300: "#F6D365",
          500: "#D4A636",
          700: "#997328",
          DEFAULT: "#D4A636",
        },
        // Semantic
        success: {
          DEFAULT: "#10B981",
          light: "#D1FAE5",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        error: {
          DEFAULT: "#EF4444",
          light: "#FEE2E2",
        },
        info: {
          DEFAULT: "#3B82F6",
          light: "#DBEAFE",
        },
        // Text
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-muted) / <alpha-value>)",
          foreground: "rgb(var(--color-muted-foreground) / <alpha-value>)",
        },
        // Border
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "24px",
      },
      fontSize: {
        tiny: ["11px", { lineHeight: "1.4" }],
        caption: ["12px", { lineHeight: "1.4" }],
        "body-sm": ["13px", { lineHeight: "1.5" }],
        body: ["14px", { lineHeight: "1.5" }],
        "body-lg": ["16px", { lineHeight: "1.5" }],
        h4: ["17px", { lineHeight: "1.35" }],
        h3: ["20px", { lineHeight: "1.35" }],
        h2: ["24px", { lineHeight: "1.2" }],
        h1: ["28px", { lineHeight: "1.2" }],
        display: ["36px", { lineHeight: "1.2" }],
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
    },
  },
  plugins: [],
};

