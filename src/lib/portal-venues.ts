export type PublicMenuItem = {
  productSlug: string;
  name: string;
  description: string | null;
  priceNok: number | null;
  priceLabel: string | null;
  available: boolean;
  imageUrl: string | null;
};

export type PublicVenue = {
  slug: string;
  name: string;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  instagram: string | null;
  servingMethod: string | null;
  menuIntro: string | null;
  hasMenu: boolean;
  menu: PublicMenuItem[];
};

const DEFAULT_PORTAL_URL = "https://portal.goldofsicily.no";

export function portalApiBase() {
  const fromEnv =
    (typeof process !== "undefined" &&
      (process.env.PORTAL_API_URL || process.env.VITE_PORTAL_API_URL)) ||
    "";
  return (fromEnv || DEFAULT_PORTAL_URL).replace(/\/$/, "");
}

async function fetchJson<T>(path: string, lang: "no" | "en"): Promise<T | null> {
  try {
    const response = await fetch(`${portalApiBase()}${path}?lang=${lang}`, {
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPublicVenues(lang: "no" | "en"): Promise<PublicVenue[]> {
  const data = await fetchJson<{ venues: PublicVenue[] }>("/api/public/v1/venues", lang);
  return data?.venues ?? [];
}

export async function fetchPublicVenue(
  slug: string,
  lang: "no" | "en",
): Promise<PublicVenue | null> {
  const data = await fetchJson<{ venue: PublicVenue }>(
    `/api/public/v1/venues/${encodeURIComponent(slug)}`,
    lang,
  );
  return data?.venue ?? null;
}

export function mapsUrl(venue: PublicVenue) {
  if (venue.latitude != null && venue.longitude != null) {
    return `https://www.openstreetmap.org/?mlat=${venue.latitude}&mlon=${venue.longitude}#map=16/${venue.latitude}/${venue.longitude}`;
  }
  const q = [venue.address, venue.city, venue.name].filter(Boolean).join(", ");
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`;
}

export function osmEmbedUrl(venues: PublicVenue[]) {
  const withCoords = venues.filter((venue) => venue.latitude != null && venue.longitude != null);
  if (withCoords.length === 0) return null;
  const lats = withCoords.map((venue) => venue.latitude as number);
  const lngs = withCoords.map((venue) => venue.longitude as number);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padLat = Math.max((maxLat - minLat) * 0.3, 0.04);
  const padLng = Math.max((maxLng - minLng) * 0.3, 0.06);
  const marker = `&marker=${withCoords[0].latitude}%2C${withCoords[0].longitude}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${minLng - padLng}%2C${minLat - padLat}%2C${maxLng + padLng}%2C${maxLat + padLat}&layer=mapnik${withCoords.length === 1 ? marker : ""}`;
}
