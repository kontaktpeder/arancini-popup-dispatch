import { createFileRoute } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { BRAND } from "@/lib/brand-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en/find-us")({
  head: () => buildPageHead(PAGE_SEO["/en/find-us"]),
  component: FindUsEn,
});

function FindUsEn() {
  const t = BRAND.en;
  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <BrandNav lang="en" />
      <main className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
          {t.find.title}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] tracking-tight">
          {t.find.body}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/70">
          {t.find.pageBody}
        </p>
        <div className="mt-14">
          <FindGoldGrid lang="en" />
        </div>
      </main>
      <BrandFooter lang="en" />
    </div>
  );
}
