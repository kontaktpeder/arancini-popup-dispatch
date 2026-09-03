import { Link } from "@tanstack/react-router";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import type { PublicVenue } from "@/lib/portal-venues";

export function FindGoldGrid({
  lang,
  compact = false,
  venues,
}: {
  lang: BrandLang;
  compact?: boolean;
  venues: PublicVenue[];
}) {
  const t = BRAND[lang];
  const shown = compact ? venues.slice(0, 5) : venues;

  if (venues.length === 0) {
    return (
      <p className="max-w-xl text-lg leading-relaxed text-foreground/70">
        {lang === "en"
          ? "Serving locations will appear here as they go live."
          : "Serveringssteder vises her når de er merket offentlig synlige i portalen."}
      </p>
    );
  }

  return (
    <ul className={`grid gap-3 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {shown.map((venue) => (
        <li key={venue.slug} className="border border-foreground/15 bg-[color:var(--paper)]">
          {venue.imageUrl ? (
            <img src={venue.imageUrl} alt="" className="h-40 w-full object-cover" />
          ) : null}
          <div className="px-6 py-7">
            <p className="font-display text-2xl tracking-tight">{venue.name}</p>
            <p className="mt-2 text-lg italic text-foreground/60">{venue.city ?? ""}</p>
            {venue.menu.length > 0 ? (
              <ul className="mt-4 space-y-1 text-sm text-foreground/70">
                {venue.menu.slice(0, 3).map((item) => (
                  <li key={item.productSlug}>
                    {item.name}
                    {item.priceLabel ? ` — ${item.priceLabel}` : ""}
                  </li>
                ))}
              </ul>
            ) : null}
            <Link
              to={lang === "en" ? "/en/venues/$slug" : "/steder/$slug"}
              params={{ slug: venue.slug }}
              className="mt-5 inline-block text-sm italic underline-offset-4 hover:underline"
            >
              {lang === "en" ? "See menu" : "Se meny"} →
            </Link>
          </div>
        </li>
      ))}
      {compact ? (
        <li className="flex items-end border border-dashed border-foreground/20 px-6 py-7">
          <Link to={t.paths.find} className="text-lg italic underline-offset-4 hover:underline">
            {t.find.more} →
          </Link>
        </li>
      ) : null}
    </ul>
  );
}
