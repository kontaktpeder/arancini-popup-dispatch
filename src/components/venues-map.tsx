import type { PublicVenue } from "@/lib/portal-venues";
import { mapsUrl, osmEmbedUrl } from "@/lib/portal-venues";

export function VenuesMap({ venues, title }: { venues: PublicVenue[]; title: string }) {
  const src = osmEmbedUrl(venues);
  if (!src) return null;
  return (
    <div className="overflow-hidden border border-foreground/15">
      <iframe title={title} src={src} className="h-[420px] w-full" loading="lazy" />
      <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3 text-sm">
        {venues
          .filter((venue) => venue.latitude != null || venue.address || venue.city)
          .map((venue) => (
            <a
              key={venue.slug}
              href={mapsUrl(venue)}
              target="_blank"
              rel="noreferrer"
              className="italic underline-offset-4 hover:underline"
            >
              {venue.name}
            </a>
          ))}
      </div>
    </div>
  );
}
