type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  microNote: string;
  cta: string;
  qrLabel?: string;
  stats?: { value: string; label: string }[];
  formTitle?: string;
};

const DEFAULT_TALLY_URL = "https://tally.so/r/WOjDQN";

export function FeedbackSection({ copy, tallyUrl = DEFAULT_TALLY_URL }: { copy: Copy; tallyUrl?: string }) {
  return (
    <section
      id="feedback"
      className="relative bg-[#f5efe3] text-[#1a1714]"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-16 text-center md:py-24">
        <p className="text-[0.65rem] uppercase tracking-[0.4em] text-[#c9551f] md:text-[0.7rem]">
          {copy.eyebrow}
        </p>
        <h2 className="mt-4 font-display text-[clamp(2rem,8vw,3.4rem)] leading-[1.05] tracking-tight">
          {copy.title}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#1a1714]/75 md:text-lg">
          {copy.body}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={TALLY_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#1a1714] px-8 py-4 text-[0.8rem] font-medium uppercase tracking-[0.28em] text-[#f5efe3] transition hover:bg-[#c9551f]"
          >
            <span>{copy.cta}</span>
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </a>
          <span className="text-[0.65rem] uppercase tracking-[0.28em] text-[#1a1714]/55">
            {copy.microNote}
          </span>
        </div>
      </div>
    </section>
  );
}
