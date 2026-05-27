import type { ReactNode } from "react";

import arancini from "@/assets/arancini-watercolor.png";

type Copy = {
  altArancini: string;
  title: string;
  body: string;
  proof: string;
  ctaLabel: string;
  scrollLabel: string;
};

export function HomeHero({
  copy,
  newsletter,
}: {
  copy: Copy;
  newsletter?: ReactNode;
}) {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-5 pt-2 pb-12 md:px-8 md:pt-2 md:pb-6">
      {/* Paper grain + warm bottom gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-foreground/[0.07] via-foreground/[0.02] to-transparent md:h-56"
      />

      <div className="md:grid md:min-h-[calc(100svh-12rem)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-4 lg:gap-6">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <img
            src={arancini}
            alt={copy.altArancini}
            className="mx-auto mt-6 mb-6 block w-[70vw] max-w-[420px] object-contain md:hidden"
            width={1500}
            height={1000}
          />

          <h2 className="font-display text-[clamp(2rem,7vw,4rem)] leading-[1.05] tracking-tight md:text-[clamp(2.5rem,4.5vw,4.5rem)]">
            {copy.title}
          </h2>

          <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-foreground/75 md:text-lg">
            {copy.body}
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-background/60 px-4 py-2 text-[0.72rem] uppercase tracking-[0.22em] text-foreground/80 backdrop-blur-sm">
            <span aria-hidden className="text-[color:var(--tomato)]">★</span>
            <span>{copy.proof}</span>
          </div>

          {newsletter ? (
            <div className="mt-8 w-full max-w-sm">
              <p className="mb-2 text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
                {copy.ctaLabel}
              </p>
              {newsletter}
            </div>
          ) : null}

          <a
            href="#feedback"
            className="group mt-10 inline-flex items-center gap-3 rounded-full border border-foreground/70 bg-background/60 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <span>{copy.scrollLabel}</span>
            <span aria-hidden className="inline-block animate-bounce text-sm">↓</span>
          </a>
        </div>

        <img
          src={arancini}
          alt={copy.altArancini}
          className="hidden drop-shadow-[0_30px_40px_rgba(60,30,10,0.18)] md:-ml-6 md:mt-20 md:block md:h-auto md:w-[123%] md:max-w-none md:max-h-[82vh] md:object-contain lg:-ml-10 lg:mt-24 lg:w-[128%]"
          width={1500}
          height={1000}
        />
      </div>
    </section>
  );
}
