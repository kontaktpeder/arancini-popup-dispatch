import { SITE } from "./site";

export const SITE_URL = SITE.domain;

export const DEFAULT_TITLE = "Gold of Sicily — Sicilianske arancini i Oslo";

export const DEFAULT_DESCRIPTION =
  "Håndlagde sicilianske arancini i Oslo. Gold of Sicily serverer sprø italienske risballer inspirert av gatene i Palermo. Popup streetfood i små batcher.";

export const OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const THEME_COLOR = "#f2ebe8";

export type PageLocale = "nb_NO" | "en_GB";

export type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  locale?: PageLocale;
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
  const locale = seo.locale ?? "nb_NO";

  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { name: "theme-color", content: THEME_COLOR },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:url", content: url },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:locale", content: locale },
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

export const PAGE_SEO = {
  "/": {} satisfies PageSeo,
  "/next-popup": {
    title: "Neste batch kommer snart — Gold of Sicily",
    description:
      "Meld deg på listen for neste Gold of Sicily-popup i Oslo. Små batcher med sicilianske arancini, begrenset antall og først beskjed til listen.",
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
      "Popup streetfood fra Sicilia til Oslo. Hvorfor Gold of Sicily startet, små batcher, og signalene fra første popup i Sigurds gate 7.",
    path: "/about",
  },
  "/en": {
    title: "Gold of Sicily — Sicilian arancini in Oslo",
    description:
      "Handmade Sicilian arancini in Oslo. Crispy outside, soft inside. Popup street food and limited batches.",
    path: "/en",
    noindex: true,
    locale: "en_GB",
  },
  "/en/what-is-arancini": {
    title: "What is arancini? — Gold of Sicily",
    description:
      "Sicilian rice balls with a crisp shell and filling from Palermo. How Gold of Sicily makes handmade arancini in Oslo — popup street food in small batches.",
    path: "/en/what-is-arancini",
    noindex: true,
    locale: "en_GB",
  },
  "/en/next-popup": {
    title: "Next batch coming soon — Gold of Sicily",
    description:
      "Join the list for the next Gold of Sicily popup in Oslo. Small batches of Sicilian arancini, limited quantity and the list hears first.",
    path: "/en/next-popup",
    noindex: true,
    locale: "en_GB",
  },
  "/en/about": {
    title: "About Gold of Sicily",
    description:
      "Popup street food from Sicily to Oslo. Why Gold of Sicily started, small batches, and signals from our first popup at Sigurds gate 7.",
    path: "/en/about",
    noindex: true,
    locale: "en_GB",
  },
} as const satisfies Record<string, PageSeo>;
