import type { ReactNode } from "react";

import { Countdown } from "@/components/countdown";

type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  dateLabel?: string;
  timeLabel?: string;
  addressLabel?: string;
  mapsGoogle?: string;
  mapsApple?: string;
  countdownTarget?: string;
  countdownLabels?: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    live: string;
  };
};

export function NextBatch({ copy, newsletter }: { copy: Copy; newsletter?: ReactNode }) {
  const hasDetails = copy.dateLabel || copy.addressLabel;
  return (
    <section id="next-popup" className="border-t border-foreground/15 bg-background px-6 py-16 text-center md:py-24">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 className="mt-6 font-display text-[clamp(2.25rem,7vw,4rem)] italic leading-[1.05] tracking-tight">
        {copy.title}
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-foreground/70 md:text-base">
        {copy.body}
      </p>

      {hasDetails ? (
        <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2 text-sm text-foreground/80">
          {copy.dateLabel ? (
            <p className="font-display text-[clamp(1.25rem,3.5vw,1.75rem)] italic leading-tight">
              {copy.dateLabel}
              {copy.timeLabel ? ` · ${copy.timeLabel}` : ""}
            </p>
          ) : null}
          {copy.addressLabel ? (
            copy.mapsGoogle ? (
              <a
                href={copy.mapsGoogle}
                onClick={(e) => {
                  if (
                    copy.mapsApple &&
                    typeof navigator !== "undefined" &&
                    /iPhone|iPad|iPod|Macintosh/.test(navigator.userAgent)
                  ) {
                    e.preventDefault();
                    window.location.href = copy.mapsApple;
                  }
                }}
                target="_blank"
                rel="noreferrer"
                className="font-display text-lg italic text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                {copy.addressLabel}
              </a>
            ) : (
              <p className="font-display text-lg italic text-muted-foreground">
                {copy.addressLabel}
              </p>
            )
          ) : null}
        </div>
      ) : null}

      {copy.countdownTarget && copy.countdownLabels ? (
        <Countdown target={copy.countdownTarget} labels={copy.countdownLabels} />
      ) : null}

      {newsletter ? (
        <div className="mx-auto mt-8 flex max-w-sm justify-center">{newsletter}</div>
      ) : null}
    </section>
  );
}
