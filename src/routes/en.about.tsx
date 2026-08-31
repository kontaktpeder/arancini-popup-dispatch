import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/about-view";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/about")({
  head: () => buildPageHead(PAGE_SEO["/en/about"]),
  component: AboutEn,
});

function AboutEn() {
  return <AboutView lang="en" />;
}
