import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead } from "@/lib/seo";
import { getCmsPage } from "@/lib/cms/cms.functions";
import { BRAND } from "@/lib/brand-copy";
import type { WhatIsAranciniContent } from "@/lib/cms/types";
import drawBite from "@/assets/brand/draw-arancini-bite.webp";

export const Route = createFileRoute("/what-is-arancini")({
  loader: () => getCmsPage({ data: "what-is-arancini" }),
  head: ({ loaderData }) => {
    const c = loaderData as WhatIsAranciniContent | undefined;
    return buildPageHead({
      title: c?.seo_title,
      description: c?.seo_description,
      path: "/what-is-arancini",
    });
  },
  component: WhatIsAranciniPage,
});

function WhatIsAranciniPage() {
  const c = Route.useLoaderData() as WhatIsAranciniContent;
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
