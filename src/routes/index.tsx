import { createFileRoute } from "@tanstack/react-router";
import { BrandHome } from "@/components/brand-home";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  component: Index,
});

function Index() {
  return (
    <main>
      <BrandHome lang="no" />
    </main>
  );
}
