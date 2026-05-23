import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead } from "@/lib/seo";

export const Route = createFileRoute("/en/what-is-arancini")({
  head: () =>
    buildPageHead({
      title: "What is arancini? — Gold of Sicily",
      description:
        "Sicilian rice balls with a crisp shell and filling from Palermo. How Gold of Sicily makes handmade arancini in Oslo — popup streetfood in small batches.",
      path: "/en/what-is-arancini",
    }),
  component: WhatIsAranciniEn,
});

function WhatIsAranciniEn() {
  return (
    <ContentPage lang="en" eyebrow="Guide" title="What is arancini?">
      <p>
        Arancini are Sicilian rice balls: rice shaped around a filling, breaded
        and fried until the shell is crisp. Inside it should be soft, savoury
        and a little &laquo;wet&raquo; in the good way — like in the streets of
        Palermo, not like frozen snacks.
      </p>

      <p>
        The name comes from <em>arancina</em> — little orange — because the
        classic round ones can look like an orange. In eastern Sicily they are
        often pointed; in Oslo you meet both traditions through craft, not
        factory.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Arancini in Oslo
      </h2>
      <p>
        People search for &laquo;arancini oslo&raquo;, &laquo;sicilian rice
        balls&raquo; and &laquo;what is arancini&raquo; because they have
        tasted it somewhere — or almost. Gold of Sicily is a popup concept:
        small batches, a clear menu per night, and quality before volume.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        How we make them
      </h2>
      <p>
        Rice that gets time, fillings with ragu, cheese or season, breading
        that handles heat without turning greasy — and serving while there is
        still weight and juice inside. It&apos;s street food, not corporate
        restaurant SEO.
      </p>

      <p>
        <Link to="/en/next-popup">See the next popup →</Link>
      </p>
    </ContentPage>
  );
}
