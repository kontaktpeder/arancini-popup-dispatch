import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CMS_DEFAULTS_EN } from "@/lib/cms/defaults-en";
import { BRAND } from "@/lib/brand-copy";
import drawBite from "@/assets/brand/draw-arancini-bite.webp";

export const Route = createFileRoute("/en/what-is-arancini")({
  head: () => buildPageHead(PAGE_SEO["/en/what-is-arancini"]),
  component: WhatIsAranciniEn,
});

function WhatIsAranciniEn() {
  const c = CMS_DEFAULTS_EN["what-is-arancini"];
  const osloBody = /søker|search for/i.test(c.section_1_body)
    ? BRAND.en.aranciniPage.seoGuard
    : c.section_1_body;

  return (
    <ContentPage lang="en" eyebrow={c.eyebrow} title={c.title}>
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
        <Link to="/en/find-us">{BRAND.en.find.more} →</Link>
      </p>
    </ContentPage>
  );
}
