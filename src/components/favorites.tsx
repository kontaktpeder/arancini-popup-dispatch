type Favorite = { name: string; votes: number; voteLabel: string };

type Copy = {
  eyebrow: string;
  title: string;
  items: Favorite[];
};

export function Favorites({ copy }: { copy: Copy }) {
  const max = Math.max(...copy.items.map((i) => i.votes));

  return (
    <section className="border-t border-foreground/15 bg-[#f5efe3] px-6 py-16 text-[#1a1714] md:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-[0.62rem] uppercase tracking-[0.28em] text-[#1a1714]/55">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-[clamp(2rem,6vw,3rem)] leading-[1.05] tracking-tight">
            {copy.title}
          </h2>
        </div>

        <ol className="mt-10 flex flex-col gap-5">
          {copy.items.map((item, i) => (
            <li key={item.name} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-2xl text-[#1a1714]/40 md:text-3xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-xl tracking-tight md:text-2xl">
                    {item.name}
                  </span>
                </div>
                <span className="text-[0.7rem] uppercase tracking-[0.22em] text-[#1a1714]/60">
                  {item.votes} {item.voteLabel}
                </span>
              </div>
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-[#1a1714]/10">
                <div
                  className="h-full rounded-full bg-[#c9551f]"
                  style={{ width: `${(item.votes / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
