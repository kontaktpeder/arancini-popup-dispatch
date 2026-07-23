/**
 * Central allergen data for bar sales pages.
 * Update here when recipes and suppliers are standardized.
 */

export type AllergenProduct = {
  id: string;
  name: { no: string; en: string };
  confirmed: { no: string[]; en: string[] };
  /** Ingredients that must be checked against the specific batch — not formal "may contain" labelling */
  dependsOnIngredients: { no: string[]; en: string[] };
  status: { no: string; en: string };
};

export const allergenProducts: AllergenProduct[] = [
  {
    id: "nduja",
    name: {
      no: "Nduja-arancini",
      en: "'Nduja arancini",
    },
    confirmed: {
      no: ["Melk"],
      en: ["Milk"],
    },
    dependsOnIngredients: {
      no: [
        "Hvete — må kontrolleres ut fra valgt panering (hvetebasert panering)",
        "Selleri, soya, sennep eller sulfitt — må kontrolleres ut fra valgt buljong, nduja og panering",
      ],
      en: [
        "Wheat — must be verified against the chosen coating (wheat-based breading)",
        "Celery, soy, mustard or sulphites — must be verified against the chosen stock, 'nduja and coating",
      ],
    },
    status: { no: "Foreløpig", en: "Preliminary" },
  },
  {
    id: "truffle-mushroom",
    name: {
      no: "Trøffel og sopp",
      en: "Truffle & mushroom",
    },
    confirmed: {
      no: ["Melk"],
      en: ["Milk"],
    },
    dependsOnIngredients: {
      no: [
        "Hvete — må kontrolleres ut fra valgt panering (hvetebasert panering)",
        "Selleri, soya, sulfitt eller andre allergener — må kontrolleres ut fra valgt buljong og trøffelkrem",
      ],
      en: [
        "Wheat — must be verified against the chosen coating (wheat-based breading)",
        "Celery, soy, sulphites or other allergens — must be verified against the chosen stock and truffle cream",
      ],
    },
    status: { no: "Foreløpig", en: "Preliminary" },
  },
];

export const allergenCopy = {
  no: {
    title: "Allergener og produktinformasjon",
    intro:
      "Alle produkter leveres med tydelig allergeninformasjon basert på oppskriften og råvarene som brukes i den aktuelle produksjonen.",
    body: [
      "Produktene våre er fortsatt under utvikling, og enkelte leverandører og råvarer kan endres før oppskriftene blir endelig standardisert.",
      "Vi kontrollerer derfor allergeninnholdet i de konkrete råvarene som brukes i hver produksjon. Dersom en ingrediens eller leverandør endres, oppdateres produktinformasjonen før varen leveres.",
    ],
    overviewLabel: "Foreløpig allergenoversikt",
    overviewSummary:
      "Melk er bekreftet i begge variantene. Andre allergener avhenger av valgt buljong, panering, nduja og trøffelkrem. Endelig allergeninformasjon følger alltid den konkrete leveransen.",
    confirmedLabel: "Bekreftet",
    dependsLabel: "Må kontrolleres ut fra valgt råvare",
    closing:
      "Den endelige allergenoversikten følger alltid den konkrete varen eller leveransen. Serveringsstedet får oppdatert informasjon som kan brukes i meny, ved disken og i internkontrollen.",
    contactLink:
      "Har dere spørsmål om allergener eller en konkret levering? Kontakt oss.",
    contactHref: "#kontakt",
  },
  en: {
    title: "Allergens and product information",
    intro:
      "Every product is delivered with clear allergen information based on the recipe and ingredients used in that specific production batch.",
    body: [
      "Our products are still under development, and some suppliers and ingredients may change before recipes are fully standardised.",
      "We therefore verify allergen content in the specific ingredients used in each production run. If an ingredient or supplier changes, product information is updated before delivery.",
    ],
    overviewLabel: "Preliminary allergen overview",
    overviewSummary:
      "Milk is confirmed in both varieties. Other allergens depend on the chosen stock, coating, 'nduja and truffle cream. Final allergen information always follows the specific delivery.",
    confirmedLabel: "Confirmed",
    dependsLabel: "Must be verified against chosen ingredients",
    closing:
      "The final allergen overview always follows the specific product or delivery. Venues receive updated information for menus, the counter and internal food-safety routines.",
    contactLink:
      "Questions about allergens or a specific delivery? Contact us.",
    contactHref: "#kontakt",
  },
} as const;
