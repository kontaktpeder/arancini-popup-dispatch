import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { CMS_DEFAULTS_EN } from "@/lib/cms/defaults-en";

export const Route = createFileRoute("/en/about")({
  head: () => buildPageHead(PAGE_SEO["/en/about"]),
  component: AboutEn,
});

function AboutEn() {
  const c = CMS_DEFAULTS_EN.about;
  return (
    <ContentPage lang="en" eyebrow={c.eyebrow} title={c.title}>
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
        <Link to="/en/next-popup">{c.cta_popup_label}</Link>
        {" · "}
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          {c.cta_instagram_label}
        </a>
      </p>
    </ContentPage>
  );
}
