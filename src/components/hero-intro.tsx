import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function HeroIntro({ copy }: { copy: DiscoveryCopy["heroIntro"] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-10 pb-6 text-center md:pt-24 md:pb-2">
      {copy.eyebrow ? <p className="eyebrow">{copy.eyebrow}</p> : null}
      <p className="font-display italic text-[clamp(1.35rem,3vw,1.9rem)] leading-snug tracking-tight text-foreground/85">
        {copy.body}
      </p>
    </section>
  );
}
