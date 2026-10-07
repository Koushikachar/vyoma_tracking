import { z } from "zod";
import { createHash } from "crypto";
import { listAdapters, getAdapter } from "../carriers/registry";
import { loadCredentials } from "../carriers/credentials";
import { getSettings } from "../settings";
import { loadCached } from "./persist";
import { TrackingError, NormalizedShipment } from "../carriers/types";

export const trackingIdSchema = z.string().trim().regex(/^[A-Za-z0-9-]{6,40}$/);
export const hashId = (id: string) => createHash("sha256").update(id).digest("hex").slice(0, 16);
const CONFIDENCE_MIN = 0.6;
export type TrackMeta = { cached: boolean; stale: boolean; lastCarrierSyncAt: string };

export async function track(rawId: string, carrierCode?: string, opts: { refresh?: boolean } = {}) {
  const parsed = trackingIdSchema.safeParse(rawId);
  if (!parsed.success) throw new TrackingError("INVALID_TRACKING_ID", 400);
  const id = parsed.data; await loadCredentials();
  const cfg = await getSettings(); if (cfg.maintenanceMode) throw new TrackingError("PROVIDER_UNAVAILABLE", 503, "maintenance");

  let adapter, confidence = 1;
  if (carrierCode) { adapter = getAdapter(carrierCode); if (!adapter) throw new TrackingError("UNSUPPORTED_CARRIER", 400); }
  else {
    const scored = await Promise.all(listAdapters().filter(a => a.isConfigured()).map(async a => ({ a, ...(await a.detect(id)) })));
    scored.sort((x, y) => y.confidence - x.confidence);
    if (!scored[0] || scored[0].confidence < CONFIDENCE_MIN) throw new TrackingError("CARRIER_REQUIRED", 422);
    adapter = scored[0].a; confidence = scored[0].confidence;
  }
  const ttl = cfg.cacheSeconds * 1000;
  if (!opts.refresh) { // fresh cache hit: no carrier API call
    const c = await loadCached(adapter.code, id, ttl);
    if (c) return { shipment: c.shipment, confidence, latencyMs: 0, carrierCode: adapter.code, live: false, meta: { cached: true, stale: false, lastCarrierSyncAt: c.syncedAt } as TrackMeta };
  }
  try {
    const raw = await Promise.race([adapter.fetchTracking(id),
      new Promise<never>((_, rej) => setTimeout(() => rej(new TrackingError("PROVIDER_UNAVAILABLE", 504, "timeout")), 8000))]);
    let shipment: NormalizedShipment;
    try { shipment = adapter.normalize(raw, id); } catch { throw new TrackingError("INTERNAL_ERROR", 500, "normalization failed"); }
    return { shipment, confidence, latencyMs: raw.latencyMs, carrierCode: adapter.code, live: true, meta: { cached: false, stale: false, lastCarrierSyncAt: new Date().toISOString() } as TrackMeta };
  } catch (e) {
    if (e instanceof TrackingError && e.code === "PROVIDER_UNAVAILABLE") { // serve last known data, clearly flagged stale
      const s = await loadCached(adapter.code, id, Infinity);
      if (s) return { shipment: s.shipment, confidence, latencyMs: 0, carrierCode: adapter.code, live: false, meta: { cached: true, stale: true, lastCarrierSyncAt: s.syncedAt } as TrackMeta };
    }
    throw e;
  }
}
