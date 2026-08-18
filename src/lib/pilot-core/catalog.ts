import type { Organization, PilotSettings, Variant } from "./types";

/** Stable org id for the Oslo Bar og Bowling pilot — Module Contract verify target. */
export const PILOT_ORG_ID = "7e2c1a90-4b6d-4f11-9c3a-0f8e2d4b91a6";

export const PILOT_ORG: Organization = {
  id: PILOT_ORG_ID,
  name: "Gold of Sicily",
  slug: "gold-of-sicily",
  venueName: "Oslo Bar og Bowling",
  createdAt: "2026-08-01T08:00:00.000Z",
};

export const PILOT_SETTINGS: PilotSettings = {
  holdHoursAfterThaw: 48,
  holdHoursSource: "unresolved",
  contractedWeeklyQty: 100,
  autoChangeDeliveries: false,
  suggestedRetailNote:
    "Prisen ligger ferdig. Registrer kun dersom utsalgspris eller rabatt avviker.",
};

export const PILOT_VARIANTS: Variant[] = [
  {
    id: "nduja",
    name: "'Nduja",
    shortName: "Nduja",
    sku: "GOS-NDUJA",
    defaultPriceOre: 8900,
    allergenProductId: "nduja",
    accent: "oklch(0.58 0.13 25)",
  },
  {
    id: "truffle-mushroom",
    name: "Trøffel og sopp",
    shortName: "Trøffel",
    sku: "GOS-TRUFFLE",
    defaultPriceOre: 8900,
    allergenProductId: "truffle-mushroom",
    accent: "oklch(0.52 0.05 110)",
  },
];

export const ANNEX_4_WORDING =
  "Pilotkunden benytter leverandørens enkle pilotapp til registrering av uttak fra fryser, salg, svinn, beholdning og korte driftsobservasjoner. Registreringene danner automatisk den ukentlige statusen etter punkt 10 og erstatter separat rapportering. Dersom løsningen er utilgjengelig, kan opplysningene deles på e-post. Bruken utvider ikke pilotkundens opplysningsplikt utover avtalen.";

export const HOLD_HOURS_NOTE =
  "Nettsiden oppgir 24 timer etter uttak, mens avtaleutkastet oppgir 48 timer. Appen bruker 48 timer inntil holdbarheten er avklart skriftlig. Varsler og nedtelling følger valgt verdi.";

export const WEEKLY_QUESTIONS = [
  {
    key: "drinkImpact" as const,
    title: "Drikkesalg og matomsetning",
    hint: "Påvirkning på drikkesalg og samlet matomsetning",
    options: [
      { value: "up", label: "Økte" },
      { value: "same", label: "Uendret" },
      { value: "down", label: "Minket" },
      { value: "unsure", label: "Usikkert" },
    ],
  },
  {
    key: "vsExistingFood" as const,
    title: "Sammenlignet med pizza / eksisterende mat",
    hint: "Hvordan arancini sto mot det dere allerede serverer",
    options: [
      { value: "better", label: "Bedre" },
      { value: "similar", label: "På linje" },
      { value: "weaker", label: "Svakere" },
      { value: "na", label: "Ikke aktuelt" },
    ],
  },
  {
    key: "staffExperience" as const,
    title: "Ansattes erfaring",
    hint: "Lagring, tining, tilberedning og servering",
    options: [
      { value: "easy", label: "Enkelt" },
      { value: "ok", label: "Greit" },
      { value: "hard", label: "Vanskelig" },
    ],
  },
  {
    key: "guestFeedback" as const,
    title: "Tilbakemeldinger fra gjester",
    hint: "Anonymiserte reaksjoner — ingen navn",
    options: [
      { value: "loved", label: "Veldig positive" },
      { value: "good", label: "Gode" },
      { value: "mixed", label: "Blandede" },
      { value: "weak", label: "Svake" },
      { value: "none", label: "Få / ingen" },
    ],
  },
  {
    key: "objections" as const,
    title: "Salgsinnvendinger",
    hint: "Pris, størrelse, smak eller annet",
    options: [
      { value: "none", label: "Ingen" },
      { value: "price", label: "Pris" },
      { value: "size", label: "Størrelse" },
      { value: "taste", label: "Smak" },
      { value: "other", label: "Annet" },
    ],
  },
  {
    key: "deliveryExperience" as const,
    title: "Erfaring med leveransene",
    hint: "Tid, mengde, merking og emballasje",
    options: [
      { value: "smooth", label: "Smurt" },
      { value: "ok", label: "Greit" },
      { value: "issues", label: "Problemer" },
    ],
  },
] as const;

export const DEVIATION_KINDS: { value: DeviationKindPublic; label: string; hint: string }[] = [
  { value: "freeze_chain", label: "Frysekjede", hint: "Mulig brudd på frysekjeden" },
  { value: "packaging", label: "Emballasje / levering", hint: "Feil emballasje eller levering" },
  { value: "labeling", label: "Merking", hint: "Manglende merking" },
  { value: "allergen", label: "Allergenmistanke", hint: "Allergen eller merking" },
  { value: "product", label: "Produktfeil", hint: "Utseende, smak eller kvalitet" },
  { value: "airfryer", label: "Airfryer", hint: "Problem med airfryeren" },
  { value: "other", label: "Annet", hint: "Annet avvik" },
];

type DeviationKindPublic =
  | "freeze_chain"
  | "packaging"
  | "labeling"
  | "allergen"
  | "product"
  | "airfryer"
  | "other";

export const WORKFLOW_OPTIONS: { value: "easy" | "ok" | "hard"; label: string }[] = [
  { value: "easy", label: "Enkelt" },
  { value: "ok", label: "Greit" },
  { value: "hard", label: "Vanskelig" },
];

export const SUPPLIER_EMAIL = "mail@goldofsicily.no";
