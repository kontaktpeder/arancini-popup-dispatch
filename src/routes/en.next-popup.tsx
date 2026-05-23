import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, buildPopupEventJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/en/next-popup")({
  head: () => ({
    ...buildPageHead({
      title: "Next popup — Gold of Sicily",
      description:
        "Next arancini batch in Oslo: Tuesday May 26, 2026, 18–20 at Sigurds gate 7. Limited menu — when the batch is gone, it's gone.",
      path: "/en/next-popup",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildPopupEventJsonLd()),
      },
    ],
  }),
  component: NextPopupEn,
});

function NextPopupEn() {
  return (
    <ContentPage
      lang="en"
      eyebrow="Next popup"
      title="Sicilian arancini in Oslo — one night, one batch"
    >
      <p>
        <strong>Tuesday May 26, 2026 · 18–20</strong>
        <br />
        Sigurds gate 7, Oslo
      </p>

      <p>
        We pop up with a small batch of handmade arancini — not a restaurant
        with a fixed menu, but street food from Sicily: crisp outside, soft
        inside, filling that tastes of Palermo.
      </p>

      <p className="italic text-muted-foreground">
        When the batch is gone, it&apos;s gone.
      </p>

      <section className="mt-4">
        <h2 className="font-display text-2xl tracking-tight md:text-3xl">
          Menu this night
        </h2>
        <ul className="mt-6 flex flex-col gap-5">
          <li>
            <strong className="font-display text-lg">Classico</strong>
            <p className="text-foreground/75">
              Ragu, peas and pecorino — the one you know from Palermo.
            </p>
          </li>
          <li>
            <strong className="font-display text-lg">Bianco</strong>
            <p className="text-foreground/75">
              Lemon, mozzarella and herbs — bright and fresh inside, crisp
              outside.
            </p>
          </li>
          <li>
            <strong className="font-display text-lg">Nordic twist</strong>
            <p className="text-foreground/75">
              Seasonal filling — ask what&apos;s in tonight&apos;s batch.
            </p>
          </li>
        </ul>
      </section>

      <p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Sigurds+gate+7%2C+Oslo"
          target="_blank"
          rel="noreferrer"
        >
          Find us on the map →
        </a>
      </p>

      <p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          Follow us on Instagram
        </a>
      </p>

      <p>
        <Link to="/en/what-is-arancini">
          New here? Read what arancini is →
        </Link>
      </p>
    </ContentPage>
  );
}
