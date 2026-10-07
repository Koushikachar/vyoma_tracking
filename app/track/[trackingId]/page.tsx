import Link from "next/link";
import LocalTime from "@/components/LocalTime";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { track, hashId } from "@/lib/tracking/service";
import { rateLimit } from "@/lib/tracking/rate-limit";
import { saveShipment } from "@/lib/tracking/persist";
import { TrackingError, SAFE_MESSAGES } from "@/lib/carriers/types";
import Timeline from "@/components/timeline/Timeline";
export const metadata: Metadata = { title: "Track shipment | VYOMA ROUTE", robots: { index: false } };
export const dynamic = "force-dynamic";
const label = (s: string) => s.replace(/_/g, " ");
const ago = (iso: string) => { const m = Math.round((Date.now() - +new Date(iso)) / 60000); return m < 1 ? "Live update just now" : m < 60 ? `Last updated ${m} minute${m > 1 ? "s" : ""} ago` : `Last updated ${Math.round(m / 60)} hour(s) ago`; };
export default async function TrackPage({ params, searchParams }: { params: Promise<{ trackingId: string }>; searchParams: Promise<{ carrier?: string; refresh?: string }> }) {
  const { trackingId } = await params; const { carrier, refresh } = await searchParams; const id = decodeURIComponent(trackingId);
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const refreshOk = refresh === "1" && (await rateLimit(`refresh:${ip}:${hashId(id)}`, 3, 300_000)); // same cap as the API
  let data; let code = "";
  try { data = await track(id, carrier, { refresh: refreshOk }); if (data.live) await saveShipment(data.shipment, data.confidence); } catch (e) { code = e instanceof TrackingError ? e.code : "INTERNAL_ERROR"; }
  if (!data) return (<div className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-2xl font-semibold">We couldn’t track that shipment</h1>
    <p className="mt-3 text-muted">{SAFE_MESSAGES[code as keyof typeof SAFE_MESSAGES]}</p><Link href="/#track" className="inline-block mt-6 rounded-lg bg-brand text-bg px-5 py-2 font-semibold">Try another ID</Link></div>);
  const s = data.shipment; const q = new URLSearchParams({ ...(carrier ? { carrier } : {}), refresh: "1" }).toString();
  return (<div className="mx-auto max-w-3xl px-6 py-14">
    <div className="glass rounded-3xl p-8">
      <div className="text-sm text-muted uppercase tracking-widest">{s.carrier.name}</div><div className="font-mono text-lg mt-1">{s.trackingId}</div>
      <div className="mt-4 text-3xl font-bold text-brand">{label(s.currentStatus)}</div>
      <div className="mt-4 grid sm:grid-cols-3 gap-4 text-sm"><div><div className="text-muted">Route</div>{s.origin} → {s.destination}</div>
        <div><div className="text-muted">Estimated delivery</div>{s.estimatedDeliveryAt ? new Date(s.estimatedDeliveryAt).toDateString() : "—"}</div>
        <div><div className="text-muted">Last update</div><LocalTime value={s.lastUpdatedAt} /></div></div>
      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted"><span>{ago(data.meta.lastCarrierSyncAt)}</span>
        <Link href={`/track/${encodeURIComponent(id)}?${q}`} className="rounded-lg border border-line px-3 py-1.5 text-fg">Refresh tracking</Link></div>
      {data.meta.stale && <p role="status" className="mt-3 text-sm text-amber-500">The carrier is temporarily unavailable, so this is the last information we have.</p>}
      {refresh === "1" && !refreshOk && <p className="mt-3 text-sm text-muted">Too many refreshes. Showing saved data; please wait a few minutes.</p>}</div>
    <div className="mt-10"><Timeline events={s.events} /></div>
    <details className="mt-10 text-sm"><summary className="cursor-pointer text-muted">View carrier details</summary><div className="mt-4"><Timeline events={s.events} showRaw /></div></details>
  </div>);
}
