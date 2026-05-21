import { createFileRoute } from "@tanstack/react-router";
import arancini from "@/assets/arancini-watercolor.png";
import wordmark from "@/assets/arancini-wordmark.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arancini — Siciliansk streetfood" },
      {
        name: "description",
        content: "Sprø utenpå. Myk inni. Neste popup tirsdag 26. mai.",
      },
      { property: "og:title", content: "Arancini" },
      { property: "og:description", content: "Sprø utenpå. Myk inni." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* POSTER */}
      <section className="relative flex flex-col items-center px-4 pt-2 pb-16 md:pt-3 md:pb-20">
        <img
          src={wordmark}
          alt="Arancini"
          className="w-[110vw] max-w-[1100px] object-contain"
        />

        <img
          src={arancini}
          alt="Arancini på krøllet papir"
          className="-mt-4 mb-6 w-[88vw] max-w-[720px] object-contain"
          width={1500}
          height={1000}
        />

        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-[1] tracking-tight">
            Sprø utenpå.
          </p>
          <p className="mt-2 font-display text-[clamp(2rem,6vw,3.5rem)] italic leading-[1] tracking-tight">
            Myk inni.
          </p>
          <p className="mt-6 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            Italienske risballer med fyll
          </p>
        </div>
      </section>

      {/* NESTE POPUP */}
      <section className="border-t border-foreground/15 bg-background px-6 py-24 text-center md:py-32">
        <p className="eyebrow">Neste popup</p>
        <p className="mt-8 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1]">
          Tirsdag 26. mai
        </p>
        <p className="mt-6 font-display text-lg italic text-muted-foreground md:text-xl">
          18–20 · Sigurds gate 7
        </p>
        <p className="mt-10 text-sm text-muted-foreground">
          Når batchen er tom, er den tom.
        </p>

        <a
          href="https://www.instagram.com/goldofsicily/"
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[0.7rem] uppercase tracking-[0.28em] text-foreground transition hover:opacity-70"
        >
          Følg på Instagram
          <span aria-hidden>→</span>
        </a>
      </section>

      {/* FOOTER */}
      <footer className="px-6 pb-10 pt-4 text-center text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
        Oslo · Palermo
      </footer>
    </main>
  );
}
