export type DiscoveryRoute =
  | "/what-is-arancini"
  | "/next-popup"
  | "/about"
  | "/for-barer"
  | "/en/what-is-arancini"
  | "/en/next-popup"
  | "/en/for-bars"
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
        title: "For bars",
        description: "Hot food after the kitchen closes — or without a full kitchen.",
        cta: "See the solution",
        to: "/en/for-bars",
      },
      {
        title: "About Gold of Sicily",
        description: "The story behind Gold of Sicily and Sicilian arancini made in Oslo.",
        cta: "Our story",
        to: "/en/about",
      },
    ],
  },
  credits: {
    label: "Discover",
    links: [
      { label: "What is arancini?", to: "/en/what-is-arancini" },
      { label: "For bars", to: "/en/for-bars" },
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
