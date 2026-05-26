import type { ReactNode } from "react";
import { Instagram } from "lucide-react";
import { SITE } from "@/lib/site";

const TIKTOK_URL =
  "https://www.tiktok.com/@goldofsicily";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.74a4.85 4.85 0 0 1-1.84-.05z" />
    </svg>
  );
}


type Copy = {
  eyebrow: string;
  title: string;
  body: string;
  microNote: string;
  cta: string;
  qrLabel?: string;
  stats?: { value: string; label: string }[];
  formTitle?: string;
  followLabel?: string;
};


const DEFAULT_TALLY_URL = "https://tally.so/r/WOjDQN";

export function FeedbackSection({
  copy,
  tallyUrl = DEFAULT_TALLY_URL,
  newsletter,
}: {
  copy: Copy;
  tallyUrl?: string;
  newsletter?: ReactNode;
}) {
  return (
    <section
      id="feedback"
      className="relative bg-[#f5efe3] text-[#1a1714]"
    >
      <div className="mx-auto w-full max-w-2xl px-5 py-16 text-center md:py-24">

        <h2 className="mt-4 font-display text-[clamp(2rem,8vw,3.4rem)] leading-[1.05] tracking-tight">
          {copy.title}
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-[#1a1714]/75 md:text-lg">
          {copy.body}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href={tallyUrl}
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

        {newsletter ? (
          <div className="mt-10 flex justify-center border-t border-[#1a1714]/10 pt-8">
            <div className="w-full max-w-sm text-left">{newsletter}</div>
          </div>
        ) : null}

        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="text-[0.62rem] uppercase tracking-[0.28em] text-[#1a1714]/55">
            {copy.followLabel ?? "Følg oss"}
          </span>
          <div className="flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1714]/20 text-[#1a1714] transition hover:bg-[#1a1714] hover:text-[#f5efe3]"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1a1714]/20 text-[#1a1714] transition hover:bg-[#1a1714] hover:text-[#f5efe3]"
            >
              <TikTokIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
