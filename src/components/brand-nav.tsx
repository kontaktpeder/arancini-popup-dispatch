import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { counterpartPath } from "@/components/lang-switch";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";

type Props = {
  lang: BrandLang;
  tone?: "overlay" | "solid";
};

export function BrandNav({ lang, tone = "solid" }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const t = BRAND[lang];
  const overlay = tone === "overlay" && !open;
  const text = overlay ? "text-[#F3EBDD]" : "text-foreground";

  const links = [
    { label: t.nav.arancini, to: t.paths.arancini },
    { label: t.nav.find, to: t.paths.find },
    { label: t.nav.about, to: t.paths.about },
    { label: t.nav.venues, to: t.paths.venues },
  ] as const;

  const switchTo = lang === "no" ? "EN" : "NO";
  const switchHref = counterpartPath(lang, pathname);
  const switchLabel = lang === "no" ? "Switch to English" : "Bytt til norsk";

  return (
    <header
      className={`z-[90] ${
        open
          ? "fixed inset-x-0 top-0 bg-[color:var(--cream)]"
          : tone === "overlay"
            ? "absolute inset-x-0 top-0"
            : "sticky top-0 bg-[color:var(--cream)]"
      }`}
    >
      <div className="relative z-[80] mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8 md:py-5">
        <Link
          to={t.paths.home}
          className={`font-sans text-[0.68rem] font-medium uppercase tracking-[0.28em] ${text}`}
        >
          Gold of Sicily
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-[0.68rem] font-medium uppercase tracking-[0.2em] transition hover:opacity-70 ${text}`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className={`transition hover:opacity-70 ${text}`}
          >
            <Instagram className="h-4 w-4" />
          </a>
          <Link
            to={switchHref}
            aria-label={switchLabel}
            className={`text-[0.62rem] font-medium uppercase tracking-[0.18em] opacity-70 transition hover:opacity-100 ${text}`}
          >
            {switchTo}
          </Link>
        </nav>

        <button
          type="button"
          className={`inline-flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.22em] lg:hidden ${text}`}
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? t.nav.close : t.nav.menu}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-[color:var(--cream)] px-5 pb-12 pt-24 lg:hidden">
          <nav className="flex flex-col gap-5">
            {links.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="font-display text-3xl tracking-tight text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-5">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-foreground"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <Link
                to={switchHref}
                aria-label={switchLabel}
                className="text-[0.7rem] uppercase tracking-[0.2em] text-foreground/70"
                onClick={() => setOpen(false)}
              >
                {switchTo}
              </Link>
            </div>
          </nav>
        </div>
      ) : null}

      {tone === "solid" ? <div className="border-b border-foreground/15" /> : null}
    </header>
  );
}
