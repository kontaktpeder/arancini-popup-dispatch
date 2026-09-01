import { createFileRoute } from "@tanstack/react-router";
import { BrandHome } from "@/components/brand-home";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  component: IndexEn,
});

function IndexEn() {
  return (
    <main>
      <BrandHome lang="en" />
    </main>
  );
}
