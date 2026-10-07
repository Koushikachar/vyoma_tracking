"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Search } from "lucide-react";
const schema = z.string().trim().regex(/^[A-Za-z0-9-]{6,40}$/, "INVALID_TRACKING_ID");
const carriers = [["", "Auto Detect"], ["vyoma_test", "VYOMA Test Carrier"], ["delhivery", "Delhivery"], ["dhl", "DHL"], ["fedex", "FedEx"], ["ups", "UPS"], ["track17", "17TRACK (multi-carrier)"]]; // add live carriers here once configured
export default function TrackForm() {
  const r = useRouter(); const [id, setId] = useState(""); const [c, setC] = useState(""); const [err, setErr] = useState("");
  const submit = (e: React.FormEvent) => { e.preventDefault(); const p = schema.safeParse(id);
    if (!p.success) return setErr("Please enter a valid tracking ID (6–40 letters, numbers or dashes).");
    setErr(""); r.push(`/track/${encodeURIComponent(p.data)}${c ? `?carrier=${c}` : ""}`); };
  return (<form onSubmit={submit} id="track" className="w-full max-w-2xl mx-auto">
    <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border border-line bg-card/70 backdrop-blur">
      <input value={id} onChange={e => setId(e.target.value)} aria-label="Tracking ID or AWB" aria-invalid={!!err} placeholder="Enter Tracking ID / AWB"
        className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm outline-none focus-visible:ring-2 ring-brand rounded-lg" />
      <select value={c} onChange={e => setC(e.target.value)} aria-label="Carrier" className="field sm:w-48 sm:shrink-0 px-3 py-2.5">
        {carriers.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      <button className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-brand text-bg text-sm font-semibold px-5 py-2.5"><Search size={16} />Track Shipment</button>
    </div>
    {err && <p role="alert" className="mt-2 text-sm text-red-500">{err}</p>}
    <p className="mt-3 text-xs text-muted text-center">Try VYT-INTRANSIT-1001 or VYT-OUTFORDELIVERY-1001</p>
  </form>);
}
