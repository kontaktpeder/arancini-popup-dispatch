import arancini from "@/assets/arancini-watercolor.png";
import wordmark from "@/assets/arancini-wordmark.png";
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
      <section className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-2 pb-20 md:h-[100svh] md:max-h-[1100px] md:min-h-[640px] md:justify-center md:gap-2 md:px-4 md:py-6 md:pb-10">
        <img
          src={wordmark}
          alt="Gold of Sicily"
          className="mx-auto block w-full max-w-[560px] object-contain md:h-[22vh] md:w-auto md:max-w-[760px]"
        />

        <img
          src={arancini}
          alt={copy.altArancini}
          className="mx-auto mt-2 mb-8 block w-[82vw] max-w-[560px] object-contain md:m-0 md:h-[42vh] md:w-auto md:max-w-[520px]"
          width={1500}
          height={1000}
        />


        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[clamp(2rem,7vw,3.25rem)] leading-[1] tracking-tight md:text-[clamp(2rem,4.2vw,3.75rem)]">
            {copy.tagTop}
          </p>
          <p className="mt-2 font-display text-[clamp(2rem,7vw,3.25rem)] italic leading-[1] tracking-tight md:text-[clamp(2rem,4.2vw,3.75rem)]">
            {copy.tagBottom}
          </p>
          <p className="mt-8 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground md:mt-4">
            {copy.subtitle}
          </p>
        </div>
      </section>


      <section className="border-t border-foreground/15 bg-background px-6 py-24 text-center md:py-32">
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

      <footer className="px-6 pb-10 pt-4 text-center text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
        Oslo · Palermo
      </footer>
    </>
  );
}
