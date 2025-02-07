
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          light: "#b3a3f7",
          dark: "#7E69AB",
        },
        secondary: {
          DEFAULT: "#7E69AB",
          light: "#9B8BC0",
          dark: "#614B8E",
        },
        accent: {
          DEFAULT: "#88C0A3",
          light: "#A8D4BE",
          dark: "#669B84",
        },
        neutral: {
          50: "#F8F9FC",
          100: "#F1F3F9",
          200: "#E2E7F0",
          300: "#CBD3E3",
          400: "#9BA7C0",
          500: "#6B7A96",
          600: "#4A5469",
          700: "#2E3545",
          800: "#1A1F2C",
          900: "#0D1017",
        },
      },
      backgroundImage: {
        'gradient-elegant': 'linear-gradient(to right, #9b87f5, #7E69AB)',
        'gradient-card': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
