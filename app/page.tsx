import HeroMotion from "@/components/hero/HeroMotion";
import TrackForm from "@/components/tracking/TrackForm";
import Timeline from "@/components/timeline/Timeline";
import { Search, GitMerge, Route as RouteIcon, ShieldCheck } from "lucide-react";
const steps = [[Search, "Enter your ID", "Paste any tracking number or AWB. We detect the carrier, or you pick it."], [GitMerge, "We normalize it", "Each carrier speaks differently. We translate it into one standard status."], [RouteIcon, "See one timeline", "A clean journey from pickup to doorstep, in plain language."]] as const;
const carriers: [string, string, string][] = [["VYOMA Test Carrier", "Test only", "bg-accent/15 text-accent"], ["Delhivery", "Live when a key is added", "bg-brand/15 text-brand"], ["17TRACK", "Live when a key is added", "bg-brand/15 text-brand"],
  ["DHL", "Available through 17TRACK", "bg-line text-muted"], ["Blue Dart", "Available through 17TRACK", "bg-line text-muted"], ["DTDC", "Available through 17TRACK", "bg-line text-muted"], ["India Post", "Available through 17TRACK", "bg-line text-muted"], ["FedEx", "Coming soon", "bg-line text-muted"], ["UPS", "Coming soon", "bg-line text-muted"]];
const demo = [{ status: "ORDER_CREATED", location: "Hyderabad", eventTime: "2026-10-01T09:00:00Z" }, { status: "PICKED_UP", location: "Hyderabad", eventTime: "2026-10-01T15:00:00Z" },
  { status: "IN_TRANSIT", location: "Nagpur", eventTime: "2026-10-02T21:00:00Z" }, { status: "OUT_FOR_DELIVERY", location: "Bengaluru", eventTime: "2026-10-04T08:00:00Z" }];
export default function Home() {
  return (<>
    <section id="hero" className="relative overflow-hidden"><HeroMotion /><div className="aurora" aria-hidden /><div className="grid-bg" aria-hidden />
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" aria-hidden viewBox="0 0 1200 600" preserveAspectRatio="none">
        <path className="route" d="M0 460 C300 330 520 540 800 340 S1100 210 1200 270" fill="none" stroke="rgb(var(--accent))" strokeWidth="2" />
        {[[300, 410], [800, 340], [1100, 245]].map(([x, y]) => <circle className="node" key={x} cx={x} cy={y} r="6" fill="rgb(var(--brand))" />)}</svg>
      <div className="relative mx-auto max-w-4xl px-6 pt-28 pb-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs tracking-widest uppercase text-muted"><ShieldCheck size={14} className="text-accent" />One Tracking ID. Every Journey.</span>
        <h1 data-hero className="mt-8 text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05]">Track Every Shipment.<br /><span className="grad">From One Place.</span></h1>
        <p className="mt-6 text-lg text-muted max-w-xl mx-auto">Track shipments across multiple carriers with one simple tracking experience.</p>
        <div className="mt-10"><TrackForm /></div></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">How VYOMA works</h2>
      <div className="mt-10 grid md:grid-cols-3 gap-5">{steps.map(([I, t, d], n) => <div key={t} className="glass rounded-2xl p-7"><div className="flex items-center gap-3"><span className="grid place-items-center w-10 h-10 rounded-xl bg-brand/15 text-brand"><I size={20} /></span><span className="text-sm text-muted">0{n + 1}</span></div>
        <h3 className="mt-5 font-semibold text-lg">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></div>)}</div></section>
    <section className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-12 items-center"><div><h2 className="text-3xl font-bold">One clear journey</h2><p className="mt-4 text-muted">No carrier jargon. Raw carrier wording stays one click away under “View carrier details”.</p></div>
      <div className="glass rounded-2xl p-8"><div className="text-xs uppercase tracking-widest text-muted mb-6">Sample timeline (illustrative)</div><Timeline events={demo} /></div></section>
    <section className="mx-auto max-w-6xl px-6 py-20"><h2 className="text-3xl font-bold">Carriers</h2><p className="text-muted mt-2">We only label an integration live when it is actually connected.</p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">{carriers.map(([n, s, cls]) => <div key={n} className="glass rounded-xl p-5"><div className="font-semibold">{n}</div><span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs ${cls}`}>{s}</span></div>)}</div></section>
  </>);
}
