"use client";
import { useEffect, useState } from "react";
// Hydration-safe date: the server and the first client render both print the same fixed-locale UTC string,
// then the browser swaps in the viewer's own time zone after mount (avoids "4/10/2026 vs 10/4/2026" mismatches).
const OPTS: Intl.DateTimeFormatOptions = { dateStyle: "medium", timeStyle: "short" };
const f = (d: Date, timeZone?: string) => new Intl.DateTimeFormat("en-GB", { ...OPTS, timeZone }).format(d);
export default function LocalTime({ value }: { value: string | number | Date }) {
  const d = new Date(value); const ok = !isNaN(+d);
  const [text, setText] = useState(() => (ok ? `${f(d, "UTC")} UTC` : "—"));
  useEffect(() => { if (ok) setText(f(d)); }, [ok, +d]); // eslint-disable-line react-hooks/exhaustive-deps
  return <time dateTime={ok ? d.toISOString() : undefined} suppressHydrationWarning>{text}</time>;
}
