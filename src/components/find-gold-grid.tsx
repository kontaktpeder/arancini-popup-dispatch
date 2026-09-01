import { Link } from "@tanstack/react-router";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { VENUES } from "@/lib/locations";

export function FindGoldGrid({ lang, compact = false }: { lang: BrandLang; compact?: boolean }) {
  const t = BRAND[lang];

  return (
    <ul className={`grid gap-3 ${compact ? "md:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
      {VENUES.map((venue) => (
        <li
          key={venue.id}
          className="border border-foreground/15 bg-[color:var(--paper)] px-6 py-7"
        >
          <p className="font-display text-2xl tracking-tight">{venue.name}</p>
          <p className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-foreground/55">
            {venue.city}
          </p>
        </li>
      ))}
      {compact ? (
        <li className="flex items-end border border-dashed border-foreground/20 px-6 py-7">
          <Link
            to={t.paths.find}
            className="text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-4 hover:underline"
          >
            {t.find.more} →
          </Link>
        </li>
      ) : null}
    </ul>
  );
}
