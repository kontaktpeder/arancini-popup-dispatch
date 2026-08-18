import { createFileRoute } from "@tanstack/react-router";
import { PILOT_ORG } from "@/lib/pilot-core/catalog";
import {
  authenticateDemoKey,
  isUuid,
  jsonError,
  moduleAppBaseUrl,
  requireScope,
  withContract,
} from "@/lib/module-contract.server";

export const Route = createFileRoute("/api/public/v1/module/organization/$orgId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const auth = authenticateDemoKey(request);
        if ("error" in auth) return auth.error;
        const scopeErr = requireScope(auth.client, "platform:verify");
        if (scopeErr) return scopeErr;

        const { orgId } = params;
        if (!isUuid(orgId)) {
          return jsonError(400, "invalid_org_id", "org_id must be a UUID");
        }
        if (orgId !== auth.client.organization_id) {
          return jsonError(404, "organization_not_found", "Organization not found");
        }

        const base = moduleAppBaseUrl(request);
        return Response.json(
          withContract({
            verified: true,
            organization: { id: PILOT_ORG.id, name: PILOT_ORG.name },
            deep_links: { org_home: `${base}/pilot` },
          }),
        );
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
