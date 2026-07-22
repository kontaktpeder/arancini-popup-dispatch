import { SITE } from "./site";

export const SITE_URL = SITE.domain;

export const DEFAULT_TITLE = "Arancini Oslo — Gold of Sicily";

export const DEFAULT_DESCRIPTION =
  "Sicilianske arancini i Oslo: sprø risballer med varmt fyll, laget i små batcher av Gold of Sicily. Meld deg på listen for neste popup.";

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
  sameAs: [SITE.instagram, SITE.tiktok],
};

export const PAGE_SEO = {
  "/": {
    title: "Arancini Oslo — siciliansk streetfood | Gold of Sicily",
    description:
      "Gold of Sicily lager sicilianske arancini i Oslo: sprø risballer med ragu, ost, trøffel og sopp. Første popup fikk 4,5/5 i smak.",
    path: "/",
  } satisfies PageSeo,
  "/next-popup": {
    title: "Neste arancini-popup i Oslo kommer snart — Gold of Sicily",
    description:
      "Meld deg på listen for neste Gold of Sicily-popup i Oslo. Små batcher med sicilianske arancini, begrenset antall og først beskjed til listen.",
    path: "/next-popup",
  },
  "/what-is-arancini": {
    title: "Hva er arancini? Sicilianske risballer forklart — Gold of Sicily",
    description:
      "Hva er arancini? Lær om sicilianske risballer med sprø skorpe, varmt fyll og hvorfor Gold of Sicily lager dem som popup streetfood i Oslo.",
    path: "/what-is-arancini",
  },
  "/about": {
    title: "Om Gold of Sicily",
    description:
      "Popup streetfood fra Sicilia til Oslo. Hvorfor Gold of Sicily startet, små batcher, og signalene fra første popup i Sigurds gate 7.",
    path: "/about",
  },
  "/samarbeid": {
    title: "Arancini til ditt event — samarbeid med Gold of Sicily",
    description:
      "Bryllup, firmafest, festival eller popup-samarbeid i Oslo? Ta kontakt med Gold of Sicily for sicilianske arancini til ditt arrangement.",
    path: "/samarbeid",
  },
  "/for-barer": {
    title: "For barer — varm mat uten kjøkken | Gold of Sicily",
    description:
      "Frosne arancini, airfryer på utlån og oppstartshjelp for barer. Varm mat på under 10 minutter. Book prøvesmaking på telefon eller e-post.",
    path: "/for-barer",
    noindex: true,
  },
  "/en/for-bars": {
    title: "For bars — hot food without a kitchen | Gold of Sicily",
    description:
      "Frozen arancini, air fryer on loan and setup support for bars. Hot food in under 10 minutes. Book a tasting by phone or email.",
    path: "/en/for-bars",
    noindex: true,
    locale: "en_GB",
  },
  "/en/collaborate": {
    title: "Arancini for your event — collaborate with Gold of Sicily",
    description:
      "Weddings, company events, festivals or popup partnerships in Oslo. Get in touch with Gold of Sicily about Sicilian arancini for your event.",
    path: "/en/collaborate",
    noindex: true,
    locale: "en_GB",
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
