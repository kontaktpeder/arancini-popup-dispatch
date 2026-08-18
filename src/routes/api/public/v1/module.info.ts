import { createFileRoute } from "@tanstack/react-router";
import {
  moduleAppBaseUrl,
  pilotDeepLinks,
  pilotModuleInfo,
  pilotWidgets,
  withContract,
} from "@/lib/module-contract.server";

export const Route = createFileRoute("/api/public/v1/module/info")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const base = moduleAppBaseUrl(request);
        return Response.json(
          withContract({
            module_slug: pilotModuleInfo.module_slug,
            module_name: pilotModuleInfo.module_name,
            app_version: pilotModuleInfo.app_version,
            app_base_url: base,
            capabilities: [...pilotModuleInfo.capabilities],
            deep_links: pilotDeepLinks,
            widgets: [...pilotWidgets],
          }),
        );
      },
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
