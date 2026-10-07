"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
  if (usePathname().startsWith("/control")) return null;
  return (
    <footer className="border-t border-line py-10 text-sm text-muted"><div className="mx-auto max-w-6xl px-6 flex flex-wrap justify-between gap-4">
        <div><b className="text-fg">VYOMA ROUTE</b><br />Track shipments anywhere.</div>
        <nav className="flex gap-5"><Link href="/">Home</Link><Link href="/privacy">Privacy Policy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookie Policy</Link></nav>
        <div>© {new Date().getFullYear()} VYOMA ROUTE</div></div></footer>
  );
}
