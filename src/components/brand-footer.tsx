import { Link } from "@tanstack/react-router";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";
import drawLemon from "@/assets/brand/draw-lemon.webp";

export function BrandFooter({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <footer className="relative overflow-hidden bg-[color:var(--sea)] font-display text-[#F3EBDD]">
      <img
        src={drawLemon}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-16 right-2 w-[min(48vw,18rem)] rotate-12 opacity-90 md:-bottom-20 md:right-8"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
        <Link to={t.paths.home} className="text-xl italic tracking-tight">
          Gold of Sicily
        </Link>
        <p className="mt-8 font-display text-4xl tracking-tight md:text-6xl">{t.footer.places}</p>
        <p className="mt-4 font-display text-xl italic md:text-2xl">{t.footer.line}</p>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="mt-10 inline-block text-xl italic underline-offset-4 hover:underline"
        >
          {t.footer.handle}
        </a>
      </div>
    </footer>
  );
}
