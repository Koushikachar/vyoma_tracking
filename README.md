# VYOMA ROUTE — core tracking engine (first build)
One Tracking ID. Every Journey.

## Included
- Carrier adapter interface, registry, auto-detection with confidence threshold
- VYOMA Test Carrier simulator (all 14 test IDs, no API key)
- Normalization to the 11 VYOMA statuses, raw status preserved
- `GET /api/v1/track/[trackingId]?carrier=` with Zod validation, safe errors, rate limiting, request IDs, hashed-ID logging
- Prisma schema (Supabase Postgres) for shipments, events, lookups, admin, API keys, webhooks, audit logs, contact

## Setup
npm install && npx prisma generate && npm run dev
(Scaffold the Next.js shell first: `npx create-next-app@latest` with App Router + TS + Tailwind, then copy these folders in and set the `@/` alias.)

## Not built yet
Notification providers + preference UI (architecture only), Settings extras (email provider test), carrier-specific adapters beyond Delhivery/17TRACK, merchant dashboard.

## Admin bootstrap
npx prisma migrate dev; npm run create-admin -- you@example.com "LongPassword12+" ; npm run seed
Open /control/<ADMIN_ROUTE_SECRET>/login
Delhivery / 17TRACK are intentionally NOT implemented, so nothing falsely claims to be live.

## Supabase + Prisma (exact values)
Supabase dashboard -> Connect. In `.env`:
- DATABASE_URL = the **pooled** string (port 6543) + `?pgbouncer=true&connection_limit=1`
- DIRECT_URL = the **direct/session** string (port 5432), used by migrations
Then: `npm run doctor -- --gen` (paste values into .env), `npx prisma migrate dev --name init`, `npm run create-admin -- you@x.com "LongPassword12+"`, `npm run seed`, `npm run doctor` (must say All checks passed), `npm run build`.
Carrier keys: /control/<ADMIN_ROUTE_SECRET>/integrations -> save key -> Test connection.

## First admin + 2FA
`npm run create-admin -- you@example.com 'LongPassword12+'` prints a **QR code in the terminal**: scan it with your authenticator app, save the recovery codes, then sign in at `/control/<ADMIN_ROUTE_SECRET>/login` (email, password, then the 6-digit code).
Direct adapters (unverified until tested with real keys): Delhivery, 17TRACK, DHL, FedEx, UPS. Blue Dart, DTDC and India Post work through 17TRACK. Add keys in .env or Admin -> Integrations (FedEx/UPS keys as ID:SECRET).
