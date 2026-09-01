import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import photoHero from "@/assets/brand/photo-hero-bar.jpg";
import photoGold from "@/assets/brand/photo-the-gold.jpg";
import photoHands from "@/assets/brand/photo-hands.jpg";
import drawBite from "@/assets/brand/draw-arancini-bite.webp";
import drawLemonGold from "@/assets/brand/draw-lemon-gold.webp";

export function BrandHome({ lang }: { lang: BrandLang }) {
  const t = BRAND[lang];

  return (
    <div className="bg-[color:var(--cream)] text-foreground">
      <BrandNav lang={lang} tone="overlay" />

      <section className="relative min-h-[100svh] overflow-hidden bg-foreground text-[#F3EBDD]">
        <img
          src={photoHero}
          alt={t.same.photoAlt}
          className="ken-burns absolute inset-0 h-full w-full object-cover object-[center_35%]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
        />

        <div className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-12 pt-24 md:justify-center md:px-12 md:pb-20 lg:px-16">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#F3EBDD]/80">
            {t.hero.brand}
          </p>
          <h1 className="mt-5 font-display text-[clamp(3rem,12vw,7.5rem)] leading-[0.92] tracking-tight text-[#F3EBDD]">
            <span className="block">{t.hero.line1}</span>
            <span className="block">{t.hero.line2}</span>
          </h1>
          <p className="mt-6 max-w-sm whitespace-pre-line text-[0.95rem] leading-relaxed text-[#F3EBDD]/85 md:text-lg">
            {t.hero.sub}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a href="#find-gold" className="btn-gold btn-gold-solid">
              {t.hero.find}
            </a>
            <Link to={t.paths.venues} className="btn-gold btn-gold-ghost">
              {t.hero.venues}
            </Link>
          </div>
        </div>
      </section>

      <section
        id="the-gold"
        className="relative overflow-hidden px-5 py-20 md:px-12 md:py-28 lg:px-16"
      >
        <img
          src={drawBite}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-16 bottom-4 w-[min(46vw,18rem)] opacity-95 md:bottom-8 md:w-[min(32vw,20rem)]"
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
              {t.gold.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.9] tracking-tight">
              {t.gold.title}
            </h2>
            <p className="mt-6 max-w-xs whitespace-pre-line text-lg leading-snug text-foreground/75 md:text-xl">
              {t.gold.body}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {t.gold.flavors.map((flavor) => (
                <li key={flavor} className="font-display text-2xl tracking-tight md:text-3xl">
                  {flavor}
                </li>
              ))}
            </ul>
            <Link
              to={t.paths.arancini}
              className="mt-10 inline-block text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-4 hover:underline"
            >
              {t.gold.cta} →
            </Link>
          </div>
          <img
            src={photoGold}
            alt={t.gold.photoAlt}
            className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
          />
        </div>
      </section>

      <section className="bg-[color:var(--espresso)] text-[#F3EBDD]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 md:px-12 md:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-16">
          <img
            src={photoHands}
            alt={t.world.photoAlt}
            className="aspect-[3/4] w-full object-cover object-center md:aspect-[4/5] lg:max-h-[82vh]"
          />
          <div>
            <h2 className="font-display text-[clamp(2.4rem,6vw,4.4rem)] leading-[0.95] tracking-tight text-[#F3EBDD]">
              {t.world.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-8 max-w-md whitespace-pre-line text-base leading-relaxed text-[#F3EBDD]/75 md:text-lg">
              {t.world.body}
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-foreground/10 bg-[color:var(--cream)] py-3">
        <div className="marquee-track flex w-max gap-10 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/45">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-10 pr-10">
              <span>Tutto passa</span>
              <span>Stay a little longer</span>
              <span>Gold of Sicily</span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative overflow-hidden bg-[color:var(--sea)] text-[#F3EBDD]">
        <img
          src={drawLemonGold}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-10 w-[min(80vw,32rem)] rotate-[-8deg] md:-right-16 md:w-[min(50vw,36rem)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-28 md:px-12 md:py-40">
          <h2 className="font-display text-[clamp(3rem,12vw,7rem)] leading-[0.9] tracking-tight text-[#F3EBDD]">
            {t.tutto.title}
          </h2>
          <p className="mt-8 max-w-sm whitespace-pre-line text-lg leading-relaxed text-[#F3EBDD]/85 md:text-xl">
            {t.tutto.body}
          </p>
        </div>
      </section>

      <section className="relative min-h-[70svh] overflow-hidden text-[#F3EBDD]">
        <img
          src={photoHero}
          alt={t.same.photoAlt}
          className="absolute inset-0 h-full w-full object-cover object-[center_60%]"
        />
        <div aria-hidden className="absolute inset-0 bg-black/55" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-5xl flex-col justify-end px-5 py-16 md:justify-center md:px-12 md:py-24">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-[#F3EBDD]/70">
            {t.same.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] tracking-tight text-[#F3EBDD]">
            {t.same.title}
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-[#F3EBDD]/85 md:text-lg">
            {t.same.body}
          </p>
        </div>
      </section>

      <section id="find-gold" className="scroll-mt-20 px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
            {t.find.title}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
            {t.find.body}
          </h2>
          <div className="mt-12">
            <FindGoldGrid lang={lang} compact />
          </div>
        </div>
      </section>

      <section
        id="serve-gold"
        className="scroll-mt-20 bg-[color:var(--paper)] px-5 py-20 md:px-12 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
            {t.serve.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-tight">
            {t.serve.title}
          </h2>
          <ul className="mt-10 flex flex-col gap-3 md:mt-14">
            {t.serve.items.map((item) => (
              <li
                key={item}
                className="border-t border-foreground/15 pt-3 font-display text-2xl tracking-tight md:text-3xl"
              >
                {item}
              </li>
            ))}
          </ul>
          <Link
            to={t.paths.venues}
            className="mt-12 inline-block text-[0.78rem] font-medium uppercase tracking-[0.2em] underline-offset-4 hover:underline"
          >
            {t.serve.cta} →
          </Link>
        </div>
      </section>

      <BrandFooter lang={lang} />
    </div>
  );
}
