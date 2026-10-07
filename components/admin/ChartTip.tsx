"use client";
// Shared tooltip so every chart is readable in both light and dark mode.
export default function ChartTip({ active, payload, label, unit = "" }: any) {
  if (!active || !payload?.length) return null;
  return (<div className="rounded-xl border border-line bg-card px-3 py-2 text-xs shadow-xl">
    {label !== undefined && <div className="mb-1 font-semibold text-fg">{label}</div>}
    {payload.map((p: any) => <div key={p.dataKey ?? p.name} className="flex items-center gap-2 text-muted"><i className="inline-block h-2 w-2 rounded-full" style={{ background: p.payload?.c ?? p.color ?? p.stroke ?? p.fill }} /><span>{p.name ?? p.dataKey}</span><b className="ml-auto pl-4 text-fg">{p.value}{unit}</b></div>)}
  </div>);
}
