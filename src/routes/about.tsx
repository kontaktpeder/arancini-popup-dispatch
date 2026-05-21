import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getCmsPage } from "@/lib/cms/cms.functions";
import type { AboutContent } from "@/lib/cms/types";

export const Route = createFileRoute("/about")({
  loader: () => getCmsPage({ data: "about" }),
  head: ({ loaderData }) => {
    const c = loaderData as AboutContent | undefined;
    return buildPageHead({
      title: c?.seo_title,
      description: c?.seo_description,
      path: "/about",
    });
  },
  component: AboutPage,
});

function AboutPage() {
  const c = Route.useLoaderData() as AboutContent;
  return (
    <ContentPage eyebrow={c.eyebrow} title={c.title}>
      <p>{c.intro_1}</p>
      <p>{c.intro_2}</p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        {c.section_1_heading}
      </h2>
      <p>{c.section_1_body}</p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        {c.section_2_heading}
      </h2>
      <p>{c.section_2_body}</p>

      <p>
        <Link to="/next-popup">{c.cta_popup_label}</Link>
        {" · "}
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          {c.cta_instagram_label}
        </a>
      </p>
    </ContentPage>
  );
}
