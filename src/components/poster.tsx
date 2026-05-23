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


        <div className="md:grid md:min-h-[calc(100svh-12rem)] md:grid-cols-2 md:items-center md:gap-10">
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

            {/* Scroll hint replaces CTA */}
            <a
              href="#next-popup"
              className="group mt-10 inline-flex flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.32em] text-muted-foreground transition hover:text-foreground md:flex-row md:gap-3"
            >
              <span>{copy.nextLabel}</span>
              <span aria-hidden className="animate-bounce text-base md:rotate-0">↓</span>
            </a>
          </div>

          {/* Right column: arancini image */}
          <img
            src={arancini}
            alt={copy.altArancini}
            className="hidden md:block md:h-auto md:w-full md:max-h-[68vh] md:object-contain"
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
