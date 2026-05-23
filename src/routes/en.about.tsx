import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/en/about")({
  head: () =>
    buildPageHead({
      title: "About Gold of Sicily",
      description:
        "Popup streetfood from Sicily to Oslo. Why Gold of Sicily started, small batches, and arancini culture — without corporate fluff.",
      path: "/en/about",
    }),
  component: AboutEn,
});

function AboutEn() {
  return (
    <ContentPage lang="en" eyebrow="About" title="Sicily, in small batches">
      <p>
        Gold of Sicily started with a simple question: why aren&apos;t there
        real, Sicilian arancini as street food in Oslo — crisp, soft, with
        fillings that actually taste of something — without turning into an
        &laquo;Italian restaurant&raquo; experience?
      </p>
      <p>
        We are popup and street food: Dennis and the team bake batches when
        there is a date and a place, not every day all year round. That means
        you get what&apos;s fresh that night — and when the batch is gone,
        it&apos;s gone.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Sicily, not corporate
      </h2>
      <p>
        The inspiration comes from Palermo — the sound of frying, paper, people
        eating standing up. We don&apos;t want to write &laquo;we are
        passionate about food&raquo;. We want to serve arancini that feel real,
        physical and a little raw on the edges — like fashion meeting street
        food.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Small batches
      </h2>
      <p>
        Smaller batches mean better control of rice, filling and crisp. It is
        also why this was missing: it doesn&apos;t scale like a chain, but it
        tastes better.
      </p>

      <p>
        <Link to="/en/next-popup">Next popup →</Link>
        {" · "}
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </ContentPage>
  );
}
