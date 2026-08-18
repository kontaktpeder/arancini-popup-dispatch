# Module Contract v1 — Pilot Core Compliance

Pilot Core implements Platform Module Contract v1.
Spec (frozen): `platform-nexus/docs/MODULE_CONTRACT.v1.md`

- contract_version: 1.0
- module_slug: `pilot`
- key prefix: `gos_live_`
- module_name: Pilot Core
- app_version: 0.1.0

Pilot Core is the system of record for frozen arancini operations (thaw, sales, waste, inventory, weekly observations, deviations). Domain data lives in the core — Platform Nexus only glances via widgets and deep links.

## Endpoints

| Endpoint | Method | Scope |
|----------|--------|-------|
| /api/public/v1/module/health | GET | — |
| /api/public/v1/module/info | GET | — |
| /api/public/v1/module/organization | GET | platform:read |
| /api/public/v1/module/organization/{org_id} | GET | platform:verify |
| /api/public/v1/module/widgets?ids=... | GET | platform:read |

Wrong `org_id` on verify → **404** (not 403).

## Demo verify key (v0)

Until org-scoped `api_clients` land in this module's own Supabase:

- Key: `gos_live_demo`
- Scopes: `platform:read` + `platform:verify`
- Org: `7e2c1a90-4b6d-4f11-9c3a-0f8e2d4b91a6` (Oslo Bar og Bowling pilot)

## Widgets

Live values are `placeholder: true` until the domain store is server-backed. Register:

| id | title | deep_link |
|----|-------|-----------|
| frozen_on_hand | På fryselager | supplier_home |
| thawed_on_hand | Tint beholdning | venue_home |
| week_sold | Solgt denne uken | supplier_home |
| open_deviations | Åpne avvik | supplier_home |

## Deep links

| key | path |
|-----|------|
| org_home | `/pilot` |
| venue_home | `/pilot` |
| supplier_home | `/pilot/leverandor` |

## Subject scope

`organization` — one venue / company tenant per org. First org is the Oslo Bar og Bowling pilot.
