"use client";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "./ChartTip";
const BAD = "#ef4444";
export default function LookupsChart({ data }: { data: { label: string; lookups: number; failures: number }[] }) {
  if (!data.length || data.every(d => !d.lookups)) return <div className="grid h-48 place-items-center rounded-2xl border border-dashed border-line text-sm text-muted">No lookups in this period yet.</div>;
  const total = data.reduce((a, d) => a + d.lookups, 0), fails = data.reduce((a, d) => a + d.failures, 0);
  return (<div>
    <div className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
      <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-brand" />Lookups <b className="text-fg">{total}</b></span>
      <span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: BAD }} />Failures <b className="text-fg">{fails}</b></span></div>
    <div className="h-64" role="img" aria-label="Lookups and failures over time"><ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <defs><linearGradient id="gLook" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--brand))" stopOpacity={0.35} /><stop offset="100%" stopColor="rgb(var(--brand))" stopOpacity={0} /></linearGradient>
          <linearGradient id="gFail" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BAD} stopOpacity={0.25} /><stop offset="100%" stopColor={BAD} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="rgb(var(--line))" />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tickMargin={10} minTickGap={28} tick={{ fontSize: 12, fill: "rgb(var(--muted))" }} />
        <YAxis allowDecimals={false} axisLine={false} tickLine={false} width={44} tick={{ fontSize: 12, fill: "rgb(var(--muted))" }} />
        <Tooltip content={<ChartTip />} cursor={{ stroke: "rgb(var(--muted))", strokeOpacity: 0.4, strokeDasharray: "4 4" }} />
        <Area type="monotone" dataKey="lookups" name="Lookups" stroke="rgb(var(--brand))" strokeWidth={2.5} fill="url(#gLook)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "rgb(var(--card))" }} />
        <Area type="monotone" dataKey="failures" name="Failures" stroke={BAD} strokeWidth={2} fill="url(#gFail)" dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "rgb(var(--card))" }} />
      </AreaChart></ResponsiveContainer></div></div>);
}
