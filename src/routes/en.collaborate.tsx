import { createFileRoute } from "@tanstack/react-router";
import { CollaborationInquiry } from "@/components/collaboration-inquiry";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/collaborate")({
  head: () => buildPageHead(PAGE_SEO["/en/collaborate"]),
  component: CollaborateEn,
});

function CollaborateEn() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <BrandNav lang="en" />
      <main className="flex-1">
        <CollaborationInquiry lang="en" />
      </main>
      <BrandFooter lang="en" />
    </div>
  );
}
