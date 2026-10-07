"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function KeyForm({ carrierCode, hasKey }: { carrierCode: string; hasKey: boolean }) {
  const r = useRouter(); const [t, setT] = useState(""); const [msg, setMsg] = useState("");
  const call = async (method: string, body: object) => { const res = await fetch("/api/control/credentials", { method, headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); setMsg(res.ok ? "Done" : "Failed"); setT(""); r.refresh(); };
  const test = async () => { setMsg("Testing…"); const j = await (await fetch("/api/control/credentials", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ carrierCode }) })).json(); setMsg(j.message ?? "Failed"); };
  return (<div className="mt-3 flex flex-wrap gap-2 items-center"><input type="password" autoComplete="off" value={t} onChange={e => setT(e.target.value)} placeholder={hasKey ? "••••••••••••••••" : "API token"} className="rounded-xl border border-line bg-transparent px-3 py-2 text-sm" />
    <button disabled={t.length < 8} onClick={() => call("POST", { carrierCode, token: t })} className="rounded-xl bg-brand text-bg px-3 py-2 text-sm disabled:opacity-50">{hasKey ? "Update" : "Save"} key</button>
    {hasKey && <button onClick={test} className="rounded-xl border border-line px-3 py-2 text-sm">Test connection</button>}{hasKey && <button onClick={() => call("DELETE", { carrierCode })} className="rounded-xl border border-line px-3 py-2 text-sm">Delete</button>}<span className="text-xs text-muted">{msg}</span></div>);
}
