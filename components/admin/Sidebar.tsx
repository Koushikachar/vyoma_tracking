"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Grid2x2,
  X,
  LayoutDashboard,
  Package,
  FlaskConical,
  Plug,
  Activity,
  KeyRound,
  Webhook,
  Users,
  Settings,
  Mail,
  ScrollText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
const ICONS: Record<string, any> = {
  dashboard: LayoutDashboard,
  shipments: Package,
  "tracking-lab": FlaskConical,
  integrations: Plug,
  "carrier-health": Activity,
  "api-keys": KeyRound,
  webhooks: Webhook,
  users: Users,
  settings: Settings,
  "contact-messages": Mail,
  "audit-logs": ScrollText,
  security: ShieldCheck,
};
export default function Sidebar({
  route,
  items,
  email,
  role,
}: {
  route: string;
  items: [string, string][];
  email: string;
  role: string;
}) {
  const path = usePathname();
  const name = email.split("@")[0];
  const [open, setOpen] = useState(false);
  const isOn = (h: string) => path.includes(`/${route}/${h}`);
  // 4 most-used pages stay on the bottom bar; everything else lives in the "More" sheet (5 items or fewer -> no sheet needed)
  const PREF = ["dashboard", "shipments", "tracking-lab", "carrier-health"];
  const pick =
    items.length <= 5
      ? items
      : [
          ...(PREF.map((k) => items.find((i) => i[0] === k)).filter(
            Boolean,
          ) as [string, string][]),
          ...items.filter((i) => !PREF.includes(i[0])),
        ].slice(0, 4);
  const main = pick;
  const more = items.length <= 5 ? [] : items.filter((i) => !pick.includes(i));
  const moreOn = more.some(([h]) => isOn(h));
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  // Lock the page behind the "All pages" sheet (position:fixed also works on iOS Safari)
  useEffect(() => {
    if (!open) return;
    const y = window.scrollY,
      b = document.body,
      st = b.style,
      prev = {
        position: st.position,
        top: st.top,
        left: st.left,
        right: st.right,
        width: st.width,
      };
    Object.assign(st, {
      position: "fixed",
      top: `-${y}px`,
      left: "0",
      right: "0",
      width: "100%",
    });
    return () => {
      Object.assign(st, prev);
      window.scrollTo(0, y);
    };
  }, [open]);
  return (
    <>
      {/* MOBILE: slim top bar + bottom tab bar (4 main pages + "More" sheet) */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-card/85 backdrop-blur-xl px-4 h-16">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl admin-hero text-sm font-bold">
          V
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate font-semibold">{name}</div>
          <div className="truncate text-[11px] tracking-wide text-muted">
            {role}
          </div>
        </div>
        <ThemeToggle icon />
        <form action="/api/control/logout" method="post">
          <button
            aria-label="Logout"
            title="Logout"
            className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-card text-muted hover:text-red-500 transition"
          >
            <LogOut size={18} />
          </button>
        </form>
      </header>

      <nav
        aria-label="Admin"
        className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-line bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
      >
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          {main.map(([h, l]) => {
            const I = ICONS[h] ?? LayoutDashboard;
            const on = isOn(h);
            return (
              <Link
                key={h}
                href={`/control/${route}/${h}`}
                aria-label={l}
                title={l}
                aria-current={on ? "page" : undefined}
                className="grid h-full flex-1 place-items-center"
              >
                <span
                  className={`grid h-9 w-14 place-items-center rounded-2xl transition ${on ? "bg-brand/15 text-brand" : "text-muted"}`}
                >
                  <I size={21} />
                </span>
              </Link>
            );
          })}
          {more.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="More pages"
              aria-expanded={open}
              className="grid h-full flex-1 place-items-center"
            >
              <span
                className={`grid h-9 w-14 place-items-center rounded-2xl transition ${moreOn ? "bg-brand/15 text-brand" : "text-muted"}`}
              >
                <Grid2x2 size={21} />
              </span>
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="sheet"
            className="md:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              aria-label="Close"
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-label="All pages"
              className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-line bg-card p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line" />
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold">All pages</h2>
                <button
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-line/60"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {items.map(([h, l]) => {
                  const I = ICONS[h] ?? LayoutDashboard;
                  const on = isOn(h);
                  return (
                    <Link
                      key={h}
                      href={`/control/${route}/${h}`}
                      onClick={() => setOpen(false)}
                      aria-current={on ? "page" : undefined}
                      className="flex flex-col items-center gap-1.5 rounded-2xl py-2 text-center"
                    >
                      <span
                        className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${on ? "border-brand/40 bg-brand/15 text-brand" : "border-line bg-card text-muted"}`}
                      >
                        <I size={21} />
                      </span>
                      <span
                        className={`text-[11px] leading-tight ${on ? "text-brand font-semibold" : "text-muted"}`}
                      >
                        {l}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DESKTOP: full sidebar with names */}
      <aside className="hidden md:flex md:w-64 shrink-0 sticky top-0 h-screen flex-col border-r border-line bg-card/80 backdrop-blur-xl">
        <div className="flex shrink-0 items-center gap-3 px-6 pt-6 pb-4 font-bold tracking-[0.2em]">
          <span className="grid place-items-center w-9 h-9 rounded-xl admin-hero text-sm">
            V
          </span>
          VYOMA
        </div>
        <nav
          aria-label="Admin"
          className="thin-scroll flex flex-col gap-1 px-4 py-2 overflow-y-auto flex-1 min-h-0"
        >
          {items.map(([h, l]) => {
            const I = ICONS[h] ?? LayoutDashboard;
            const on = path.includes(`/${route}/${h}`);
            return (
              <Link
                key={h}
                href={`/control/${route}/${h}`}
                aria-current={on ? "page" : undefined}
                className={`relative flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition ${on ? "bg-brand/15 text-brand font-semibold" : "text-muted hover:bg-line/60 hover:text-fg"}`}
              >
                {on && (
                  <span className="absolute -left-4 top-2 bottom-2 w-1 rounded-full bg-brand" />
                )}
                <I size={18} />
                {l}
              </Link>
            );
          })}
        </nav>
        <div className="shrink-0 flex flex-col gap-1 px-4 pt-3 pb-6 border-t border-line">
          <div className="px-3 pb-2 text-xs text-muted truncate" title={email}>
            <span className="text-fg font-medium">{email}</span>
            <br />
            {role}
          </div>
          <ThemeToggle label />
          <form action="/api/control/logout" method="post">
            <button className="flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-line/60 hover:text-fg transition">
              <LogOut size={18} />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
