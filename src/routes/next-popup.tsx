import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, buildPopupEventJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { getCmsPage } from "@/lib/cms/cms.functions";
import type { NextPopupContent } from "@/lib/cms/types";

export const Route = createFileRoute("/next-popup")({
  loader: () => getCmsPage({ data: "next-popup" }),
  head: ({ loaderData }) => {
    const c = loaderData as NextPopupContent | undefined;
    return {
      ...buildPageHead({
        title: c?.seo_title,
        description: c?.seo_description,
        path: "/next-popup",
      }),
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(buildPopupEventJsonLd()),
        },
      ],
    };
  },
  component: NextPopupPage,
});

function NextPopupPage() {
  const c = Route.useLoaderData() as NextPopupContent;
  return (
    <ContentPage eyebrow={c.eyebrow} title={c.title}>
      <p>
        <strong>
          {c.date_label} · {c.time_label}
        </strong>
        <br />
        {c.address_full}
      </p>

      <p>{c.intro_body}</p>

      <p className="italic text-muted-foreground">{c.scarcity}</p>

      {c.menu.length > 0 ? (
        <section className="mt-4">
          <h2 className="font-display text-2xl tracking-tight md:text-3xl">
            {c.menu_heading}
          </h2>
          <ul className="mt-6 flex flex-col gap-5">
            {c.menu.map((item, i) => (
              <li key={`${item.name}-${i}`}>
                <strong className="font-display text-lg">{item.name}</strong>
                <p className="text-foreground/75">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p>
        <a href={c.maps_url} target="_blank" rel="noreferrer">
          {c.cta_maps_label}
        </a>
      </p>

      <p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          {c.cta_instagram_label}
        </a>
      </p>

      <p>
        <Link to="/what-is-arancini">{c.cta_what_is_label}</Link>
      </p>
    </ContentPage>
  );
}
