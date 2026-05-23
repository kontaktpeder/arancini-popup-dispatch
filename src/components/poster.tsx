import arancini from "@/assets/arancini-watercolor.png";

import { Countdown } from "@/components/countdown";

type Copy = {
  altArancini: string;
  tagTop: string;
  tagBottom: string;
  subtitle: string;
  nextLabel: string;
  date: string;
  address: string;
  scarcity: string;
  follow: string;
  countdownTarget: string;
  countdownLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    live: string;
  };
};


export function Poster({ copy }: { copy: Copy }) {
  return (
    <>
      <section className="relative mx-auto w-full max-w-6xl px-5 pt-2 pb-12 md:px-8 md:pt-2 md:pb-6">
        {/* Subtle paper grain + warm bottom gradient to "ground" the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.25  0 0 0 0 0.18  0 0 0 0 0.12  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-foreground/[0.07] via-foreground/[0.02] to-transparent md:h-56"
        />

        <div className="md:grid md:min-h-[calc(100svh-12rem)] md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-4 lg:gap-6">
          {/* Left column: taglines + subtitle + scroll hint */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            {/* Arancini image — mobile only, between logo and tags */}
            <img
              src={arancini}
              alt={copy.altArancini}
              className="mx-auto mt-6 mb-6 block w-[70vw] max-w-[420px] object-contain md:hidden"
              width={1500}
              height={1000}
            />

            <p className="font-display text-[clamp(2rem,7vw,4rem)] leading-[1.05] tracking-tight md:text-[clamp(2.5rem,4.5vw,4.5rem)]">
              {copy.tagTop}
            </p>
            <p className="mt-1 font-display text-[clamp(2rem,7vw,4rem)] italic leading-[1.05] tracking-tight md:text-[clamp(2.5rem,4.5vw,4.5rem)]">
              {copy.tagBottom}
            </p>

            <div className="mt-8 h-px w-24 bg-foreground/30 md:mt-10" />

            <p className="mt-6 text-[0.7rem] uppercase leading-[1.8] tracking-[0.28em] text-muted-foreground">
              {copy.subtitle}
            </p>

            {/* Scroll hint — stronger, framed pill */}
            <a
              href="#next-popup"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-foreground/70 bg-background/60 px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-foreground shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-sm transition hover:border-foreground hover:bg-foreground hover:text-background"
            >
              <span>{copy.nextLabel}</span>
              <span aria-hidden className="inline-block translate-y-0 animate-bounce text-sm">↓</span>
            </a>
          </div>

          {/* Right column: arancini image — closer to text, slightly lower & larger */}
          <img
            src={arancini}
            alt={copy.altArancini}
            className="hidden drop-shadow-[0_30px_40px_rgba(60,30,10,0.18)] md:-ml-6 md:mt-10 md:block md:h-auto md:w-[115%] md:max-w-none md:max-h-[80vh] md:object-contain lg:-ml-10 lg:w-[120%]"
            width={1500}
            height={1000}
          />
        </div>
      </section>


      <section id="next-popup" className="border-t border-foreground/15 bg-background px-6 py-16 text-center md:py-32">


        <p className="eyebrow">{copy.nextLabel}</p>
        <p className="mt-8 font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1]">
          {copy.date}
        </p>
        <Countdown target={copy.countdownTarget} labels={copy.countdownLabels} />

        <a
          href="https://www.google.com/maps/search/?api=1&query=Sigurds+gate+7%2C+Oslo"
          onClick={(e) => {
            if (
              typeof navigator !== "undefined" &&
              /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
            ) {
              e.preventDefault();
              window.location.href = "maps://?q=Sigurds+gate+7,+Oslo";
            }
          }}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block font-display text-lg italic text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline md:text-xl"
        >
          {copy.address}
        </a>

        <p className="mt-10 text-sm text-muted-foreground">{copy.scarcity}</p>

        <a
          href="https://www.instagram.com/goldofsicily/"
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[0.7rem] uppercase tracking-[0.28em] text-foreground transition hover:opacity-70"
        >
          {copy.follow}
          <span aria-hidden>→</span>
        </a>
      </section>

    </>
  );
}
