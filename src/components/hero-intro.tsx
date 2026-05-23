import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function HeroIntro({ copy }: { copy: DiscoveryCopy["heroIntro"] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-8 pb-2 text-center md:pt-10 md:pb-0">
      {copy.eyebrow ? <p className="eyebrow">{copy.eyebrow}</p> : null}
      <p className="font-sans text-[0.65rem] uppercase tracking-[0.32em] text-foreground/45 md:text-[0.7rem]">
        {copy.body}
      </p>
    </section>
  );
}

