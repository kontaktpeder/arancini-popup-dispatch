import { createFileRoute } from "@tanstack/react-router";
import { AboutView } from "@/components/about-view";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => buildPageHead(PAGE_SEO["/about"]),
  component: AboutPage,
});

function AboutPage() {
  return <AboutView lang="no" />;
}
