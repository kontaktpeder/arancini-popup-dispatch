import { createFileRoute } from "@tanstack/react-router";
import {
  authenticateDemoKey,
  requireScope,
  withContract,
} from "@/lib/module-contract.server";

export const Route = createFileRoute("/api/public/v1/module/widgets")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const auth = authenticateDemoKey(request);
        if ("error" in auth) return auth.error;
        const scopeErr = requireScope(auth.client, "platform:read");
        if (scopeErr) return scopeErr;

        return Response.json(
          withContract({
            widgets: [
              {
                id: "frozen_on_hand",
                value: null,
                display: "—",
                deep_link: "supplier_home",
                placeholder: true,
              },
              {
                id: "thawed_on_hand",
                value: null,
                display: "—",
                deep_link: "venue_home",
                placeholder: true,
              },
              {
                id: "week_sold",
                value: null,
                display: "—",
                deep_link: "supplier_home",
                placeholder: true,
              },
              {
                id: "open_deviations",
                value: null,
                display: "—",
                deep_link: "supplier_home",
                placeholder: true,
              },
            ],
          }),
        );
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
