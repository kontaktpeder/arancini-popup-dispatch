/**
 * B2B landing page for Gold of Sicily — pitch to bars & restaurants.
 * Not wired to routing yet. Import from a route file when ready to launch.
 *
 * Usage (later):
 *   // src/routes/b2b.tsx
 *   import { createFileRoute } from "@tanstack/react-router";
 *   import { B2BLanding } from "@/components/b2b-landing";
 *   export const Route = createFileRoute("/b2b")({ component: B2BLanding });
 */

import arancini from "@/assets/arancini-watercolor.png";

const SMAKER = [
  { name: "Ragù", desc: "Langtidskokt oksekjøtt, tomat, erter." },
  { name: "Trøffel", desc: "Sopp, trøffelolje, parmesan." },
  { name: "'Nduja", desc: "Krydret calabrisk pølse, mozzarella." },
  { name: "Klassisk", desc: "Mozzarella, safran, brødsmuler." },
];

const INKLUDERT = [
  "Arancini, frossen levering",
  "Oppvarmingsguide",
  "Opplæring av personalet",
  "Menymateriell",
  "Bilder til sosiale medier",
  "QR-koder for bestilling",
  "Løpende oppfølging",
];

const MÅLGRUPPE = [
  { icon: "🍺", label: "Barer" },
  { icon: "🍷", label: "Vinbarer" },
  { icon: "🍽", label: "Restauranter med begrenset kjøkken" },
];

export function B2BLanding() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-[1.15fr_0.85fr] md:items-center md:gap-8 md:px-8 md:py-24">
          <div>
            <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
              For barer og restauranter
            </p>
            <h1 className="font-display text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.98] tracking-tight">
              Gi gjestene mat.
              <br />
              <span className="text-[color:var(--tomato)]">Uten kjøkken.</span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/80 md:text-xl">
              Gold of Sicily gjør det mulig for barer og restauranter å servere
              varm kvalitetsmat på få minutter. Ingen kokk. Ingen kjøkken. Ingen
              komplisert drift.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#book"
                className="inline-flex items-center gap-2.5 rounded-sm border-2 border-foreground bg-[color:var(--tomato)] px-6 py-3.5 text-[0.85rem] font-semibold uppercase tracking-[0.16em] text-[color:var(--blush)] shadow-[4px_4px_0_0_var(--color-foreground)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-foreground)]"
              >
                Bestill gratis smaksprøve
              </a>
              <a
                href="#book"
                className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-foreground/75 underline-offset-4 transition hover:text-foreground hover:underline"
              >
                Book 15-min demo →
              </a>
            </div>
          </div>

          <img
            src={arancini}
            alt="Sicilianske arancini"
            className="mx-auto w-[75vw] max-w-[440px] object-contain drop-shadow-[0_30px_40px_rgba(60,30,10,0.18)] md:w-full md:max-w-none"
            width={1500}
            height={1000}
          />
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Problemet
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Altfor mange utesteder taper salg fordi de ikke serverer mat.
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              { icon: "🍺", text: "Gjester blir sultne." },
              { icon: "🥜", text: "Nøtter og chips holder ikke." },
              { icon: "🚕", text: "Mange drar tidligere enn de ellers ville." },
            ].map((item) => (
              <div
                key={item.text}
                className="rounded-sm border-2 border-foreground bg-background p-6 shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <div className="text-3xl" aria-hidden>
                  {item.icon}
                </div>
                <p className="mt-4 text-base leading-relaxed text-foreground/85">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-foreground/80">
            Dere mister ikke bare matsalg. Dere mister ekstra drikkeomsetning,
            lengre besøk og gjester som ellers ville blitt værende.
          </p>
        </div>
      </section>

      {/* ============ LØSNING ============ */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Løsningen
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] tracking-tight">
            Ferdig mat.
            <br />
            <span className="text-[color:var(--tomato)]">Klar på få minutter.</span>
          </h2>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Frossen levering",
                body: "Leveres ferdig produsert til døra.",
              },
              {
                step: "02",
                title: "Enkel oppvarming",
                body: "Airfryer. Ingen kokk. Minimal opplæring.",
              },
              {
                step: "03",
                title: "Servering",
                body: "Varm mat akkurat når gjesten bestiller.",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="relative rounded-sm border-2 border-foreground bg-[color:var(--paper)] p-8 shadow-[4px_4px_0_0_var(--color-foreground)]"
              >
                <div className="font-display text-6xl leading-none text-[color:var(--tomato)]/70">
                  {card.step}
                </div>
                <h3 className="mt-6 font-display text-2xl tracking-tight">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-foreground/80">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DERFOR FUNGERER ============ */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Derfor fungerer det
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Én gjest. Ett større regningsbeløp.
          </h2>

          <ol className="mt-14 space-y-4">
            {[
              "Gjesten bestiller øl.",
              "Blir sulten.",
              "Bestiller arancini.",
              "Bestiller ett glass til.",
              "Blir sittende lenger.",
            ].map((step, i, arr) => (
              <li key={step} className="flex items-start gap-5">
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-background font-display text-sm">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-lg leading-snug">{step}</p>
                  {i < arr.length - 1 ? (
                    <div className="ml-[-0.25rem] mt-2 h-6 w-px bg-foreground/30" />
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ ALT FØLGER MED ============ */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-4xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Alt følger med
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Dere kjøper ikke bare et produkt.
            <br />
            <span className="text-[color:var(--tomato)]">
              Dere får en ferdig matløsning.
            </span>
          </h2>

          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {INKLUDERT.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-sm border-2 border-foreground bg-[color:var(--paper)] px-4 py-3.5 text-base"
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--tomato)] text-[color:var(--blush)]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ MÅLGRUPPE ============ */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:px-8 md:py-24">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Hvem passer dette for?
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {MÅLGRUPPE.map((g) => (
              <div
                key={g.label}
                className="rounded-sm border-2 border-foreground bg-background p-8 text-center shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <div className="text-5xl" aria-hidden>
                  {g.icon}
                </div>
                <p className="mt-4 font-display text-xl tracking-tight">
                  {g.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SMAKER ============ */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-6xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Smaker
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-tight">
            Fire varianter. Alle håndlagde.
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-4">
            {SMAKER.map((s) => (
              <div
                key={s.name}
                className="group overflow-hidden rounded-sm border-2 border-foreground bg-[color:var(--paper)] shadow-[3px_3px_0_0_var(--color-foreground)]"
              >
                <div className="aspect-square overflow-hidden bg-[color:var(--blush)]">
                  <img
                    src={arancini}
                    alt={`Arancini ${s.name}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="border-t-2 border-foreground p-4">
                  <h3 className="font-display text-xl tracking-tight">{s.name}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HISTORIE ============ */}
      <section className="border-b-2 border-foreground bg-[color:var(--paper)]">
        <div className="mx-auto max-w-3xl px-6 py-20 md:px-8 md:py-28">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-foreground/60">
            Fra Sicilia til Oslo
          </p>
          <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] tracking-tight">
            Håndverk med røtter i Palermo.
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-foreground/85">
            Gold of Sicily startet som popup-konsept i Oslo med ett mål: å gjøre
            ekte sicilianske arancini tilgjengelig utenfor Italia. Etter å ha
            servert hundrevis av gjester og fått 4,5/5 i smak, har vi pakket
            håndverket inn i en løsning som lar utesteder servere det samme —
            uten kjøkken, uten kokk, uten kompleksitet.
          </p>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section id="book" className="bg-foreground text-background">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center md:px-8 md:py-32">
          <p className="eyebrow mb-6 text-[0.7rem] uppercase tracking-[0.28em] text-background/60">
            Klar for å teste?
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] tracking-tight">
            Vi kommer innom.
            <br />
            Vi lager maten.
            <br />
            <span className="text-[color:var(--golden)]">Dere smaker.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-lg text-background/75">
            Så finner vi ut om dette passer hos dere. Ingen forpliktelser.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:hello@goldofsicily.no?subject=Book%20smaking"
              className="inline-flex items-center gap-2.5 rounded-sm border-2 border-background bg-[color:var(--tomato)] px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.18em] text-background shadow-[4px_4px_0_0_var(--color-background)] transition hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0_0_var(--color-background)]"
            >
              Book smaking
            </a>
            <a
              href="mailto:hello@goldofsicily.no"
              className="text-[0.8rem] font-semibold uppercase tracking-[0.18em] text-background/80 underline-offset-4 hover:text-background hover:underline"
            >
              hello@goldofsicily.no →
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-background py-8 text-center text-xs uppercase tracking-[0.28em] text-foreground/50">
        © Gold of Sicily
      </footer>
    </main>
  );
}
