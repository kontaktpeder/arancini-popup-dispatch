export type BrandLang = "no" | "en";

const navNo = {
  arancini: "Arancini",
  find: "Finn oss",
  about: "Om oss",
  venues: "For serveringssteder",
  menu: "Meny",
  close: "Lukk",
};

const navEn = {
  arancini: "Arancini",
  find: "Find us",
  about: "About",
  venues: "For venues",
  menu: "Menu",
  close: "Close",
};

export const BRAND = {
  no: {
    nav: navNo,
    paths: {
      home: "/",
      arancini: "/what-is-arancini",
      find: "/finn-oss",
      about: "/about",
      venues: "/for-barer",
    },
    hero: {
      brand: "Gold of Sicily",
      line1: "Stay a little",
      line2: "longer.",
      sub: "Arancini fra Sicilia.\nLaget i Oslo.",
      find: "Finn Gold",
      venues: "For serveringssteder",
    },
    gold: {
      eyebrow: "The Gold",
      title: "Arancini",
      body: "Sprø utenpå.\nKremet inni.\nSiciliansk hele veien.",
      flavors: ["'Nduja", "Trøffel & sopp"],
      cta: "Hva er arancini?",
      photoAlt: "Seks sprø arancini på et mørkt brett",
    },
    world: {
      title: ["Good food.", "Good friends.", "No rush."],
      body: "Vi startet med arancini.\nMen Gold of Sicily handler om det som skjer rundt bordet.",
      photoAlt: "Arancini holdt i hendene, klar til å spises",
    },
    tutto: {
      title: "Tutto passa.",
      body: "Alt går over.\nDet gode kan gjerne vare litt lenger.",
    },
    same: {
      eyebrow: "Different places.",
      title: "Same Gold.",
      body: "Når Gold of Sicily står på menyen, skal du kjenne det igjen.",
      photoAlt: "Arancini servert med kald drikke i baren",
    },
    find: {
      title: "Find Gold",
      body: "Gold of Sicily serveres her.",
      more: "Finn oss",
      pageBody:
        "Gold of Sicily serveres på utvalgte steder. Samme produkt. Samme uttrykk. Samme standard.",
    },
    serve: {
      eyebrow: "Serve Gold",
      title: "Mer enn arancini.",
      items: ["Produkt", "Serveringssystem", "Menyer", "Materiell", "Opplæring"],
      cta: "For serveringssteder",
    },
    footer: {
      places: "Oslo / Sicilia",
      line: "Stay a little longer.",
      handle: "@goldofsicily",
    },
    about: {
      eyebrow: "Om oss",
      title: ["A little more Italy.", "Right here."],
      manifesto: [
        "Gold of Sicily startet med arancini.",
        "Men målet har aldri bare vært å introdusere enda en italiensk rett.",
        "Vi vil ta med oss noe av måten italienerne møtes, spiser og bruker tiden sin på. Lange bord. God mat. Espresso. Kalde øl. Litt mer stil. Litt mindre hastverk.",
        "Sicilia er utgangspunktet.",
        "Norge er hjemme.",
      ],
      storyHeading: "Historien",
      story: [
        "Den begynte da Denis kom til Norge og lurte på hvorfor pizza og pasta var selvsagt — mens arancini nesten ikke fantes.",
        "Første kveld i Oslo bekreftet det vi håpet: folk vil sitte med dette. Nå lager vi Gold of Sicily som et ferdig konsept for steder som vil servere den følelsen, ikke bare en eske mat.",
      ],
      proof: "Første smaking: 4,5/5.",
      ctaFind: "Finn oss",
      ctaIg: "Instagram",
    },
    aranciniPage: {
      seoGuard:
        "I Oslo møter du arancini som siciliansk street food: sprø skorpe, varm ris og fyll som skal spises med hendene. Gold of Sicily lager dem med samme håndverk, servert på barer og steder rundt i byen.",
    },
  },
  en: {
    nav: navEn,
    paths: {
      home: "/en",
      arancini: "/en/what-is-arancini",
      find: "/en/find-us",
      about: "/en/about",
      venues: "/en/for-bars",
    },
    hero: {
      brand: "Gold of Sicily",
      line1: "Stay a little",
      line2: "longer.",
      sub: "Arancini from Sicily.\nMade in Oslo.",
      find: "Find Gold",
      venues: "For venues",
    },
    gold: {
      eyebrow: "The Gold",
      title: "Arancini",
      body: "Crisp outside.\nCreamy inside.\nSicilian all the way.",
      flavors: ["'Nduja", "Truffle & mushroom"],
      cta: "What is arancini?",
      photoAlt: "Six crisp arancini on a dark tray",
    },
    world: {
      title: ["Good food.", "Good friends.", "No rush."],
      body: "We started with arancini.\nBut Gold of Sicily is about what happens around the table.",
      photoAlt: "Arancini held in hands, ready to eat",
    },
    tutto: {
      title: "Tutto passa.",
      body: "Everything passes.\nThe good things can last a little longer.",
    },
    same: {
      eyebrow: "Different places.",
      title: "Same Gold.",
      body: "When Gold of Sicily is on the menu, you should recognise it.",
      photoAlt: "Arancini served with a cold drink at the bar",
    },
    find: {
      title: "Find Gold",
      body: "Gold of Sicily is served here.",
      more: "Find us",
      pageBody:
        "Gold of Sicily is served at selected venues. Same product. Same look. Same standard.",
    },
    serve: {
      eyebrow: "Serve Gold",
      title: "More than arancini.",
      items: ["Product", "Serve system", "Menus", "Materials", "Training"],
      cta: "For venues",
    },
    footer: {
      places: "Oslo / Sicily",
      line: "Stay a little longer.",
      handle: "@goldofsicily",
    },
    about: {
      eyebrow: "About",
      title: ["A little more Italy.", "Right here."],
      manifesto: [
        "Gold of Sicily started with arancini.",
        "But the aim was never just to introduce another Italian dish.",
        "We want to bring something of how Italians meet, eat and spend their time. Long tables. Good food. Espresso. Cold beer. A little more style. A little less hurry.",
        "Sicily is the starting point.",
        "Norway is home.",
      ],
      storyHeading: "The story",
      story: [
        "It began when Denis came to Norway and wondered why pizza and pasta were a given — while arancini barely existed.",
        "The first night in Oslo confirmed what we hoped: people want to sit with this. Now we make Gold of Sicily as a complete concept for venues that want to serve that feeling, not just a box of food.",
      ],
      proof: "First tasting: 4.5/5.",
      ctaFind: "Find us",
      ctaIg: "Instagram",
    },
    aranciniPage: {
      seoGuard:
        "In Oslo you meet arancini as Sicilian street food: a crisp shell, warm rice and filling made to be eaten with your hands. Gold of Sicily makes them with the same craft, served at bars and venues around the city.",
    },
  },
} as const;
