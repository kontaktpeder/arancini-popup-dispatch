// Pilot Core — Platform Module Contract v1
// Spec: platform-nexus/docs/MODULE_CONTRACT.v1.md

import { PILOT_ORG, PILOT_ORG_ID } from "@/lib/pilot-core/catalog";

export const MODULE_CONTRACT_VERSION = "1.0" as const;
export const MODULE_SLUG = "pilot";
export const MODULE_NAME = "Pilot Core";
export const MODULE_VERSION = "0.1.0";
export const KEY_PREFIX = "gos_live_";

export const PILOT_ORG_RECORD = {
  id: PILOT_ORG.id,
  name: PILOT_ORG.name,
  slug: PILOT_ORG.slug,
  venue: PILOT_ORG.venueName,
};

export const DEMO_API_KEY = "gos_live_demo";

export const pilotModuleInfo = {
  module_slug: MODULE_SLUG,
  module_name: MODULE_NAME,
  app_version: MODULE_VERSION,
  contract_version: MODULE_CONTRACT_VERSION,
  capabilities: [
    "platform.health",
    "platform.organization.read",
    "platform.organization.verify",
    "inventory.read",
    "thaw.write",
    "sales.write",
    "waste.write",
    "reports.read",
    "deviations.write",
  ],
} as const;

export const pilotDeepLinks = {
  org_home: "/pilot",
  venue_home: "/pilot",
  supplier_home: "/pilot/leverandor",
} as const;

export const pilotWidgets = [
  {
    id: "frozen_on_hand",
    title: "På fryselager",
    description: "Gjenværende frosne enheter hos pilotstedet.",
    deep_link: "supplier_home",
    capabilities_required: ["inventory.read"],
    placeholder: true,
  },
  {
    id: "thawed_on_hand",
    title: "Tint beholdning",
    description: "Tint, ikke solgt.",
    deep_link: "venue_home",
    capabilities_required: ["inventory.read"],
    placeholder: true,
  },
  {
    id: "week_sold",
    title: "Solgt denne uken",
    description: "Solgte enheter i inneværende uke.",
    deep_link: "supplier_home",
    capabilities_required: ["reports.read"],
    placeholder: true,
  },
  {
    id: "open_deviations",
    title: "Åpne avvik",
    description: "Avvik som er varslet til leverandør.",
    deep_link: "supplier_home",
    capabilities_required: ["deviations.write"],
    placeholder: true,
  },
] as const;

export function moduleAppBaseUrl(request: Request): string {
  const envUrl = process.env.PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

export function isUuid(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)
  );
}

export function jsonError(status: number, code: string, message: string): Response {
  return Response.json(
    { contract_version: MODULE_CONTRACT_VERSION, error: { code, message } },
    { status },
  );
}

export function withContract<T extends Record<string, unknown>>(body: T) {
  return { contract_version: MODULE_CONTRACT_VERSION, ...body };
}

export function authenticateDemoKey(request: Request):
  | { error: Response }
  | { client: { organization_id: string; scopes: string[] } } {
  const header = request.headers.get("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token.startsWith(KEY_PREFIX) || token !== DEMO_API_KEY) {
    return { error: jsonError(401, "unauthorized", "Invalid API key") };
  }
  return {
    client: {
      organization_id: PILOT_ORG_ID,
      scopes: ["platform:read", "platform:verify"],
    },
  };
}

export function requireScope(
  client: { scopes: string[] },
  scope: string,
): Response | null {
  if (!client.scopes.includes(scope)) {
    return jsonError(403, "forbidden", `Missing scope ${scope}`);
  }
  return null;
}
