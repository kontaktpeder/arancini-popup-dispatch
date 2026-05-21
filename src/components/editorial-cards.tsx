import { Link } from "@tanstack/react-router";
import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function EditorialCards({ copy }: { copy: DiscoveryCopy["editorial"] }) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
      <p className="eyebrow text-center">{copy.eyebrow}</p>

      <ul className="mt-10 flex flex-col gap-12 md:mt-12 md:grid md:grid-cols-3 md:gap-8">
        {copy.cards.map((card) => (
          <li key={card.to} className="group flex flex-col">
            <Link to={card.to} className="block">
              <h2 className="font-display text-lg leading-tight tracking-tight text-foreground md:text-2xl">
                {card.title}
              </h2>
              <p className="mt-2 font-sans text-[0.85rem] leading-snug text-foreground/55 md:text-sm">
                {card.description}
              </p>
              <span className="mt-4 inline-block text-[0.7rem] uppercase tracking-[0.28em] text-foreground/70 transition group-hover:text-foreground">
                {card.cta} <span aria-hidden>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
