import { useEffect, useRef, useState } from "react";
import {
  PREFERRED_SOURCES_ENABLED,
  ensurePreferredSourcesScript,
  preferredSourcesDeeplink,
} from "@/lib/preferred-sources";

type Lang = "no" | "en";

type PreferredSourceClient = {
  init: (options: { theme?: "light" | "dark"; lang?: string }) => void;
  addPreferredSource: () => void;
};

type PreferredSourceQueue = Array<(client: PreferredSourceClient) => void> & {
  push: (fn: (client: PreferredSourceClient) => void) => number;
};

declare global {
  interface Window {
    PREFERRED_SOURCE?: PreferredSourceQueue;
  }
}

const COPY = {
  no: {
    label: "I Google-søk",
    action: "Legg til som foretrukket kilde",
  },
  en: {
    label: "In Google Search",
    action: "Add as Preferred Source",
  },
} as const;

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4 shrink-0">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function FallbackButton({ lang }: { lang: Lang }) {
  const clientRef = useRef<PreferredSourceClient | null>(null);
  const copy = COPY[lang];

  useEffect(() => {
    const queue = (window.PREFERRED_SOURCE =
      window.PREFERRED_SOURCE ||
      ([] as unknown as PreferredSourceQueue));
    queue.push((client) => {
      client.init({ theme: "light", lang: lang === "en" ? "en" : "no" });
      clientRef.current = client;
    });
  }, [lang]);

  function openPreferredSources() {
    if (clientRef.current) {
      clientRef.current.addPreferredSource();
      return;
    }
    window.open(preferredSourcesDeeplink(), "_blank", "noopener,noreferrer");
  }

  return (
    <button
      type="button"
      onClick={openPreferredSources}
      className="inline-flex items-center gap-2 rounded-md border border-black/10 bg-white px-3 py-2 text-left text-[13px] font-medium tracking-normal text-[#3c4043] shadow-sm transition hover:bg-[#f8f9fa]"
    >
      <GoogleMark />
      <span>{copy.action}</span>
    </button>
  );
}

export function PreferredSourcesBadge({ lang = "no" }: { lang?: Lang }) {
  if (!PREFERRED_SOURCES_ENABLED) return null;
  return <PreferredSourcesBadgeLive lang={lang} />;
}

function PreferredSourcesBadgeLive({ lang }: { lang: Lang }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [useFallback, setUseFallback] = useState(false);
  const copy = COPY[lang];
  const dataLang = lang === "en" ? "en" : "no";

  useEffect(() => {
    ensurePreferredSourcesScript();
    const timer = window.setTimeout(() => {
      const node = boxRef.current;
      if (node && node.childElementCount === 0) {
        setUseFallback(true);
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [lang]);

  return (
    <div className="flex flex-col items-center gap-2 normal-case tracking-normal">
      <p className="text-[0.62rem] uppercase tracking-[0.28em] text-foreground/55">{copy.label}</p>
      {useFallback ? (
        <FallbackButton lang={lang} />
      ) : (
        <div
          ref={boxRef}
          data-theme="light"
          data-lang={dataLang}
          {...{ "google-add-preferred-source-btn": "" }}
        />
      )}
      <noscript>
        <a
          href={preferredSourcesDeeplink()}
          className="text-foreground/70 underline underline-offset-4"
        >
          {copy.action}
        </a>
      </noscript>
    </div>
  );
}
