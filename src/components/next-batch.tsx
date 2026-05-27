import type { ReactNode } from "react";

type Copy = {
  eyebrow: string;
  title: string;
  body: string;
};

export function NextBatch({ copy, newsletter }: { copy: Copy; newsletter?: ReactNode }) {
  return (
    <section className="border-t border-foreground/15 bg-background px-6 py-16 text-center md:py-24">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 className="mt-6 font-display text-[clamp(2.25rem,7vw,4rem)] italic leading-[1.05] tracking-tight">
        {copy.title}
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-foreground/70 md:text-base">
        {copy.body}
      </p>
      {newsletter ? (
        <div className="mx-auto mt-8 flex max-w-sm justify-center">{newsletter}</div>
      ) : null}
    </section>
  );
}
