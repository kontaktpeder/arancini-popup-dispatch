import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead } from "@/lib/seo";
import { getCmsPage } from "@/lib/cms/cms.functions";
import type { WhatIsAranciniContent } from "@/lib/cms/types";

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
  return (
    <ContentPage eyebrow={c.eyebrow} title={c.title}>
      <p>{c.intro_1}</p>

      <p>
        {c.intro_2_before}
        {c.intro_2_emphasis ? <em>{c.intro_2_emphasis}</em> : null}
        {c.intro_2_after}
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        {c.section_1_heading}
      </h2>
      <p>{c.section_1_body}</p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        {c.section_2_heading}
      </h2>
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
        <Link to="/next-popup">{c.cta_label}</Link>
      </p>
    </ContentPage>
  );
}
