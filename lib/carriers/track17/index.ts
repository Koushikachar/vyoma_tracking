import { getCred } from "../credentials";
import { CarrierAdapter, TrackingError, VyomaStatus, NormalizedEvent } from "../types";
// UNVERIFIED against a live account: written to 17TRACK's documented v2.2 API (POST /register, POST /gettrackinfo, header "17token").
// Check response shapes, stage names and error codes with a real key before relying on it. Registering a number may consume quota.
const BASE = "https://api.17track.net/track/v2.2"; // fixed host: no admin-supplied URL
const STAGE: Record<string, VyomaStatus> = { InfoReceived: "ORDER_CREATED", PickedUp: "PICKED_UP", Departure: "IN_TRANSIT", Arrival: "IN_TRANSIT", InTransit: "IN_TRANSIT",
  AvailableForPickup: "AT_DESTINATION_HUB", OutForDelivery: "OUT_FOR_DELIVERY", Delivered: "DELIVERED", DeliveryFailure: "DELIVERY_ATTEMPTED", Returning: "RTO", Returned: "RETURNED", Exception: "EXCEPTION", Expired: "EXCEPTION" };
const map = (s?: string): VyomaStatus => (s && STAGE[s]) || "UNKNOWN";
async function call(path: string, number: string) {
  let res: Response;
  try { res = await fetch(`${BASE}/${path}`, { method: "POST", headers: { "17token": getCred("track17")!.token, "content-type": "application/json" }, body: JSON.stringify([{ number }]), signal: AbortSignal.timeout(8000), cache: "no-store" }); }
  catch { throw new TrackingError("PROVIDER_UNAVAILABLE", 504, "timeout/network"); }
  if (res.status === 429) throw new TrackingError("RATE_LIMITED", 429, "carrier 429");
  if (!res.ok) throw new TrackingError("PROVIDER_UNAVAILABLE", 503, `HTTP ${res.status}`);
  const j = await res.json().catch(() => null);
  if (!j || j.code !== 0) throw new TrackingError("PROVIDER_UNAVAILABLE", 503, `api code ${j?.code}`); // auth/quota problems stay internal
  return j.data as { accepted?: any[]; rejected?: any[] };
}
const place = (a: any) => [a?.city, a?.country].filter(Boolean).join(", ") || undefined;
export const track17: CarrierAdapter = {
  code: "track17", name: "17TRACK",
  isConfigured: () => !!getCred("track17")?.token,
  async detect() { return { carrier: "track17", confidence: 0.2 }; }, // never auto-assumed: user must choose 17TRACK explicitly
  async fetchTracking(id) {
    const t0 = Date.now(); let d = await call("gettrackinfo", id);
    if (!d.accepted?.length && d.rejected?.length) { await call("register", id); d = await call("gettrackinfo", id); } // first lookup of a number needs registration
    const item = d.accepted?.[0]; if (!item?.track_info) throw new TrackingError("SHIPMENT_NOT_FOUND", 404);
    return { carrier: "track17", payload: item, latencyMs: Date.now() - t0 };
  },
  normalize(raw, trackingId) {
    const ti = (raw.payload as any).track_info;
    const events: NormalizedEvent[] = (ti.tracking?.providers ?? []).flatMap((p: any) => (p.events ?? []).map((e: any) => ({
      eventTime: new Date(e.time_iso ?? e.time_utc).toISOString(), status: map(e.stage), rawStatus: String(e.stage ?? e.sub_status ?? ""), description: e.description, location: e.location, source: "track17" })))
      .sort((a: NormalizedEvent, b: NormalizedEvent) => +new Date(a.eventTime) - +new Date(b.eventTime));
    const ls = ti.latest_status ?? {}; const last = events.at(-1);
    return { trackingId, carrier: { code: "track17", name: "17TRACK" }, currentStatus: map(ls.status) !== "UNKNOWN" ? map(ls.status) : last?.status ?? "UNKNOWN",
      currentStatusRaw: [ls.status, ls.sub_status].filter(Boolean).join(" / "), lastUpdatedAt: new Date(ti.latest_event?.time_iso ?? last?.eventTime ?? Date.now()).toISOString(),
      estimatedDeliveryAt: ti.time_metrics?.estimated_delivery_date?.from ? new Date(ti.time_metrics.estimated_delivery_date.from).toISOString() : undefined,
      origin: place(ti.shipping_info?.shipper_address), destination: place(ti.shipping_info?.recipient_address), events };
  },
  async healthCheck() { return getCred("track17") ? { status: "HEALTHY" as const } : { status: "NOT_CONFIGURED" as const }; },
};
