import type { Config } from "tailwindcss";
const c = (v: string) => `rgb(var(--${v}) / <alpha-value>)`; // fixes opacity utilities like bg-bg/80 and bg-card/70
export default { darkMode: "class", content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { fontFamily: { sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"], display: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"] }, colors: { bg: c("bg"), fg: c("fg"), muted: c("muted"), card: c("card"), line: c("line"), brand: c("brand"), accent: c("accent") } } } } satisfies Config;
