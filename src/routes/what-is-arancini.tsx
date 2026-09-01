import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CMS_DEFAULTS } from "@/lib/cms/defaults";
import { BRAND } from "@/lib/brand-copy";
import drawBite from "@/assets/brand/draw-arancini-bite.webp";

export const Route = createFileRoute("/what-is-arancini")({
  head: () => buildPageHead(PAGE_SEO["/what-is-arancini"]),
  component: WhatIsAranciniPage,
});

function WhatIsAranciniPage() {
  const c = CMS_DEFAULTS["what-is-arancini"];
  const osloBody = /søker|search for/i.test(c.section_1_body)
    ? BRAND.no.aranciniPage.seoGuard
    : c.section_1_body;

  return (
    <ContentPage eyebrow={c.eyebrow} title={c.title}>
      <img src={drawBite} alt="" className="mx-auto mb-4 w-40 md:w-52" />
      <p>{c.intro_1}</p>

      <p>
        {c.intro_2_before}
        {c.intro_2_emphasis ? <em>{c.intro_2_emphasis}</em> : null}
        {c.intro_2_after}
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">{c.section_1_heading}</h2>
      <p>{osloBody}</p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">{c.section_2_heading}</h2>
      <p>{c.section_2_body}</p>

      {c.section_3_heading && c.section_3_body ? (
        <>
          <h2 className="font-display text-2xl tracking-tight md:text-3xl">
            {c.section_3_heading}
          </h2>
          <p>{c.section_3_body}</p>
        </>
      ) : null}

      <p>
        <Link to="/finn-oss">{BRAND.no.find.more} →</Link>
      </p>
    </ContentPage>
  );
}
