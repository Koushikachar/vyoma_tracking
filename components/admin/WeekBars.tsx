"use client";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "./ChartTip";
export default function WeekBars({ data }: { data: { day: string; lookups: number }[] }) {
  const max = Math.max(...data.map(d => d.lookups), 0); const last = data.length - 1;
  return (<div className="h-60 mt-2" role="img" aria-label="Lookups per day, last 7 days">
    <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 22, right: 8, left: 8, bottom: 0 }} barCategoryGap="28%">
      <defs><linearGradient id="barNow" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--accent))" /><stop offset="100%" stopColor="rgb(var(--brand))" /></linearGradient></defs>
      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(var(--muted))" }} />
      <YAxis hide domain={[0, Math.max(4, max)]} />
      <Tooltip cursor={{ fill: "rgb(var(--line))", fillOpacity: 0.35, radius: 10 }} content={<ChartTip />} />
      <Bar dataKey="lookups" name="Lookups" fill="rgb(var(--brand))" radius={[10, 10, 10, 10]} maxBarSize={44} minPointSize={4} background={{ fill: "rgb(var(--line))", fillOpacity: 0.28, radius: 10 } as any}>
        {data.map((d, i) => <Cell key={i} fill={i === last ? "url(#barNow)" : "rgb(var(--brand))"} fillOpacity={d.lookups === 0 ? 0.18 : i === last ? 1 : 0.55} />)}
        <LabelList dataKey="lookups" position="top" offset={6} formatter={(v: any) => (v ? v : "")} style={{ fontSize: 12, fontWeight: 600, fill: "rgb(var(--fg))" }} />
      </Bar>
    </BarChart></ResponsiveContainer></div>);
}
