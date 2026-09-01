/**
 * Sales page for bars — /for-barer | /en/for-bars
 * Goal: a bar manager understands the offer in under two minutes and wants to call or email.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AllergenInformation } from "@/components/allergen-information";
import { BrandNav } from "@/components/brand-nav";
import { PreferredSourcesBadge } from "@/components/preferred-sources-badge";
import { SITE } from "@/lib/site";

import imgMedDrikke from "@/assets/b2b-med-drikke.jpg";
import imgSpiseklar from "@/assets/b2b-spiseklar.jpg";
import imgPaFat from "@/assets/b2b-pa-fat.jpg";

type Lang = "no" | "en";

/** background=1 + title/byline/portrait off = clean looping video without Vimeo chrome */
const VIMEO_SRC =
  "https://player.vimeo.com/video/1211999129?background=1&autoplay=1&muted=1&loop=1&autopause=0&title=0&byline=0&portrait=0&badge=0&controls=0";

const COPY = {
  no: {
    eyebrow: "For serveringssteder",
    heroTitleBefore: "PUT GOLD OF SICILY",
    heroTitleAccent: "ON YOUR MENU.",
    heroBody:
      "Et ferdig siciliansk streetfood-konsept for barer, hoteller og serveringssteder. Produkt, tilberedning, menyer, serveringsmateriell og markedsføring. Vi gjør det enkelt å komme i gang.",
    stats: [
      { value: "5–10 min", label: "Tilberedning" },
      { value: "Ingen kokk", label: "Nødvendig" },
      { value: "Lav investering", label: "Utstyr kan inkluderes" },
      { value: "Høy verdi", label: "per servering" },
    ],
    bookVia: "Book via",
    phoneOr: "telefon eller",
    noForm: ". Ingen skjema.",
    call: "Ring",
    sendEmail: "Send e-post →",
    bookTasting: "Bestill prøvesmaking",
    becomePilot: "Bli pilotkunde →",
    mailSubjectTasting: "Book prøvesmaking — For serveringssteder",
    mailSubjectPilot: "Bli pilotkunde — For serveringssteder",
    howEyebrow: "Hvordan fungerer det?",
    howTitle: "Fire steg. Nesten null ekstra arbeid.",
    steps: [
      { n: "01", title: "Vi leverer arancini.", body: "Ferdige, frosne — til døra." },
      { n: "02", title: "Vi låner ut airfryer.", body: "Ingen investering fra dere." },
      { n: "03", title: "Dere varmer dem på få minutter.", body: "Fast guide. Minimal opplæring." },
      { n: "04", title: "Dere selger og tjener penger.", body: "Mat + ekstra drikkeomsetning." },
    ],
    includedEyebrow: "Hva er inkludert?",
    includedTitle: "Et ferdig Gold of Sicily-konsept.",
    included: [
      "Airfryer på utlån",
      "Opplæring",
      "Ferdige menyer",
      "QR-koder",
      "Produktbilder",
      "Levering",
      "Support",
    ],
    whyEyebrow: "Hvorfor fungerer det?",
    whyTitle: "Mer omsetning. Nesten null ekstra drift.",
    why: [
      {
        title: "Ingen kjøkken",
        lines: ["Ingen kokk.", "Ingen ventilasjon.", "Ingen investering."],
      },
      {
        title: "Lite arbeid",
        lines: [
          "Kun få minutters tilberedning.",
          "Én bartender klarer det.",
          "Fast oppvarmingsguide.",
        ],
      },
      {
        title: "God fortjeneste",
        lines: ["Lav innkjøpspris.", "God utsalgspris.", "Lengre besøk, mer drikke."],
      },
    ],
    productsEyebrow: "Produktene",
    productsTitle: "Håndlagde arancini. Klar på 5–10 minutter.",
    prepLabel: "Tilberedning:",
    prep: "Tines i kjøleskap dagen før (holder 24 t). Fra kjøleskap: 5–10 min i airfryer.",
    allergenNote: "Allergeninformasjon følger hver leveranse — se detaljer under.",
    products: [
      {
        name: "'Nduja",
        img: imgMedDrikke,
        alt: "Arancini servert med drikke på bar",
      },
      {
        name: "Trøffel med sopp",
        img: imgSpiseklar,
        alt: "Arancini klar til å spises",
      },
    ],
    packagesEyebrow: "Pakker",
    packagesTitle: "Start i det små. Skaler når det selger.",
    contactUs: "Kontakt oss →",
    packages: [
      {
        name: "Pilot",
        body: "50 stk, eller 100 stk (anbefalt). Kort test uten lang binding.",
      },
      {
        name: "Standard",
        body: "100 stk per levering. Fast rytme når dere er i gang.",
      },
      {
        name: "Stor",
        body: "200 stk. For steder med høyere volum.",
      },
    ],
    spaceEyebrow: "Hvor mye plass trenger det?",
    spaceTitle: "Airfryer bak baren. Ikke et kjøkken.",
    spaceAlt: "Ferdige arancini klare til servering",
    space: [
      {
        label: "Plass:",
        body: "En vanlig benke-airfryer — typisk under 40 cm bredde.",
      },
      { label: "Strøm:", body: "Vanlig stikkontakt." },
      {
        label: "Kapasitet:",
        body: "Flere stykk samtidig. Fra kjøleskap: 5–10 minutter.",
      },
      {
        label: "Ventilasjon:",
        body: "Ikke nødvendig for denne løsningen.",
      },
    ],
    pilotEyebrow: "Pilotprogram",
    pilotTitleBefore: "Vi søker et begrenset antall",
    pilotTitleAccent: "pilotsteder.",
    pilotPerks: [
      "Introduksjonspris",
      "Airfryer inkludert på utlån",
      "Oppfølging underveis",
      "Mulighet til å påvirke konseptet",
    ],
    mailPilotCta: "Mail: bli pilotkunde",
    faqEyebrow: "Vanlige spørsmål",
    faqTitle: "Det steder spør om først.",
    faq: [
      {
        q: "Hvor lenge holder de?",
        a: "Oppbevares frosne til bruk. Tines i kjøleskap dagen før og holder da ca. 24 timer. Full holdbarhet følger skriftlig med levering.",
      },
      {
        q: "Hvordan leveres de?",
        a: "Frosne, ferdig pakket. Vi avtaler dag og sted med dere.",
      },
      {
        q: "Hva koster det?",
        a: "Pilot får introduksjonspris. Ring eller mail oss, så tar vi det konkret for deres volum.",
      },
      {
        q: "Må vi ha kjøkken?",
        a: "Nei. Airfryer bak baren er nok — ingen ventilasjon eller kokk.",
      },
      {
        q: "Hvor lang binding?",
        a: "Pilotperioden er kort, uten lang binding. Dere kan stoppe etter pilot.",
      },
      {
        q: "Hvor ofte leverer dere?",
        a: "Vi avtaler rytme per bar — typisk ukentlig eller annenhver uke.",
      },
      {
        q: "Hva skjer hvis vi går tomme?",
        a: "Si ifra tidlig. Vi prioriterer pilotsteder og sier ærlig hvis vi ikke rekker ekstra på kort varsel.",
      },
      {
        q: "Hvor lang oppsigelse?",
        a: "Avtales skriftlig før oppstart. Kort og tydelig — ingen skjulte klausuler.",
      },
    ],
    aboutEyebrow: "Om Gold of Sicily",
    aboutTitle: "Et ferdig siciliansk streetfood-konsept.",
    aboutBody:
      "Vi startet med arancini. Nå pakker vi samme håndverk som et komplett Gold of Sicily-konsept — produkt, tilberedning, menyer og uttrykk — for steder som vil servere mer enn en eske mat.",
    contactEyebrow: "Kontakt",
    contactTitle: "Ring eller send mail.",
    contactAccent: "Vi booker smaking.",
    contactBody:
      "Ingen skjema. Ingen venteliste. Si ifra hvilket sted, så avtaler vi tid.",
    footer: `© ${SITE.name} · For serveringssteder`,
  },
  en: {
    eyebrow: "For venues",
    heroTitleBefore: "PUT GOLD OF SICILY",
    heroTitleAccent: "ON YOUR MENU.",
    heroBody:
      "A complete Sicilian street food concept for bars, hotels and venues. Product, prep, menus, serve materials and marketing. We make it simple to get started.",
    stats: [
      { value: "5–10 min", label: "Prep time" },
      { value: "No chef", label: "Required" },
      { value: "Low investment", label: "Equipment can be included" },
      { value: "High value", label: "per serving" },
    ],
    bookVia: "Book via",
    phoneOr: "phone or",
    noForm: ". No form.",
    call: "Call",
    sendEmail: "Send email →",
    bookTasting: "Book a tasting",
    becomePilot: "Become a pilot →",
    mailSubjectTasting: "Book a tasting — For venues",
    mailSubjectPilot: "Become a pilot customer — For venues",
    howEyebrow: "How does it work?",
    howTitle: "Four steps. Almost no extra work.",
    steps: [
      {
        n: "01",
        title: "We deliver arancini.",
        body: "Ready-made, frozen — to your door.",
      },
      {
        n: "02",
        title: "We lend you an air fryer.",
        body: "No investment from you.",
      },
      {
        n: "03",
        title: "You heat them in minutes.",
        body: "Fixed guide. Minimal training.",
      },
      {
        n: "04",
        title: "You sell and earn.",
        body: "Food + extra drink sales.",
      },
    ],
    includedEyebrow: "What's included?",
    includedTitle: "A complete Gold of Sicily concept.",
    included: [
      "Air fryer on loan",
      "Staff training",
      "Ready-made menus",
      "QR codes",
      "Product photos",
      "Delivery",
      "Support",
    ],
    whyEyebrow: "Why it works",
    whyTitle: "More revenue. Almost no extra operations.",
    why: [
      {
        title: "No kitchen",
        lines: ["No chef.", "No ventilation.", "No investment."],
      },
      {
        title: "Little work",
        lines: [
          "Only a few minutes to prepare.",
          "One bartender can handle it.",
          "Fixed heating guide.",
        ],
      },
      {
        title: "Good margins",
        lines: ["Low purchase price.", "Strong menu price.", "Longer stays, more drinks."],
      },
    ],
    productsEyebrow: "The products",
    productsTitle: "Handmade arancini. Ready in 5–10 minutes.",
    prepLabel: "Prep:",
    prep: "Thaw in the fridge the day before (keeps 24 h). From fridge: 5–10 min in air fryer.",
    allergenNote: "Allergen information follows each delivery — see details below.",
    products: [
      {
        name: "'Nduja",
        img: imgMedDrikke,
        alt: "Arancini served with a drink at the bar",
      },
      {
        name: "Truffle & mushroom",
        img: imgSpiseklar,
        alt: "Arancini ready to eat",
      },
    ],
    packagesEyebrow: "Packages",
    packagesTitle: "Start small. Scale when it sells.",
    contactUs: "Contact us →",
    packages: [
      {
        name: "Pilot",
        body: "50 pcs, or 100 pcs (recommended). Short test with no long lock-in.",
      },
      {
        name: "Standard",
        body: "100 pcs per delivery. Steady rhythm once you're running.",
      },
      {
        name: "Large",
        body: "200 pcs. For venues with higher volume.",
      },
    ],
    spaceEyebrow: "How much space do you need?",
    spaceTitle: "An air fryer behind the bar. Not a kitchen.",
    spaceAlt: "Finished arancini ready to serve",
    space: [
      {
        label: "Space:",
        body: "A standard countertop air fryer — typically under 40 cm wide.",
      },
      { label: "Power:", body: "A normal wall outlet." },
      {
        label: "Capacity:",
        body: "Several at once. From fridge: 5–10 minutes.",
      },
      {
        label: "Ventilation:",
        body: "Not required for this setup.",
      },
    ],
    pilotEyebrow: "Pilot programme",
    pilotTitleBefore: "We're looking for a limited number of",
    pilotTitleAccent: "pilot venues.",
    pilotPerks: [
      "Introductory pricing",
      "Air fryer included on loan",
      "Ongoing follow-up",
      "A say in shaping the concept",
    ],
    mailPilotCta: "Email: become a pilot",
    faqEyebrow: "FAQ",
    faqTitle: "What venues ask first.",
    faq: [
      {
        q: "How long do they keep?",
        a: "Keep frozen until use. Thaw in the fridge the day before — then about 24 hours. Full shelf life is sent in writing with delivery.",
      },
      {
        q: "How are they delivered?",
        a: "Frozen, ready packed. We agree day and place with you.",
      },
      {
        q: "What does it cost?",
        a: "Pilots get introductory pricing. Call or email us and we'll make it concrete for your volume.",
      },
      {
        q: "Do we need a kitchen?",
        a: "No. An air fryer behind the bar is enough — no ventilation or chef.",
      },
      {
        q: "How long is the commitment?",
        a: "The pilot period is short, with no long lock-in. You can stop after the pilot.",
      },
      {
        q: "How often do you deliver?",
        a: "We agree a rhythm per bar — typically weekly or every other week.",
      },
      {
        q: "What if we sell out?",
        a: "Tell us early. We prioritise pilot venues and are honest if we can't do extras on short notice.",
      },
      {
        q: "What's the notice period?",
        a: "Agreed in writing before start. Short and clear — no hidden clauses.",
      },
    ],
    aboutEyebrow: "About Gold of Sicily",
    aboutTitle: "A complete Sicilian street food concept.",
    aboutBody:
      "We started with arancini. Now we package the same craft as a complete Gold of Sicily concept — product, prep, menus and look — for venues that want to serve more than a box of food.",
    contactEyebrow: "Contact",
    contactTitle: "Call or email.",
    contactAccent: "We'll book a tasting.",
    contactBody:
      "No form. No waitlist. Tell us which venue, and we'll find a time.",
    footer: `© ${SITE.name} · For venues`,
  },
} as const;

const btnPrimary =
  "inline-flex w-full items-center justify-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-5 py-3.5 text-center text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--blush)] shadow-[3px_3px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)] sm:w-auto sm:px-6 sm:text-[0.85rem] sm:tracking-[0.16em] sm:shadow-[4px_4px_0_0_var(--color-foreground)]";

const btnGhost =
  "inline-flex w-full items-center justify-center text-center text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-foreground/75 underline-offset-4 transition hover:text-foreground hover:underline sm:w-auto sm:text-[0.8rem] sm:tracking-[0.18em]";

const sectionPad = "mx-auto px-5 py-12 sm:px-6 md:px-8 md:py-20 lg:py-24";
const cardShadow =
  "border-2 border-foreground bg-background shadow-[2px_2px_0_0_var(--color-foreground)] sm:shadow-[3px_3px_0_0_var(--color-foreground)]";

function mailHref(subject: string) {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

function ContactActions({
  lang,
  className = "",
}: {
  lang: Lang;
  className?: string;
}) {
  const t = COPY[lang];
  const hasPhone = Boolean(SITE.phoneTel && SITE.phoneLabel);
  const tasting = mailHref(t.mailSubjectTasting);
  const pilot = mailHref(t.mailSubjectPilot);

  return (
    <div
      className={`flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 ${className}`}
    >
      {hasPhone ? (
        <a href={`tel:${SITE.phoneTel}`} className={btnPrimary}>
          {t.call} {SITE.phoneLabel}
        </a>
      ) : (
        <a href={tasting} className={btnPrimary}>
          {t.bookTasting}
        </a>
      )}
      <a href={hasPhone ? tasting : pilot} className={btnGhost}>
        {hasPhone ? t.sendEmail : t.becomePilot}
      </a>
    </div>
  );
}

function VimeoEmbed() {
  return (
    <div className="relative mx-auto w-full max-w-[220px] overflow-hidden rounded-sm border-2 border-foreground bg-foreground shadow-[3px_3px_0_0_var(--color-foreground)] sm:max-w-[280px] md:max-w-[360px] md:shadow-[4px_4px_0_0_var(--color-foreground)]">
      <div
        className="pointer-events-none relative w-full"
        style={{ paddingTop: "177.99%" }}
      >
        <iframe
          src={VIMEO_SRC}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Arancini"
        />
      </div>
    </div>
  );
}

export function ForBarerLanding({ lang = "no" }: { lang?: Lang }) {
  const t = COPY[lang];
  const hasPhone = Boolean(SITE.phoneTel && SITE.phoneLabel);
  const tasting = mailHref(t.mailSubjectTasting);
  const pilot = mailHref(t.mailSubjectPilot);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BrandNav lang={lang} />

      {/* HERO — brand first, then the rational case */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 sm:gap-10 sm:px-6 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:px-8 md:py-20">
          <div className="min-w-0">
            <p className="mb-4 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-6 sm:text-[0.7rem] sm:tracking-[0.28em]">
              {t.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(2rem,8.5vw,4.25rem)] leading-[1.05] tracking-tight">
              <span className="block">{t.heroTitleBefore}</span>
              <span className="block text-[color:var(--tomato)]">{t.heroTitleAccent}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground/80 sm:mt-7 sm:text-lg md:text-xl">
              {t.heroBody}
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-4 sm:mt-10 sm:gap-6">
              {t.stats.map((stat) => (
                <div key={stat.value}>
                  <dt className="font-display text-xl tracking-tight sm:text-2xl">{stat.value}</dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-[0.16em] text-foreground/55">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <ContactActions lang={lang} className="mt-8 sm:mt-10" />
            <p className="mt-4 text-sm leading-relaxed text-foreground/55 sm:mt-5">
              {t.bookVia}{" "}
              {hasPhone ? (
                <>
                  {t.phoneOr}{" "}
                  <a href={tasting} className="underline underline-offset-2">
                    {SITE.email}
                  </a>
                </>
              ) : (
                <a href={tasting} className="underline underline-offset-2">
                  {SITE.email}
                </a>
              )}
              {t.noForm}
            </p>
          </div>

          <div className="mx-auto w-full justify-self-center md:justify-self-end">
            <VimeoEmbed />
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className={`${sectionPad} max-w-6xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.howEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.howTitle}
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-12 sm:gap-5 lg:grid-cols-4">
            {t.steps.map((s) => (
              <div key={s.n} className={`${cardShadow} p-4 sm:p-6`}>
                <div className="font-display text-2xl text-[color:var(--tomato)]/80 sm:text-4xl">
                  {s.n}
                </div>
                <h3 className="mt-3 font-display text-base tracking-tight sm:mt-4 sm:text-xl">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground/70 sm:mt-2 sm:text-sm">
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="border-b-2 border-foreground">
        <div className={`${sectionPad} max-w-4xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.includedEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.includedTitle}
          </h2>
          <ul
            className={`${cardShadow} mt-8 grid gap-2.5 bg-[color:var(--paper)] p-4 sm:mt-10 sm:grid-cols-2 sm:gap-3 sm:p-6 md:p-8 sm:shadow-[4px_4px_0_0_var(--color-foreground)]`}
          >
            {t.included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm sm:text-base">
                <span
                  aria-hidden
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--tomato)] text-[0.65rem] text-[color:var(--blush)] sm:h-6 sm:w-6 sm:text-[0.7rem]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* WHY */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className={`${sectionPad} max-w-6xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.whyEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.whyTitle}
          </h2>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-6 md:grid-cols-3">
            {t.why.map((card) => (
              <div key={card.title} className={`${cardShadow} p-5 sm:p-8`}>
                <h3 className="font-display text-xl tracking-tight sm:text-2xl">
                  {card.title}
                </h3>
                <ul className="mt-4 space-y-1.5 text-sm text-foreground/80 sm:mt-5 sm:space-y-2 sm:text-base">
                  {card.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="border-b-2 border-foreground">
        <div className={`${sectionPad} max-w-6xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.productsEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.productsTitle}
          </h2>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-6 md:grid-cols-2">
            {t.products.map((p) => (
              <article
                key={p.name}
                className="overflow-hidden border-2 border-foreground bg-[color:var(--paper)] shadow-[2px_2px_0_0_var(--color-foreground)] sm:shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <img
                  src={p.img}
                  alt={p.alt}
                  className="aspect-[4/5] w-full object-cover sm:aspect-[3/4]"
                  loading="lazy"
                />
                <div className="border-t-2 border-foreground p-4 sm:p-5">
                  <h3 className="font-display text-lg tracking-tight sm:text-xl">
                    {p.name}
                  </h3>
                  <dl className="mt-3 space-y-2 text-xs uppercase tracking-[0.12em] text-foreground/55 sm:mt-4">
                    <div>
                      <dt className="inline">{t.prepLabel} </dt>
                      <dd className="inline normal-case tracking-normal">{t.prep}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-xs leading-relaxed text-foreground/55">
                    {t.allergenNote}{" "}
                    <a href="#allergener" className="underline underline-offset-2">
                      {lang === "no" ? "Allergener" : "Allergens"}
                    </a>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className={`${sectionPad} max-w-5xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.packagesEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.packagesTitle}
          </h2>
          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-5 md:grid-cols-3">
            {t.packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`flex flex-col ${cardShadow} p-5 sm:p-7`}
              >
                <h3 className="font-display text-xl tracking-tight sm:text-2xl">
                  {pkg.name}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {pkg.body}
                </p>
                <a
                  href={pilot}
                  className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:underline sm:mt-6 sm:text-[0.75rem] sm:tracking-[0.18em]"
                >
                  {t.contactUs}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPACE — text first on mobile, shorter image */}
      <section className="border-b-2 border-foreground">
        <div className={`${sectionPad} grid max-w-6xl gap-8 md:grid-cols-2 md:items-center md:gap-10`}>
          <div className="order-1 md:order-2">
            <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
              {t.spaceEyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.65rem,5.5vw,2.75rem)] leading-[1.08] tracking-tight">
              {t.spaceTitle}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-foreground/80 sm:mt-8 sm:space-y-4 sm:text-base">
              {t.space.map((row) => (
                <li key={row.label}>
                  <strong className="text-foreground">{row.label}</strong> {row.body}
                </li>
              ))}
            </ul>
          </div>
          <img
            src={imgPaFat}
            alt={t.spaceAlt}
            className="order-2 aspect-[5/4] w-full border-2 border-foreground object-cover shadow-[2px_2px_0_0_var(--color-foreground)] sm:shadow-[4px_4px_0_0_var(--color-foreground)] md:order-1 md:aspect-[4/5]"
            loading="lazy"
          />
        </div>
      </section>

      {/* PILOT */}
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className={`${sectionPad} max-w-4xl md:py-28`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-background/55 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.pilotEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,6vw,3.5rem)] leading-[1.08] tracking-tight">
            {t.pilotTitleBefore}{" "}
            <span className="text-[color:var(--golden)]">{t.pilotTitleAccent}</span>
          </h2>
          <ul className="mt-8 grid gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-3">
            {t.pilotPerks.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border border-background/25 px-3 py-2.5 text-sm sm:px-4 sm:py-3 sm:text-base"
              >
                <span aria-hidden className="text-[color:var(--golden)]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-12 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            {hasPhone ? (
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-background shadow-[3px_3px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)] sm:w-auto sm:text-[0.85rem] sm:tracking-[0.16em] sm:shadow-[4px_4px_0_0_var(--color-background)]"
              >
                {t.call} {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={pilot}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-background hover:text-foreground sm:w-auto sm:text-[0.85rem] sm:tracking-[0.16em]"
            >
              {t.mailPilotCta}
            </a>
          </div>
        </div>
      </section>

      <AllergenInformation lang={lang} />

      {/* FAQ */}
      <section className="border-b-2 border-foreground">
        <div className={`${sectionPad} max-w-3xl`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.faqEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.65rem,5.5vw,3rem)] leading-[1.08] tracking-tight">
            {t.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-8 sm:mt-10">
            {t.faq.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="border-foreground/25"
              >
                <AccordionTrigger className="py-3.5 text-left font-display text-base tracking-tight hover:no-underline sm:py-4 sm:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-foreground/75 sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ABOUT */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className={`${sectionPad} max-w-3xl md:py-20`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-foreground/60 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.aboutEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.55rem,5vw,2.5rem)] leading-[1.08] tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-foreground/80 sm:mt-6 sm:text-lg">
            {t.aboutBody}
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="kontakt" className="bg-foreground text-background">
        <div className={`${sectionPad} max-w-3xl text-center md:py-28`}>
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.24em] text-background/55 sm:mb-4 sm:text-[0.7rem] sm:tracking-[0.28em]">
            {t.contactEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,6vw,3.5rem)] leading-[1.08] tracking-tight">
            {t.contactTitle}
            <br />
            <span className="text-[color:var(--golden)]">{t.contactAccent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-background/70 sm:mt-6 sm:text-base">
            {t.contactBody}
          </p>

          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-12 sm:max-w-none sm:items-center sm:gap-4">
            {hasPhone ? (
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-background shadow-[3px_3px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)] sm:min-w-[240px] sm:px-8 sm:py-4 sm:text-[0.9rem] sm:tracking-[0.18em] sm:shadow-[4px_4px_0_0_var(--color-background)]"
              >
                {t.call} {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={tasting}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-6 py-3.5 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-background transition hover:bg-background hover:text-foreground sm:min-w-[240px] sm:px-8 sm:py-4 sm:text-[0.9rem] sm:tracking-[0.18em]"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-col items-center gap-4 bg-background px-5 py-8 text-center text-[0.65rem] uppercase tracking-[0.24em] text-foreground/50 sm:text-xs sm:tracking-[0.28em]">
        <PreferredSourcesBadge lang={lang} />
        {t.footer}
      </footer>
    </main>
  );
}
