import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CircleX — modern, flat, minimalist design system.
        // Same `ocean-*` scale every component already reads from, remapped
        // onto the CircleX brand palette (soft lilac background, plum ink,
        // pink-lilac cards). Numbering is kept only so existing class names
        // (text-ocean-50, bg-ocean-900, ...) still resolve to the right
        // *role* — 50 = primary text/ink, 950 = page background — not
        // literal lightness order.
        ocean: {
          50: "#5B0C70", // Ink — primary text, headings, message text
          100: "#6B1D85", // Ink, slightly softer (rarely used)
          200: "#7C2F96", // strong secondary text (unread preview)
          300: "#9C27B0", // Signal accent — active states, links, badges, focus
          400: "#9C6FAE", // Slate — muted text: labels, subtitles, bio
          500: "#B48EC2", // Slate, lighter — timestamps, empty-state text
          600: "#CBA9D6", // Slate, lightest — chevrons, inactive nav, offline dot
          700: "#E3C7EC", // hairline-adjacent, rarely used
          800: "#F2DDF8", // subtle surface (emoji tray active, hover fill)
          900: "#F6D5FF", // input/chip fill, list dividers — also card/header/bottom bar
          950: "#FBECFF", // Mist — page background, text-on-accent
        },
        abyss: "#FBECFF",
        midnight: "#F6D5FF",
        aqua: "#9C27B0",
        online: "#12A594",
        card: "rgba(91, 12, 112, 0.04)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        bubble: "0 1px 2px rgba(16, 24, 34, 0.06)",
        "glow-aqua": "0 0 0 1px rgba(52, 87, 213, 0.16)",
        "glow-soft": "0 8px 24px rgba(16, 24, 34, 0.08)",
        premium: "0 1px 2px rgba(16, 24, 34, 0.06), 0 12px 32px rgba(16, 24, 34, 0.08)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-in-scale": "fade-in-scale 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
