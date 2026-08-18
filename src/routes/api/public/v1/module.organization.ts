import { createFileRoute } from "@tanstack/react-router";
import { PILOT_ORG } from "@/lib/pilot-core/catalog";
import {
  authenticateDemoKey,
  moduleAppBaseUrl,
  requireScope,
  withContract,
} from "@/lib/module-contract.server";

export const Route = createFileRoute("/api/public/v1/module/organization")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = authenticateDemoKey(request);
        if ("error" in auth) return auth.error;
        const scopeErr = requireScope(auth.client, "platform:read");
        if (scopeErr) return scopeErr;

        const base = moduleAppBaseUrl(request);
        return Response.json(
          withContract({
            organization: {
              id: PILOT_ORG.id,
              name: PILOT_ORG.name,
              slug: PILOT_ORG.slug,
              org_number: null,
              created_at: PILOT_ORG.createdAt,
            },
            deep_links: { org_home: `${base}/pilot` },
          }),
        );
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
