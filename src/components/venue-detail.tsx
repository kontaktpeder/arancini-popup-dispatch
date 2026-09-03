import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { VenuesMap } from "@/components/venues-map";
import { mapsUrl, type PublicVenue } from "@/lib/portal-venues";

export function VenueDetail({ lang, venue }: { lang: "no" | "en"; venue: PublicVenue }) {
  const findPath = lang === "en" ? "/en/find-us" : "/finn-oss";
  const serveLabel = lang === "en" ? "Serves" : "Serverer";
  const backLabel = lang === "en" ? "Find us" : "Finn oss";
  const websiteLabel = lang === "en" ? "Website" : "Nettside";
  const mapLabel = lang === "en" ? "Map" : "Kart";

  return (
    <div className="min-h-screen bg-[color:var(--cream)] font-display">
      <BrandNav lang={lang} />
      <main className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
        <Link to={findPath} className="text-sm italic underline-offset-4 hover:underline">
          ← {backLabel}
        </Link>
        <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,4.6rem)] leading-[0.95] tracking-tight">
          {venue.name}
        </h1>
        <p className="mt-4 text-lg italic text-foreground/60">
          {[venue.address, venue.city].filter(Boolean).join(", ")}
        </p>
        {venue.imageUrl ? (
          <img
            src={venue.imageUrl}
            alt=""
            className="mt-10 w-full border border-foreground/15 object-cover"
          />
        ) : null}
        <div className="mt-10">
          <VenuesMap venues={[venue]} title={mapLabel} />
        </div>
        {venue.menuIntro ? (
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-foreground/75">
            {venue.menuIntro}
          </p>
        ) : null}
        <h2 className="mt-12 font-display text-3xl tracking-tight">{serveLabel}</h2>
        {venue.menu.length === 0 ? (
          <p className="mt-4 text-foreground/70">
            {lang === "en" ? "Menu coming soon." : "Meny kommer."}
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-foreground/15 border-y border-foreground/15">
            {venue.menu.map((item) => (
              <li key={item.productSlug} className="flex items-baseline justify-between gap-4 py-4">
                <div>
                  <p className="font-display text-xl">{item.name}</p>
                  {item.description ? (
                    <p className="mt-1 text-sm text-foreground/60">{item.description}</p>
                  ) : null}
                </div>
                {item.priceLabel ? <p className="tabular-nums">{item.priceLabel}</p> : null}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          {venue.websiteUrl ? (
            <a
              href={venue.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="italic underline-offset-4 hover:underline"
            >
              {websiteLabel}
            </a>
          ) : null}
          {venue.instagram ? (
            <a
              href={
                venue.instagram.startsWith("http")
                  ? venue.instagram
                  : `https://www.instagram.com/${venue.instagram.replace(/^@/, "")}/`
              }
              target="_blank"
              rel="noreferrer"
              className="italic underline-offset-4 hover:underline"
            >
              Instagram
            </a>
          ) : null}
          <a
            href={mapsUrl(venue)}
            target="_blank"
            rel="noreferrer"
            className="italic underline-offset-4 hover:underline"
          >
            {mapLabel}
          </a>
        </div>
      </main>
      <BrandFooter lang={lang} />
    </div>
  );
}
