/**
 * Sales page for bars — /for-barer
 * Goal: a bar manager understands the offer in under two minutes and wants to call or email.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SITE } from "@/lib/site";

import imgMedDrikke from "@/assets/b2b-med-drikke.jpg";
import imgSpiseklar from "@/assets/b2b-spiseklar.jpg";
import imgPaFat from "@/assets/b2b-pa-fat.jpg";
import imgRagu from "@/assets/menu-ragu.jpg";
import imgMozzarella from "@/assets/menu-mozzarella.jpg";
import imgPistachio from "@/assets/menu-pistachio.jpg";

const VIMEO_SRC =
  "https://player.vimeo.com/video/1211999129?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1";

const MAIL_SMAKING = `mailto:${SITE.email}?subject=${encodeURIComponent("Book prøvesmaking — For barer")}`;
const MAIL_PILOT = `mailto:${SITE.email}?subject=${encodeURIComponent("Bli pilotkunde — For barer")}`;

const STEPS = [
  { n: "01", title: "Vi leverer arancini.", body: "Ferdige, frosne — til døra." },
  { n: "02", title: "Vi låner ut airfryer.", body: "Ingen investering fra dere." },
  { n: "03", title: "Dere varmer dem på få minutter.", body: "Fast guide. Minimal opplæring." },
  { n: "04", title: "Dere selger og tjener penger.", body: "Mat + ekstra drikkeomsetning." },
] as const;

const INKLUDERT = [
  "Airfryer på utlån",
  "Opplæring",
  "Ferdige menyer",
  "QR-koder",
  "Produktbilder",
  "Levering",
  "Support",
] as const;

const WHY = [
  {
    title: "Ingen kjøkken",
    lines: ["Ingen kokk.", "Ingen ventilasjon.", "Ingen investering."],
  },
  {
    title: "Lite arbeid",
    lines: ["Kun få minutters tilberedning.", "Én bartender klarer det.", "Fast oppvarmingsguide."],
  },
  {
    title: "God fortjeneste",
    lines: ["Lav innkjøpspris.", "God utsalgspris.", "Lengre besøk, mer drikke."],
  },
] as const;

const PRODUCTS = [
  {
    name: "Ragù",
    desc: "Langtidskokt oksekjøtt, tomat, erter.",
    allergens: "Gluten, melk, egg",
    prep: "Ca. 8–10 min fra frys",
    img: imgRagu,
  },
  {
    name: "Mozzarella",
    desc: "Klassisk ostefyll, sprø skorpe.",
    allergens: "Gluten, melk, egg",
    prep: "Ca. 8–10 min fra frys",
    img: imgMozzarella,
  },
  {
    name: "Pistachio",
    desc: "Pistasj, ricotta, myk kjerne.",
    allergens: "Gluten, melk, egg, nøtter",
    prep: "Ca. 8–10 min fra frys",
    img: imgPistachio,
  },
] as const;

const PACKAGES = [
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
] as const;

const FAQ = [
  {
    q: "Hvor lenge holder de?",
    a: "Vi sender holdbarhet og oppbevaringsguide skriftlig med første levering. Oppbevares frosne.",
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
] as const;

function ContactActions({
  primaryLabel = "Bestill prøvesmaking",
  className = "",
}: {
  primaryLabel?: string;
  className?: string;
}) {
  const hasPhone = Boolean(SITE.phoneTel && SITE.phoneLabel);

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {hasPhone ? (
        <a
          href={`tel:${SITE.phoneTel}`}
          className="inline-flex items-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--blush)] shadow-[4px_4px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)]"
        >
          Ring {SITE.phoneLabel}
        </a>
      ) : (
        <a
          href={MAIL_SMAKING}
          className="inline-flex items-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--blush)] shadow-[4px_4px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)]"
        >
          {primaryLabel}
        </a>
      )}
      <a
        href={hasPhone ? MAIL_SMAKING : MAIL_PILOT}
        className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 underline-offset-4 transition hover:text-foreground hover:underline"
      >
        {hasPhone ? "Send e-post →" : "Bli pilotkunde →"}
      </a>
    </div>
  );
}

function VimeoEmbed() {
  return (
    <div className="relative w-full overflow-hidden rounded-sm border-2 border-foreground bg-foreground shadow-[4px_4px_0_0_var(--color-foreground)]">
      <div className="relative w-full" style={{ paddingTop: "177.99%" }}>
        <iframe
          src={VIMEO_SRC}
          className="absolute inset-0 h-full w-full"
          frameBorder={0}
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          title="Arancini cheesepull"
          allowFullScreen
        />
      </div>
    </div>
  );
}

export function ForBarerLanding() {
  const hasPhone = Boolean(SITE.phoneTel && SITE.phoneLabel);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HERO */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12 md:px-8 md:py-20">
          <div>
            <p className="mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
              For barer
            </p>
            <h1 className="font-display text-[clamp(2.35rem,6vw,4.25rem)] leading-[1.02] tracking-tight">
              Gi gjestene varm mat på under 10 minutter.{" "}
              <span className="text-[color:var(--tomato)]">Uten kjøkken.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              Vi leverer ferdige, frosne arancini, låner ut airfryer og gir dere
              alt dere trenger for å komme i gang.
            </p>
            <ContactActions className="mt-10" />
            <p className="mt-5 text-sm text-foreground/55">
              Book via{" "}
              {hasPhone ? (
                <>
                  telefon eller{" "}
                  <a href={MAIL_SMAKING} className="underline underline-offset-2">
                    {SITE.email}
                  </a>
                </>
              ) : (
                <a href={MAIL_SMAKING} className="underline underline-offset-2">
                  {SITE.email}
                </a>
              )}
              . Ingen skjema.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[320px] md:max-w-[360px]">
            <VimeoEmbed />
          </div>
        </div>
      </section>

      {/* HVORDAN */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Hvordan fungerer det?
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Fire steg. Nesten null ekstra arbeid.
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
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

      {/* INKLUDERT */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Hva er inkludert?
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            En ferdig matløsning — ikke bare et produkt.
          </h2>
          <ul className="mt-10 grid gap-3 border-2 border-foreground bg-[color:var(--paper)] p-6 shadow-[4px_4px_0_0_var(--color-foreground)] sm:grid-cols-2 sm:p-8">
            {INKLUDERT.map((item) => (
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

      {/* HVORFOR */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Hvorfor fungerer det?
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Mer omsetning. Nesten null ekstra drift.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {WHY.map((card) => (
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

      {/* PRODUKTER */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Produktene
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Håndlagde arancini. Varmet fra frys.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <img
              src={imgMedDrikke}
              alt="Arancini servert med drikke på bar"
              className="aspect-[3/4] w-full border-2 border-foreground object-cover shadow-[3px_3px_0_0_var(--color-foreground)]"
              loading="lazy"
            />
            <img
              src={imgSpiseklar}
              alt="Arancini klar til å spises"
              className="aspect-[3/4] w-full border-2 border-foreground object-cover shadow-[3px_3px_0_0_var(--color-foreground)]"
              loading="lazy"
            />
            <img
              src={imgPaFat}
              alt="Arancini på fat i papirkopper"
              className="aspect-[3/4] w-full border-2 border-foreground object-cover shadow-[3px_3px_0_0_var(--color-foreground)]"
              loading="lazy"
            />
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {PRODUCTS.map((p) => (
              <article
                key={p.name}
                className="overflow-hidden border-2 border-foreground bg-[color:var(--paper)] shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <img
                  src={p.img}
                  alt={`Arancini ${p.name}`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
                <div className="border-t-2 border-foreground p-5">
                  <h3 className="font-display text-xl tracking-tight">{p.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{p.desc}</p>
                  <dl className="mt-4 space-y-1 text-xs uppercase tracking-[0.12em] text-foreground/55">
                    <div>
                      <dt className="inline">Allergener: </dt>
                      <dd className="inline normal-case tracking-normal">{p.allergens}</dd>
                    </div>
                    <div>
                      <dt className="inline">Tilberedning: </dt>
                      <dd className="inline normal-case tracking-normal">{p.prep}</dd>
                    </div>
                  </dl>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PAKKER */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Pakker
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Start i det små. Skaler når det selger.
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="flex flex-col border-2 border-foreground bg-background p-7 shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <h3 className="font-display text-2xl tracking-tight">{pkg.name}</h3>
                <p className="mt-3 flex-1 text-base leading-relaxed text-foreground/75">
                  {pkg.body}
                </p>
                <a
                  href={MAIL_PILOT}
                  className="mt-6 text-[0.75rem] font-semibold uppercase tracking-[0.18em] underline-offset-4 hover:underline"
                >
                  Kontakt oss →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AIRFRYER / PLASS */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:px-8 md:py-24">
          <img
            src={imgPaFat}
            alt="Ferdige arancini klare til servering"
            className="aspect-[4/5] w-full border-2 border-foreground object-cover shadow-[4px_4px_0_0_var(--color-foreground)]"
            loading="lazy"
          />
          <div>
            <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
              Hvor mye plass trenger det?
            </p>
            <h2 className="font-display text-[clamp(1.85rem,4vw,2.75rem)] leading-[1.05] tracking-tight">
              Airfryer bak baren. Ikke et kjøkken.
            </h2>
            <ul className="mt-8 space-y-4 text-base leading-relaxed text-foreground/80">
              <li>
                <strong className="text-foreground">Plass:</strong> En vanlig
                benke-airfryer — typisk under 40 cm bredde.
              </li>
              <li>
                <strong className="text-foreground">Strøm:</strong> Vanlig
                stikkontakt.
              </li>
              <li>
                <strong className="text-foreground">Kapasitet:</strong> Flere
                stykk samtidig, klar på under 10 minutter fra frys.
              </li>
              <li>
                <strong className="text-foreground">Ventilasjon:</strong> Ikke
                nødvendig for denne løsningen.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* PILOT */}
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-background/55">
            Pilotprogram
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Vi søker et begrenset antall{" "}
            <span className="text-[color:var(--golden)]">pilotbarer.</span>
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {[
              "Introduksjonspris",
              "Airfryer inkludert på utlån",
              "Oppfølging underveis",
              "Mulighet til å påvirke konseptet",
            ].map((item) => (
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
                Ring {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={MAIL_PILOT}
              className="inline-flex items-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-background transition hover:bg-background hover:text-foreground"
            >
              Mail: bli pilotkunde
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-24">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Vanlige spørsmål
          </p>
          <h2 className="font-display text-[clamp(1.85rem,4vw,3rem)] leading-[1.05] tracking-tight">
            Det barsjefer spør om først.
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {FAQ.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`} className="border-foreground/25">
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

      {/* OM */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Om Gold of Sicily
          </p>
          <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05] tracking-tight">
            Fra popup i Oslo til mat bak baren.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            Vi startet med én ting: ekte sicilianske arancini som streetfood.
            Etter popups med 4,5/5 i smak pakker vi samme håndverk for barer som
            vil servere varm mat — uten å bygge kjøkken.
          </p>
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="bg-foreground text-background">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:px-8 md:py-28">
          <p className="mb-4 text-[0.7rem] uppercase tracking-[0.28em] text-background/55">
            Kontakt
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Ring eller send mail.
            <br />
            <span className="text-[color:var(--golden)]">Vi booker smaking.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base text-background/70">
            Ingen skjema. Ingen venteliste. Si ifra hvilken bar, så avtaler vi
            tid.
          </p>

          <div className="mt-12 flex flex-col items-center gap-4">
            {hasPhone ? (
              <a
                href={`tel:${SITE.phoneTel}`}
                className="inline-flex min-w-[240px] items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background shadow-[4px_4px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)]"
              >
                Ring {SITE.phoneLabel}
              </a>
            ) : null}
            <a
              href={MAIL_SMAKING}
              className="inline-flex min-w-[240px] items-center justify-center gap-2.5 rounded-sm border-2 border-background bg-transparent px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background transition hover:bg-background hover:text-foreground"
            >
              {SITE.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-background py-8 text-center text-xs uppercase tracking-[0.28em] text-foreground/50">
        © {SITE.name} · For barer
      </footer>
    </main>
  );
}
