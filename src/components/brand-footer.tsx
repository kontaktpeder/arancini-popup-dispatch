import { Link } from "@tanstack/react-router";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";
import drawLemon from "@/assets/brand/draw-lemon.webp";

export function BrandFooter({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <footer className="relative overflow-hidden bg-[color:var(--sea)] text-[#F3EBDD]">
      <img
        src={drawLemon}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-20 w-[min(55vw,22rem)] rotate-12 opacity-90"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link
          to={t.paths.home}
          className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.32em]"
        >
          Gold of Sicily
        </Link>
        <p className="mt-8 font-display text-4xl tracking-tight md:text-6xl">{t.footer.places}</p>
        <p className="mt-4 font-display text-xl italic md:text-2xl">{t.footer.line}</p>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-[0.72rem] uppercase tracking-[0.22em] underline-offset-4 hover:underline"
        >
          {t.footer.handle}
        </a>
      </div>
    </footer>
  );
}
