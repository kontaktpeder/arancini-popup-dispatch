import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, buildPopupEventJsonLd, PAGE_SEO } from "@/lib/seo";
import { CURRENT_POPUP, SITE } from "@/lib/site";

export const Route = createFileRoute("/next-popup")({
  head: () => ({
    ...buildPageHead(PAGE_SEO["/next-popup"]),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildPopupEventJsonLd()),
      },
    ],
  }),
  component: NextPopupPage,
});

function NextPopupPage() {
  return (
    <ContentPage eyebrow="Neste popup" title="Sicilianske arancini i Oslo — én kveld, én batch">
      <p>
        <strong>{CURRENT_POPUP.dateLabel} · {CURRENT_POPUP.timeLabel}</strong>
        <br />
        {CURRENT_POPUP.addressFull}
      </p>

      <p>
        Vi popper opp med en liten batch håndlagde arancini — ikke en restaurant med fast
        meny, men gatekjøkken fra Sicilia: sprø utenpå, myk inni, fyll som smaker av
        Palermo.
      </p>

      <p className="italic text-muted-foreground">{CURRENT_POPUP.scarcity}</p>

      <section className="mt-4">
        <h2 className="font-display text-2xl tracking-tight md:text-3xl">
          Meny denne kvelden
        </h2>
        <ul className="mt-6 flex flex-col gap-5">
          {CURRENT_POPUP.menu.map((item) => (
            <li key={item.name}>
              <strong className="font-display text-lg">{item.name}</strong>
              <p className="text-foreground/75">{item.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <a
          href={CURRENT_POPUP.mapsUrl}
          target="_blank"
          rel="noreferrer"
        >
          Finn oss på kart →
        </a>
      </p>

      <p>
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          Følg {SITE.name} på Instagram
        </a>{" "}
        for neste drop og live-oppdateringer.
      </p>

      <p>
        <Link to="/what-is-arancini">Ny her? Les hva arancini er →</Link>
      </p>
    </ContentPage>
  );
}
