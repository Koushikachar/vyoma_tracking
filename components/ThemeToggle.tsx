"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
// icon = square icon-only button (mobile header). label = icon + text row (desktop sidebar).
export default function ThemeToggle({ className = "", label = false, icon = false }: { className?: string; label?: boolean; icon?: boolean }) {
  const [dark, setDark] = useState<boolean | null>(null);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => { const d = !document.documentElement.classList.contains("dark"); setDark(d); document.documentElement.classList.toggle("dark", d); try { localStorage.setItem("theme", d ? "dark" : "light"); } catch {} };
  const text = dark ? "Light mode" : "Dark mode";
  const base = icon ? "grid h-10 w-10 place-items-center rounded-xl border border-line bg-card text-muted hover:text-fg transition" : "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-line/60 hover:text-fg transition";
  return (<button type="button" onClick={toggle} aria-label="Toggle light / dark mode" title={text} className={`${base} ${className}`}>
    {dark ? <Sun size={18} /> : <Moon size={18} />}{label && !icon && <span>{dark === null ? "Theme" : text}</span>}</button>);
}