export type DiscoveryRoute = "/what-is-arancini" | "/next-popup" | "/about";

export type EditorialCard = {
  title: string;
  description: string;
  cta: string;
  to: DiscoveryRoute;
};

export type CreditsLink = {
  label: string;
  to: DiscoveryRoute;
};

export type DiscoveryCopy = {
  heroIntro: {
    eyebrow: string;
    body: string;
  };
  editorial: {
    eyebrow: string;
    cards: EditorialCard[];
  };
  credits: {
    label: string;
    links: CreditsLink[];
  };
  footer: {
    tagline: string;
    rights: string;
  };
};

export const DISCOVERY_NO: DiscoveryCopy = {
  heroIntro: {
    eyebrow: "",
    body: "Fra gatene i Palermo til Oslo.",
  },
  editorial: {
    eyebrow: "Fra gatene i Palermo",
    cards: [
      {
        title: "Hva er arancini?",
        description: "Sprø skorpe, varm ris og fyll fra Sicilia.",
        cta: "Les guide",
        to: "/what-is-arancini",
      },
      {
        title: "Neste popup",
        description: "Én kveld. Begrenset batch.",
        cta: "Se dato",
        to: "/next-popup",
      },
      {
        title: "Om Gold of Sicily",
        description: "Popup streetfood inspirert av Palermo.",
        cta: "Vår historie",
        to: "/about",
      },
    ],
  },
  credits: {
    label: "Oppdag",
    links: [
      { label: "Hva er arancini", to: "/what-is-arancini" },
      { label: "Neste popup", to: "/next-popup" },
      { label: "Om oss", to: "/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
  },
};

export const DISCOVERY_EN: DiscoveryCopy = {
  heroIntro: {
    eyebrow: "Popup streetfood",
    body:
      "Sicilian rice balls — crisp shell, warm rice, filling from Palermo. Small batches, one night at a time.",
  },
  editorial: {
    eyebrow: "From the streets of Palermo",
    cards: [
      {
        title: "What is arancini?",
        description: "Crisp shell, warm rice, filling from Sicily.",
        cta: "Read the guide",
        to: "/what-is-arancini",
      },
      {
        title: "Next popup",
        description: "One night. Limited batch.",
        cta: "See date",
        to: "/next-popup",
      },
      {
        title: "About Gold of Sicily",
        description: "Popup streetfood inspired by Palermo.",
        cta: "Our story",
        to: "/about",
      },
    ],
  },
  credits: {
    label: "Discover",
    links: [
      { label: "What is arancini", to: "/what-is-arancini" },
      { label: "Next popup", to: "/next-popup" },
      { label: "About", to: "/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
  },
};
