import { createFileRoute } from "@tanstack/react-router";
import { CollaborationInquiry } from "@/components/collaboration-inquiry";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { DISCOVERY_NO } from "@/lib/discovery-copy";

export const Route = createFileRoute("/samarbeid")({
  head: () => buildPageHead(PAGE_SEO["/samarbeid"]),
  component: SamarbeidPage,
});

function SamarbeidPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <CollaborationInquiry lang="no" />
      </main>
      <SiteFooter copy={DISCOVERY_NO.footer} />
    </div>
  );
}
