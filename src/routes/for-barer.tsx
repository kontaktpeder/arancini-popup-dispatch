import { createFileRoute } from "@tanstack/react-router";
import { ForBarerLanding } from "@/components/for-barer-landing";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/for-barer")({
  head: () => buildPageHead(PAGE_SEO["/for-barer"]),
  component: ForBarerLanding,
});
