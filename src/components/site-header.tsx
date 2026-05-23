import wordmark from "@/assets/arancini-wordmark.png";

export function SiteHeader({ tagline }: { tagline?: string }) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-5 pt-3 md:px-8 md:pt-5">
      <img
        src={wordmark}
        alt="Gold of Sicily"
        className="block h-auto w-[180px] object-contain md:w-[260px] lg:w-[300px]"
      />
      {tagline ? (
        <p className="mb-2 hidden flex-1 pr-16 text-right font-sans text-[0.78rem] uppercase tracking-[0.16em] text-foreground/80 md:block md:text-[0.82rem]">
          {tagline}
        </p>

      ) : null}
    </header>

  );
}
