export type DiscoveryRoute =
  | "/what-is-arancini"
  | "/next-popup"
  | "/about"
  | "/for-barer"
  | "/en/what-is-arancini"
  | "/en/next-popup"
  | "/en/about";

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
    barsLabel: string;
    barsTo: "/for-barer" | "/en/for-bars";
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
        cta: "Lær mer",
        to: "/what-is-arancini",
      },
      {
        title: "For barer",
        description: "Varm mat når kjøkkenet er stengt — eller uten fullt kjøkken.",
        cta: "Se løsningen",
        to: "/for-barer",
      },
      {
        title: "Om Gold of Sicily",
        description: "Historien bak Gold of Sicily og siciliansk arancini produsert i Oslo.",
        cta: "Vår historie",
        to: "/about",
      },
    ],
  },
  credits: {
    label: "Oppdag",
    links: [
      { label: "Hva er arancini", to: "/what-is-arancini" },
      { label: "For barer", to: "/for-barer" },
      { label: "Om oss", to: "/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
    barsLabel: "For barer",
    barsTo: "/for-barer",
  },
};

export const DISCOVERY_EN: DiscoveryCopy = {
  heroIntro: {
    eyebrow: "",
    body: "From the streets of Palermo to Oslo.",
  },
  editorial: {
    eyebrow: "From the streets of Palermo",
    cards: [
      {
        title: "What is arancini?",
        description: "Crisp shell, warm rice, filling from Sicily.",
        cta: "Learn more",
        to: "/en/what-is-arancini",
      },
      {
        title: "Next popup",
        description: "One night. Limited batch.",
        cta: "See date",
        to: "/en/next-popup",
      },
      {
        title: "About Gold of Sicily",
        description: "Popup street food inspired by Palermo.",
        cta: "Our story",
        to: "/en/about",
      },
    ],
  },
  credits: {
    label: "Discover",
    links: [
      { label: "What is arancini?", to: "/en/what-is-arancini" },
      { label: "Next popup", to: "/en/next-popup" },
      { label: "About", to: "/en/about" },
    ],
  },
  footer: {
    tagline: "Oslo · Palermo",
    rights: "© Gold of Sicily",
    barsLabel: "For bars",
    barsTo: "/en/for-bars",
  },
};
