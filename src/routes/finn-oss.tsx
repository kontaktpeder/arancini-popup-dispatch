import { createFileRoute } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { VenuesMap } from "@/components/venues-map";
import { BRAND } from "@/lib/brand-copy";
import { fetchPublicVenues } from "@/lib/portal-venues";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/finn-oss")({
  head: () => buildPageHead(PAGE_SEO["/finn-oss"]),
  loader: () => fetchPublicVenues("no"),
  component: FinnOssPage,
});

function FinnOssPage() {
  const t = BRAND.no;
  const venues = Route.useLoaderData();
  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang="no" />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="eyebrow">{t.find.title}</p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] tracking-tight">
          {t.find.body}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
          {t.find.pageBody}
        </p>
        <div className="mt-14">
          <VenuesMap venues={venues} title="Kart over Gold of Sicily-steder" />
        </div>
        <div className="mt-10">
          <FindGoldGrid lang="no" venues={venues} />
        </div>
      </main>
      <BrandFooter lang="no" />
    </div>
  );
}
