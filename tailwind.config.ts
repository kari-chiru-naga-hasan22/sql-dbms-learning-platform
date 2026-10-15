import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#171A1C",
          950: "#0D0F10",
          900: "#171A1C",
          850: "#1E2225",
          800: "#262B2E",
          700: "#383E43",
          600: "#4D555B",
        },
        parchment: {
          DEFAULT: "#F1EBDD",
          50: "#FAF8F2",
          100: "#F5EFE3",
          200: "#EBE3D1",
          300: "#DECDB1",
          400: "#CCAFAF",
        },
        sage: {
          DEFAULT: "#91A58B",
          50: "#F4F7F3",
          100: "#E5EDE3",
          200: "#CAD9C7",
          500: "#91A58B",
          600: "#6B8465",
          700: "#4D6347",
        },
        burnt: {
          DEFAULT: "#D86C45",
          50: "#FDF5F2",
          100: "#FAE7E0",
          200: "#F5CAC0",
          500: "#D86C45",
          600: "#BE5732",
          700: "#974020",
        },
        brass: {
          DEFAULT: "#C3A56B",
          50: "#FAF7EF",
          100: "#F4ECDC",
          200: "#E8D8B6",
          500: "#C3A56B",
          600: "#A58548",
          700: "#7F6431",
        },
        slate: {
          DEFAULT: "#747D80",
          50: "#F5F7F7",
          100: "#E7EAEC",
          200: "#CFD5D7",
          400: "#9AA3A6",
          500: "#747D80",
          600: "#596265",
          700: "#42494B",
        },
      },
      fontFamily: {
        serif: ["Charter", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
