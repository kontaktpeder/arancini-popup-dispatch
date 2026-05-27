import { Instagram } from "lucide-react";
import { SITE } from "@/lib/site";

const TIKTOK_URL = "https://www.tiktok.com/@goldofsicily";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.66a8.16 8.16 0 0 0 4.77 1.52V6.74a4.85 4.85 0 0 1-1.84-.05z" />
    </svg>
  );
}

export function SocialFollow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 pb-10">
      <span className="text-[0.62rem] uppercase tracking-[0.28em] text-foreground/55">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-foreground transition hover:bg-foreground hover:text-background"
        >
          <Instagram className="h-4 w-4" />
        </a>
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="TikTok"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-foreground transition hover:bg-foreground hover:text-background"
        >
          <TikTokIcon className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
