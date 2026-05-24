type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  microNote: string;
  cta: string;
  qrLabel: string;
  stats: { value: string; label: string }[];
  formTitle: string;
};

const TALLY_URL = "https://tally.so/r/WOjDQN";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&color=1a1714&bgcolor=f5efe3&data=${encodeURIComponent(
  TALLY_URL,
)}`;

export function FeedbackSection({ copy }: { copy: Copy }) {
  return (
    <section
      id="feedback"
      className="relative overflow-hidden bg-[#f5efe3] text-[#1a1714]"
    >
      <div className="relative mx-auto w-full max-w-5xl px-5 py-16 md:px-8 md:py-24">
        {/* ticker bar */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#1a1714]/15 py-3 text-[0.65rem] uppercase tracking-[0.32em] text-[#1a1714]/65 md:text-[0.7rem]">
          {copy.stats.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#c9551f]" />
              <span className="text-[#1a1714]">{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-16">
          {/* editorial copy */}
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#c9551f]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-5 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.04] tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#1a1714]/75 md:text-lg">
              {copy.body}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a
                href={TALLY_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#1a1714] px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.28em] text-[#f5efe3] transition hover:bg-[#c9551f]"
              >
                <span>{copy.cta}</span>
                <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </a>
              <span className="text-[0.7rem] uppercase tracking-[0.28em] text-[#1a1714]/55">
                {copy.microNote}
              </span>
            </div>
          </div>

          {/* QR card */}
          <div className="flex items-center gap-5 md:justify-end">
            <div className="rounded-md border border-[#1a1714]/15 bg-[#f5efe3] p-3">
              <img
                src={QR_SRC}
                alt={copy.qrLabel}
                className="h-28 w-28 md:h-32 md:w-32"
                width={320}
                height={320}
              />
            </div>
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[#1a1714]/55">
                {copy.qrLabel}
              </p>
              <p className="mt-2 font-display text-lg italic text-[#1a1714]/85">
                tally.so/r/WOjDQN
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
