"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, UserPlus, Lock } from "lucide-react";
const ROLES = ["SUPER_ADMIN", "ADMIN", "SUPPORT", "ANALYST"];
const ABOUT: [string, string][] = [["SUPER_ADMIN", "Everything, including Users and Security."], ["ADMIN", "Shipments, carriers, API keys, webhooks, logs, settings, messages. No Users page."],
  ["SUPPORT", "Shipments and contact messages only."], ["ANALYST", "Read-only analytics and shipments."]];
const card = "rounded-2xl border border-line bg-card/80 p-5";
export default function UsersAdmin({ users, selfId }: { users: { id: string; email: string; role: string }[]; selfId: string }) {
  const r = useRouter(); const [pw, setPw] = useState(""); const [email, setEmail] = useState(""); const [role, setRole] = useState("SUPPORT"); const [msg, setMsg] = useState(""); const [made, setMade] = useState<any>(null); const [qr, setQr] = useState("");
  useEffect(() => { setQr(""); if (!made?.otpauth) return; let live = true; import("qrcode").then(Q => Q.toDataURL(made.otpauth, { width: 192, margin: 1 })).then(u => live && setQr(u)).catch(() => {}); return () => { live = false; }; }, [made]);
  const call = async (b: object) => { setMsg(""); const res = await fetch("/api/control/users", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ current: pw, ...b }) }); const j = await res.json(); if (!j.success) setMsg(j.error?.message ?? "Failed."); else { r.refresh(); return j; } };
  const i = "h-10 px-3";
  return (<div className="space-y-5 max-w-3xl">
    <div className={card}><label htmlFor="cur-pw" className="flex items-center gap-2 text-sm font-medium"><Lock size={15} className="text-brand" />Confirm with your password</label>
      <p className="text-xs text-muted mt-1 mb-3">Required for every change below. Nothing is saved without it.</p>
      <input id="cur-pw" type="password" autoComplete="current-password" placeholder="Your password" className={`${i} w-full max-w-xs`} value={pw} onChange={e => setPw(e.target.value)} /></div>

    <div className={card}><h2 className="font-semibold mb-2">Admins <span className="text-muted font-normal text-sm">({users.length})</span></h2>
      <ul>{users.map(u => <li key={u.id} className="flex flex-wrap items-center gap-3 border-t border-line py-3 first:border-t-0">
        <div className="min-w-0 flex-1 truncate text-sm">{u.email}{u.id === selfId && <span className="ml-2 rounded-full bg-brand/15 px-2 py-0.5 text-xs text-brand">you</span>}</div>
        <select aria-label={`Role for ${u.email}`} disabled={u.id === selfId || !pw} defaultValue={u.role} className={`${i} w-44`} onChange={e => call({ action: "set-role", id: u.id, role: e.target.value })}>{ROLES.map(x => <option key={x}>{x}</option>)}</select>
        {u.id !== selfId ? <button disabled={!pw} aria-label={`Delete ${u.email}`} title="Delete" className="grid h-10 w-10 place-items-center rounded-xl text-red-500 hover:bg-red-500/10 disabled:opacity-40" onClick={() => confirm(`Delete ${u.email}?`) && call({ action: "delete", id: u.id })}><Trash2 size={16} /></button> : <span className="w-10" />}</li>)}</ul></div>

    <div className={card}><h2 className="font-semibold mb-3 flex items-center gap-2"><UserPlus size={16} className="text-brand" />Add admin</h2>
      <div className="flex flex-wrap gap-2"><input className={`${i} flex-1 min-w-[12rem]`} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <select aria-label="Role" className={`${i} w-44`} value={role} onChange={e => setRole(e.target.value)}>{ROLES.map(x => <option key={x}>{x}</option>)}</select>
        <button disabled={!pw || !email} className="h-10 rounded-xl bg-brand text-bg px-5 text-sm font-semibold disabled:opacity-50" onClick={async () => { const j = await call({ action: "create", email, role }); if (j) { setMade(j); setEmail(""); } }}>Create</button></div>
      {!pw && <p className="mt-2 text-xs text-muted">Enter your password above to enable these buttons.</p>}</div>
    {msg && <p role="alert" className="text-sm text-red-500">{msg}</p>}
    {made && <div className="rounded-2xl border border-brand bg-brand/5 p-5 text-sm space-y-2"><p className="font-semibold">New admin created. This is shown once, so hand it over securely.</p><p>Email: {made.email}<br />Temporary password: <code>{made.password}</code></p><div className="flex flex-wrap items-center gap-4"><div className="rounded-xl bg-white p-2">{qr ? <img src={qr} alt="Authenticator QR code" width={160} height={160} /> : <div className="h-40 w-40 animate-pulse rounded bg-slate-200" />}</div>
        <p className="max-w-xs text-muted">Ask the new admin to scan this with Google Authenticator, Authy or 1Password. It is shown once.</p></div>
      <details><summary className="cursor-pointer text-muted">Can't scan? Use the setup link instead</summary><p className="break-all mt-2"><code>{made.otpauth}</code></p></details><p>Recovery codes:</p><p className="font-mono">{made.codes.join("  ")}</p></div>}

    <div className={card}><h2 className="font-semibold mb-3">What each role can do</h2><dl className="grid sm:grid-cols-2 gap-3 text-sm">{ABOUT.map(([k, v]) => <div key={k} className="rounded-xl border border-line p-3"><dt className="font-semibold text-xs tracking-wide text-brand">{k}</dt><dd className="text-muted mt-1">{v}</dd></div>)}</dl></div></div>);
}
