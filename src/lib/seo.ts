import { CURRENT_POPUP, SITE } from "./site";

export const SITE_URL = SITE.domain;

export const DEFAULT_TITLE = "Gold of Sicily — Sicilianske arancini i Oslo";

export const DEFAULT_DESCRIPTION =
  "Håndlagde sicilianske arancini i Oslo. Gold of Sicily serverer sprø italienske risballer inspirert av gatene i Palermo. Popup streetfood, events og nye drops.";

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const THEME_COLOR = "#f2ebe8";

export type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
};

export function canonicalUrl(path = "/") {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageHead(seo: PageSeo = {}) {
  const title = seo.title ?? DEFAULT_TITLE;
  const description = seo.description ?? DEFAULT_DESCRIPTION;
  const url = canonicalUrl(seo.path ?? "/");
  const ogType = seo.ogType ?? "website";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: THEME_COLOR },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:locale", content: "nb_NO" },
    { property: "og:site_name", content: SITE.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: OG_IMAGE },
  ];

  if (seo.noindex) {
    meta.push({ name: "robots", content: "noindex, follow" });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FoodEstablishment",
  name: SITE.name,
  url: SITE_URL,
  image: OG_IMAGE,
  description: DEFAULT_DESCRIPTION,
  servesCuisine: ["Sicilian", "Italian street food"],
  areaServed: { "@type": "City", name: "Oslo" },
  sameAs: [SITE.instagram],
};

export function buildPopupEventJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FoodEvent",
    name: `${SITE.name} popup — ${CURRENT_POPUP.addressShort}`,
    startDate: CURRENT_POPUP.startDate,
    endDate: CURRENT_POPUP.endDate,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: CURRENT_POPUP.addressFull,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Sigurds gate 7",
        addressLocality: "Oslo",
        addressCountry: "NO",
      },
    },
    organizer: { "@type": "Organization", name: SITE.name, url: SITE_URL },
    image: OG_IMAGE,
    description: DEFAULT_DESCRIPTION,
  };
}

export const PAGE_SEO = {
  "/": {} satisfies PageSeo,
  "/next-popup": {
    title: "Neste popup — Gold of Sicily",
    description: `Neste batch arancini i Oslo: ${CURRENT_POPUP.dateLabel}, ${CURRENT_POPUP.timeLabel} på ${CURRENT_POPUP.addressShort}. Begrenset meny — ${CURRENT_POPUP.scarcity}`,
    path: "/next-popup",
  },
  "/what-is-arancini": {
    title: "Hva er arancini? — Gold of Sicily",
    description:
      "Sicilianske risballer med sprø skorpe og fyll fra Palermo. Slik lager Gold of Sicily håndlagde arancini i Oslo — popup streetfood i små batcher.",
    path: "/what-is-arancini",
  },
  "/about": {
    title: "Om Gold of Sicily",
    description:
      "Popup streetfood fra Sicilia til Oslo. Hvorfor Gold of Sicily startet, små batcher, og arancini-kultur — uten corporate fluff.",
    path: "/about",
  },
  "/en": {
    title: "Gold of Sicily — Sicilian arancini in Oslo",
    description:
      "Handmade Sicilian arancini in Oslo. Crispy outside, soft inside. Popup streetfood and limited batches.",
    path: "/en",
    noindex: true,
  },
} as const satisfies Record<string, PageSeo>;
