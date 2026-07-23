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
import { LangSwitch } from "@/components/lang-switch";
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
    eyebrow: "For barer",
    heroTitleBefore: "Gi gjestene varm mat på under 10 minutter.",
    heroTitleAccent: "Uten kjøkken.",
    heroBody:
      "Vi leverer ferdige, frosne arancini, låner ut airfryer og gir dere alt dere trenger for å komme i gang.",
    bookVia: "Book via",
    phoneOr: "telefon eller",
    noForm: ". Ingen skjema.",
    call: "Ring",
    sendEmail: "Send e-post →",
    bookTasting: "Bestill prøvesmaking",
    becomePilot: "Bli pilotkunde →",
    mailSubjectTasting: "Book prøvesmaking — For barer",
    mailSubjectPilot: "Bli pilotkunde — For barer",
    howEyebrow: "Hvordan fungerer det?",
    howTitle: "Fire steg. Nesten null ekstra arbeid.",
    steps: [
      { n: "01", title: "Vi leverer arancini.", body: "Ferdige, frosne — til døra." },
      { n: "02", title: "Vi låner ut airfryer.", body: "Ingen investering fra dere." },
      { n: "03", title: "Dere varmer dem på få minutter.", body: "Fast guide. Minimal opplæring." },
      { n: "04", title: "Dere selger og tjener penger.", body: "Mat + ekstra drikkeomsetning." },
    ],
    includedEyebrow: "Hva er inkludert?",
    includedTitle: "En ferdig matløsning — ikke bare et produkt.",
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
    pilotTitleAccent: "pilotbarer.",
    pilotPerks: [
      "Introduksjonspris",
      "Airfryer inkludert på utlån",
      "Oppfølging underveis",
      "Mulighet til å påvirke konseptet",
    ],
    mailPilotCta: "Mail: bli pilotkunde",
    faqEyebrow: "Vanlige spørsmål",
    faqTitle: "Det barsjefer spør om først.",
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
        a: "Si ifra tidlig. Vi prioriterer pilotbarer og sier ærlig hvis vi ikke rekker ekstra på kort varsel.",
      },
      {
        q: "Hvor lang oppsigelse?",
        a: "Avtales skriftlig før oppstart. Kort og tydelig — ingen skjulte klausuler.",
      },
    ],
    aboutEyebrow: "Om Gold of Sicily",
    aboutTitle: "Fra popup i Oslo til mat bak baren.",
    aboutBody:
      "Vi startet med én ting: ekte sicilianske arancini som streetfood. Etter popups med 4,5/5 i smak pakker vi samme håndverk for barer som vil servere varm mat — uten å bygge kjøkken.",
    contactEyebrow: "Kontakt",
    contactTitle: "Ring eller send mail.",
    contactAccent: "Vi booker smaking.",
    contactBody:
      "Ingen skjema. Ingen venteliste. Si ifra hvilken bar, så avtaler vi tid.",
    footer: `© ${SITE.name} · For barer`,
  },
  en: {
    eyebrow: "For bars",
    heroTitleBefore: "Serve guests hot food in under 10 minutes.",
    heroTitleAccent: "No kitchen needed.",
    heroBody:
      "We deliver ready-made frozen arancini, lend you an air fryer, and give you everything you need to get started.",
    bookVia: "Book via",
    phoneOr: "phone or",
    noForm: ". No form.",
    call: "Call",
    sendEmail: "Send email →",
    bookTasting: "Book a tasting",
    becomePilot: "Become a pilot →",
    mailSubjectTasting: "Book a tasting — For bars",
    mailSubjectPilot: "Become a pilot customer — For bars",
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
    includedTitle: "A complete food solution — not just a product.",
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
    pilotTitleAccent: "pilot bars.",
    pilotPerks: [
      "Introductory pricing",
      "Air fryer included on loan",
      "Ongoing follow-up",
      "A say in shaping the concept",
    ],
    mailPilotCta: "Email: become a pilot",
    faqEyebrow: "FAQ",
    faqTitle: "What bar managers ask first.",
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
        a: "Tell us early. We prioritise pilot bars and are honest if we can't do extras on short notice.",
      },
      {
        q: "What's the notice period?",
        a: "Agreed in writing before start. Short and clear — no hidden clauses.",
      },
    ],
    aboutEyebrow: "About Gold of Sicily",
    aboutTitle: "From pop-ups in Oslo to food behind the bar.",
    aboutBody:
      "We started with one thing: real Sicilian arancini as street food. After pop-ups scoring 4.5/5 on taste, we package the same craft for bars that want to serve hot food — without building a kitchen.",
    contactEyebrow: "Contact",
    contactTitle: "Call or email.",
    contactAccent: "We'll book a tasting.",
    contactBody:
      "No form. No waitlist. Tell us which bar, and we'll find a time.",
    footer: `© ${SITE.name} · For bars`,
  },
} as const;

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
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {hasPhone ? (
        <a
          href={`tel:${SITE.phoneTel}`}
          className="inline-flex items-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--blush)] shadow-[4px_4px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)]"
        >
          {t.call} {SITE.phoneLabel}
        </a>
      ) : (
        <a
          href={tasting}
          className="inline-flex items-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--blush)] shadow-[4px_4px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)]"
        >
          {t.bookTasting}
        </a>
      )}
      <a
        href={hasPhone ? tasting : pilot}
        className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 underline-offset-4 transition hover:text-foreground hover:underline"
      >
        {hasPhone ? t.sendEmail : t.becomePilot}
      </a>
    </div>
  );
}

function VimeoEmbed() {
  return (
    <div className="relative w-full overflow-hidden rounded-sm border-2 border-foreground bg-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
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
      <LangSwitch lang={lang} />
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:px-8 md:py-20">
          <div>
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
              {t.eyebrow}
            </p>
            <h1 className="font-display text-[clamp(2.35rem,6vw,4.25rem)] leading-[1.02] tracking-tight">
              {t.heroTitleBefore}{" "}
              <span className="text-[color:var(--tomato)]">{t.heroTitleAccent}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              {t.heroBody}
            </p>
            <ContactActions lang={lang} className="mt-10" />
            <p className="mt-5 text-sm text-foreground/55">
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

          <div className="mx-auto w-full max-w-[320px] md:max-w-[360px]">
            <VimeoEmbed />
          </div>
        </div>
      </section>

      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.howEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.howTitle}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.map((s) => (
              <div
                key={s.n}
                className="border-2 border-foreground bg-background p-6 shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <div className="font-display text-4xl text-[color:var(--tomato)]/80">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-xl tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.includedEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.includedTitle}
          </h2>
          <ul className="mt-10 grid gap-3 border-2 border-foreground bg-[color:var(--paper)] p-6 shadow-[4px_4px_0_0_var(--color-foreground)] sm:grid-cols-2 sm:p-8">
            {t.included.map((item) => (
              <li key={item} className="flex items-center gap-3 text-base">
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--tomato)] text-[0.7rem] text-[color:var(--blush)]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.whyEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.whyTitle}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.why.map((card) => (
              <div
                key={card.title}
                className="border-2 border-foreground bg-background p-8 shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <h3 className="font-display text-2xl tracking-tight">{card.title}</h3>
                <ul className="mt-5 space-y-2 text-base text-foreground/80">
                  {card.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.productsEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.productsTitle}
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {t.products.map((p) => (
              <article
                key={p.name}
                className="overflow-hidden border-2 border-foreground bg-[color:var(--paper)] shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <img
                  src={p.img}
                  alt={p.alt}
                  className="aspect-[3/4] w-full object-cover"
                  loading="lazy"
                />
                <div className="border-t-2 border-foreground p-5">
                  <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
                  <dl className="mt-4 space-y-2 text-xs uppercase tracking-[0.12em] text-foreground/55">
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

      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.packagesEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.packagesTitle}
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {t.packages.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col border-2 border-foreground bg-background p-7 shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <h3 className="font-display text-2xl tracking-tight">{pkg.name}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-foreground/75">
                  {pkg.body}
                </p>
                <a
                  href={pilot}
                  className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] underline-offset-4 hover:underline"
                >
                  {t.contactUs}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <img
            src={imgPaFat}
            alt={t.spaceAlt}
            className="aspect-[4/5] w-full border-2 border-foreground object-cover shadow-[4px_4px_0_0_var(--color-foreground)]"
            loading="lazy"
          />
          <div>
            <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
              {t.spaceEyebrow}
            </p>
            <h2 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              {t.spaceTitle}
            </h2>
            <ul className="mt-8 space-y-4 text-base leading-relaxed text-foreground/80">
              {t.space.map((row) => (
                <li key={row.label}>
                  <strong className="text-foreground">{row.label}</strong> {row.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-background/55">
            {t.pilotEyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            {t.pilotTitleBefore}{" "}
            <span className="text-[color:var(--golden)]">{t.pilotTitleAccent}</span>
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {t.pilotPerks.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 border border-background/25 px-4 py-3 text-base"
              >
                <span aria-hidden className="text-[color:var(--golden)]">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-4">
            {hasPhone ? (
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex items-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-background shadow-[4px_4px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)]"
              >
                {t.call} {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={pilot}
              className="inline-flex items-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-background transition hover:bg-background hover:text-foreground"
            >
              {t.mailPilotCta}
            </a>
          </div>
        </div>
      </section>

      <AllergenInformation lang={lang} />

      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.faqEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            {t.faqTitle}
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {t.faq.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`faq-${i}`}
                className="border-foreground/25"
              >
                <AccordionTrigger className="font-display text-left text-lg tracking-tight hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-foreground/75">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            {t.aboutEyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">{t.aboutBody}</p>
        </div>
      </section>

      <section id="kontakt" className="bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-8 md:py-28">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-background/55">
            {t.contactEyebrow}
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            {t.contactTitle}
            <br />
            <span className="text-[color:var(--golden)]">{t.contactAccent}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-background/70">
            {t.contactBody}
          </p>

          <div className="mt-12 flex flex-col items-center gap-4">
            {hasPhone ? (
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex min-w-[240px] items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background shadow-[4px_4px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)]"
              >
                {t.call} {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={tasting}
              className="inline-flex min-w-[240px] items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-background hover:text-foreground"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-background py-8 text-center text-xs uppercase tracking-[0.28em] text-foreground/50">
        {t.footer}
      </footer>
    </main>
  );
}
