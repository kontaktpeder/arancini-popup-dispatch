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
const TALLY_EMBED = `https://tally.so/embed/WOjDQN?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=0&color=F5EFE3&bgcolor=0D0B09&data=${encodeURIComponent(
  TALLY_URL,
)}`;

export function FeedbackSection({ copy }: { copy: Copy }) {
  return (
    <section
      id="feedback"
      className="relative overflow-hidden bg-[#0d0b09] text-[#f5efe3]"
    >
      {/* grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 0.95  0 0 0 0 0.85  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
        }}
      />
      {/* warm vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 -z-0 h-[420px] w-[420px] rounded-full bg-[#c9551f]/20 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-0 -z-0 h-[360px] w-[360px] rounded-full bg-[#e8b84a]/15 blur-[120px]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-20 md:px-8 md:py-28">
        {/* ticker bar */}
        <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-[#f5efe3]/15 py-3 text-[0.65rem] uppercase tracking-[0.32em] text-[#f5efe3]/70 md:text-[0.7rem]">
          {copy.stats.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e85d3a]" />
              <span className="text-[#f5efe3]">{s.value}</span>
              <span>{s.label}</span>
            </span>
          ))}
        </div>

        <div className="grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-16 md:items-start">
          {/* Left: editorial copy */}
          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.4em] text-[#e8b84a]">
              {copy.eyebrow}
            </p>
            <h2 className="mt-6 font-display text-[clamp(2.4rem,6.5vw,4.5rem)] leading-[1.02] tracking-tight">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-[#f5efe3]/75 md:text-lg">
              {copy.body}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-5">
              <a
                href={TALLY_URL}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-[#f5efe3] px-6 py-3 text-[0.75rem] font-medium uppercase tracking-[0.28em] text-[#0d0b09] transition hover:bg-[#e8b84a]"
              >
                <span>{copy.cta}</span>
                <span aria-hidden className="transition group-hover:translate-x-1">→</span>
              </a>
              <span className="text-[0.7rem] uppercase tracking-[0.28em] text-[#f5efe3]/55">
                {copy.microNote}
              </span>
            </div>

            {/* QR card */}
            <div className="mt-12 hidden items-center gap-5 md:flex">
              <div className="rounded-md border border-[#f5efe3]/15 bg-[#0d0b09] p-3">
                <img
                  src={QR_SRC}
                  alt={copy.qrLabel}
                  className="h-28 w-28"
                  width={320}
                  height={320}
                />
              </div>
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[#f5efe3]/55">
                  {copy.qrLabel}
                </p>
                <p className="mt-2 font-display text-xl italic text-[#f5efe3]/85">
                  tally.so/r/WOjDQN
                </p>
              </div>
            </div>
          </div>

          {/* Right: embedded form */}
          <div className="relative">
            <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-2 rounded-full border border-[#f5efe3]/20 bg-[#0d0b09] px-3 py-1 text-[0.6rem] uppercase tracking-[0.32em] text-[#e8b84a]">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#e85d3a]" />
              {copy.formTitle}
            </div>
            <div className="rounded-lg border border-[#f5efe3]/15 bg-[#13100d] p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] md:p-5">
              <iframe
                src={TALLY_EMBED}
                title={copy.formTitle}
                loading="lazy"
                width="100%"
                height="560"
                frameBorder={0}
                marginHeight={0}
                marginWidth={0}
                className="block w-full"
                style={{ colorScheme: "dark" }}
              />
            </div>

            {/* QR — mobile under form */}
            <div className="mt-8 flex items-center gap-4 md:hidden">
              <div className="rounded-md border border-[#f5efe3]/15 bg-[#0d0b09] p-2">
                <img
                  src={QR_SRC}
                  alt={copy.qrLabel}
                  className="h-20 w-20"
                  width={320}
                  height={320}
                />
              </div>
              <p className="text-[0.65rem] uppercase tracking-[0.32em] text-[#f5efe3]/55">
                {copy.qrLabel}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
