import { createFileRoute } from "@tanstack/react-router";
import { MODULE_NAME, MODULE_SLUG, MODULE_VERSION, withContract } from "@/lib/module-contract.server";

export const Route = createFileRoute("/api/public/v1/module/health")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          withContract({
            status: "ok",
            module_slug: MODULE_SLUG,
            module_name: MODULE_NAME,
            app_version: MODULE_VERSION,
            timestamp: new Date().toISOString(),
          }),
        ),
      OPTIONS: async () => new Response(null, { status: 204 }),
    },
  },
});
