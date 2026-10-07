"use client";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import ChartTip from "./ChartTip";
export default function DeliveryDonut({ delivered, progress, issues }: { delivered: number; progress: number; issues: number }) {
  const total = delivered + progress + issues; const pct = total ? Math.round((delivered / total) * 100) : 0;
  const rows = [{ name: "Delivered", value: delivered, c: "#10b981" }, { name: "In progress", value: progress, c: "rgb(var(--brand))" }, { name: "Issues", value: issues, c: "#f59e0b" }];
  const shown = rows.filter(r => r.value > 0);
  return (<div className="mt-2">
    <div className="relative mx-auto h-44 w-44" role="img" aria-label={`${pct}% of shipments delivered`}>
      <ResponsiveContainer width="100%" height="100%"><PieChart>
        <Pie data={total ? shown : [{ name: "None", value: 1, c: "rgb(var(--line))" }]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={80} startAngle={90} endAngle={-270} paddingAngle={shown.length > 1 ? 3 : 0} cornerRadius={shown.length > 1 ? 5 : 0} stroke="none">
          {(total ? shown : [{ c: "rgb(var(--line))" }]).map((d: any, i) => <Cell key={i} fill={d.c} />)}</Pie>
        {total > 0 && <Tooltip content={<ChartTip />} />}</PieChart></ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><div className="text-3xl font-bold leading-none">{pct}%</div><div className="mt-1 text-xs text-muted">Delivered</div></div></div>
    <ul className="mt-4 space-y-2 text-sm">{rows.map(r => <li key={r.name} className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full" style={{ background: r.c }} /><span className="text-muted">{r.name}</span>
      <b className="ml-auto">{r.value}</b><span className="w-10 text-right text-xs text-muted">{total ? Math.round((r.value / total) * 100) : 0}%</span></li>)}</ul></div>);
}
