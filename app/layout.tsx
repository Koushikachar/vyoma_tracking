import "./globals.css";
import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";
import Script from "next/script";
import { Lexend } from "next/font/google";
const sans = Lexend({ subsets: ["latin"], variable: "--font-sans", display: "swap" }); // one clean family for everything
const display = sans;
import { headers } from "next/headers";
import SmoothScroll from "@/components/SmoothScroll";
const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: "VYOMA ROUTE | Universal Shipment Tracking",
  description: "Track shipments across multiple carriers with VYOMA ROUTE. Enter your tracking ID and get one clear shipment timeline.",
  openGraph: { title: "VYOMA ROUTE", description: "One Tracking ID. Every Journey.", type: "website" },
  twitter: { card: "summary_large_image" }, alternates: { canonical: "/" },
};
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined; // per-request CSP nonce from middleware
  return (<html lang="en" className={sans.variable} suppressHydrationWarning><body className="min-h-screen flex flex-col" suppressHydrationWarning>
      <Script id="theme-init" nonce={nonce} strategy="beforeInteractive">{themeScript}</Script><SmoothScroll /><Navbar /><main className="flex-1">{children}</main>
      <Footer /></body></html>);
}
