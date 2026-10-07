export default function sitemap() { const u = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return ["", "/about", "/privacy", "/terms", "/cookies"].map(p => ({ url: u + p })); }
