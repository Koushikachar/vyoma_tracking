"use client";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import ChartTip from "./ChartTip";
const C = ["rgb(var(--brand))", "rgb(var(--accent))", "#a78bfa", "#10b981", "#f59e0b", "#f97316", "#ef4444", "#f472b6", "#94a3b8", "#64748b", "#14b8a6"];
export default function StatusChart({ data }: { data: { name: string; value: number }[] }) {
  if (!data.length) return <p className="text-muted text-sm">No shipments yet. Run <code>npm run seed</code> or track one.</p>;
  return (<div className="grid md:grid-cols-2 gap-6 h-72" role="img" aria-label="Shipments by status">
    <ResponsiveContainer><BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}><XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(var(--muted))" }} /><YAxis type="category" dataKey="name" width={140} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "rgb(var(--muted))" }} /><Tooltip cursor={{ fill: "rgb(var(--line))", fillOpacity: 0.35 }} content={<ChartTip />} /><Bar dataKey="value" name="Shipments" radius={6} maxBarSize={22}>{data.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}</Bar></BarChart></ResponsiveContainer>
    <ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={2} cornerRadius={4} stroke="none">{data.map((_, i) => <Cell key={i} fill={C[i % C.length]} />)}</Pie><Tooltip content={<ChartTip />} /></PieChart></ResponsiveContainer></div>);
}
