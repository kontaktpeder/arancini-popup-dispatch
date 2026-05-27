type Copy = {
  eyebrow: string;
  title: string;
  quotes: string[];
};

export function Testimonials({ copy }: { copy: Copy }) {
  return (
    <section
      id="feedback"
      className="border-t border-foreground/15 bg-background px-6 py-16 md:py-24"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] leading-[1.05] tracking-tight">
            {copy.title}
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {copy.quotes.map((quote, i) => (
            <li
              key={i}
              className="relative rounded-md border border-foreground/10 bg-card p-6 text-card-foreground shadow-[0_1px_0_rgba(0,0,0,0.03)]"
            >
              <span
                aria-hidden
                className="absolute -top-3 left-5 font-display text-4xl leading-none text-[color:var(--tomato)]"
              >
                “
              </span>
              <p className="font-display text-[1.05rem] italic leading-snug text-foreground/85 md:text-[1.15rem]">
                {quote}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
