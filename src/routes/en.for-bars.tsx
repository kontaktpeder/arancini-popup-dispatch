import { createFileRoute } from "@tanstack/react-router";
import { ForBarerLanding } from "@/components/for-barer-landing";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/for-bars")({
  head: () => buildPageHead(PAGE_SEO["/en/for-bars"]),
  component: ForBarsEn,
});

function ForBarsEn() {
  return <ForBarerLanding lang="en" />;
}
