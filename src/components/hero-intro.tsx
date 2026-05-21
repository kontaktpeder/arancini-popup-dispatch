import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function HeroIntro({ copy }: { copy: DiscoveryCopy["heroIntro"] }) {
  return (
    <section className="mx-auto max-w-2xl px-6 pt-16 pb-4 text-center md:pt-24">
      <p className="eyebrow">{copy.eyebrow}</p>
      <p className="mt-5 font-display text-[clamp(1.25rem,2.6vw,1.65rem)] leading-snug text-foreground/80">
        {copy.body}
      </p>
    </section>
  );
}
