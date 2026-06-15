import { createFileRoute } from "@tanstack/react-router";
import { CollaborationInquiry } from "@/components/collaboration-inquiry";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/collaborate")({
  head: () => buildPageHead(PAGE_SEO["/en/collaborate"]),
  component: CollaborateEn,
});

function CollaborateEn() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <CollaborationInquiry lang="en" />
      </main>
      <SiteFooter />
    </div>
  );
}
