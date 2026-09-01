import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import { SITE } from "@/lib/site";
import drawLemonGold from "@/assets/brand/draw-lemon-gold.webp";

export function AboutView({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <BrandNav lang={lang} />
      <article className="relative overflow-hidden">
        <img
          src={drawLemonGold}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-20 top-10 w-[min(50vw,20rem)] opacity-80"
        />
        <div className="relative mx-auto max-w-3xl px-5 py-16 md:px-8 md:py-24">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
            {t.about.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,8vw,5.2rem)] leading-[0.95] tracking-tight">
            {t.about.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>

          <div className="mt-12 flex flex-col gap-6 text-lg leading-relaxed text-foreground/80 md:text-xl">
            {t.about.manifesto.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <h2 className="mt-20 font-display text-3xl tracking-tight md:text-4xl">
            {t.about.storyHeading}
          </h2>
          <div className="mt-6 flex flex-col gap-5 text-base leading-relaxed text-foreground/75 md:text-lg">
            {t.about.story.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <p className="mt-8 text-[0.72rem] uppercase tracking-[0.2em] text-foreground/50">
            {t.about.proof}
          </p>

          <p className="mt-14 flex flex-wrap gap-x-6 gap-y-3 text-[0.72rem] font-medium uppercase tracking-[0.2em]">
            <Link to={t.paths.find} className="underline-offset-4 hover:underline">
              {t.about.ctaFind} →
            </Link>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              {t.about.ctaIg} →
            </a>
          </p>
        </div>
      </article>
      <BrandFooter lang={lang} />
    </div>
  );
}
