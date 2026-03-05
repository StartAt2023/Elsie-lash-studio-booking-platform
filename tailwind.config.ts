import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        cream: "#F8F6F2",
        charcoal: "#1C1C1C",
        gold: "#C6A76E",
        muted: "#6B6B6B",
        borderSoft: "#E2DED5",
      },
      boxShadow: {
        soft: "0 2px 16px rgba(0, 0, 0, 0.04)",
        card: "0 4px 24px rgba(0, 0, 0, 0.06)",
        cardHover: "0 12px 40px rgba(0, 0, 0, 0.08)",
      },
      letterSpacing: {
        "luxury": "0.02em",
        "luxury-wide": "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
