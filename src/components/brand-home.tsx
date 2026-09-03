import { Link } from "@tanstack/react-router";
import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { FindGoldGrid } from "@/components/find-gold-grid";
import { BRAND, type BrandLang } from "@/lib/brand-copy";
import type { PublicVenue } from "@/lib/portal-venues";
import photoHero from "@/assets/brand/photo-hero-bar.jpg";
import photoGold from "@/assets/brand/photo-the-gold.jpg";
import photoHands from "@/assets/brand/photo-hands.jpg";
import drawBite from "@/assets/brand/draw-arancini-bite.webp";
import drawEspresso from "@/assets/brand/draw-espresso.webp";
import drawVespa from "@/assets/brand/draw-vespa.webp";

export function BrandHome({ lang, venues }: { lang: BrandLang; venues: PublicVenue[] }) {
  const t = BRAND[lang];

  return (
    <div className="bg-[color:var(--cream)] font-display text-foreground">
      <BrandNav lang={lang} />

      <section className="px-5 pb-16 pt-8 md:px-12 md:pb-24 md:pt-12 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.hero.brand}</p>
            <h1 className="mt-4 font-display text-[clamp(3rem,10vw,6.6rem)] leading-[0.9] tracking-tight">
              <span className="block">{t.hero.line1}</span>
              <span className="block">{t.hero.line2}</span>
            </h1>
            <p className="mt-6 max-w-sm whitespace-pre-line text-xl leading-snug text-foreground/80 md:text-2xl">
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
          <img
            src={photoHero}
            alt={t.same.photoAlt}
            className="aspect-[4/5] w-full object-cover object-[center_40%] md:aspect-[5/6]"
          />
        </div>
      </section>

      <section id="the-gold" className="px-5 py-20 md:px-12 md:py-28 lg:px-16 lg:pb-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.gold.eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(3.2rem,10vw,7rem)] leading-[0.9] tracking-tight">
              {t.gold.title}
            </h2>
            <p className="mt-6 max-w-xs whitespace-pre-line text-xl leading-snug text-foreground/80 md:text-2xl">
              {t.gold.body}
            </p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
              {t.gold.flavors.map((flavor) => (
                <li
                  key={flavor}
                  className="font-display text-2xl italic tracking-tight md:text-3xl"
                >
                  {flavor}
                </li>
              ))}
            </ul>
            <Link
              to={t.paths.arancini}
              className="mt-10 inline-block text-lg italic underline-offset-4 hover:underline"
            >
              {t.gold.cta} →
            </Link>
          </div>
          <div className="relative pb-10 md:pb-12">
            <img
              src={photoGold}
              alt={t.gold.photoAlt}
              className="aspect-[3/4] w-full object-cover md:aspect-[4/5]"
            />
            <img
              src={drawBite}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-2 left-0 w-[min(46vw,15rem)] md:-bottom-4 md:-left-6 md:w-[17rem]"
            />
          </div>
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
            <p className="mt-8 max-w-md whitespace-pre-line text-lg leading-relaxed text-[#F3EBDD]/80 md:text-xl">
              {t.world.body}
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-hidden border-y border-[color:var(--golden)]/40 bg-[color:var(--cream)] py-4">
        <div className="marquee-track flex w-max gap-12 text-xl italic text-[color:var(--espresso)] md:text-2xl">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex items-center gap-12 pr-12">
              <span>Tutto passa</span>
              <span className="text-[color:var(--golden)]" aria-hidden>
                •
              </span>
              <span>Stay a little longer</span>
              <span className="text-[color:var(--golden)]" aria-hidden>
                •
              </span>
              <span>Gold of Sicily</span>
            </span>
          ))}
        </div>
      </div>

      <section className="relative bg-[color:var(--sea)] text-[#F3EBDD]">
        <img
          src={drawEspresso}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-4 right-4 w-[min(48vw,17rem)] md:bottom-8 md:right-10 md:w-[min(36vw,20rem)]"
        />
        <div className="relative mx-auto max-w-4xl px-5 py-28 md:px-12 md:py-40">
          <h2 className="font-display text-[clamp(3rem,12vw,7rem)] leading-[0.9] tracking-tight text-[color:var(--golden)]">
            {t.tutto.title}
          </h2>
          <p className="mt-8 max-w-sm whitespace-pre-line text-xl leading-relaxed text-[#F3EBDD] md:text-2xl">
            {t.tutto.body}
          </p>
        </div>
      </section>

      <section className="px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t.same.eyebrow}</p>
            <h2 className="mt-3 font-display text-[clamp(2.6rem,8vw,5.5rem)] leading-[0.95] tracking-tight">
              {t.same.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/80 md:text-xl">
              {t.same.body}
            </p>
          </div>
          <img src={drawVespa} alt="" aria-hidden className="mx-auto w-full max-w-lg" />
        </div>
      </section>

      <section id="find-gold" className="scroll-mt-20 px-5 py-20 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.find.title}</p>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] leading-[0.95] tracking-tight">
            {t.find.body}
          </h2>
          <div className="mt-12">
            <FindGoldGrid lang={lang} compact venues={venues} />
          </div>
        </div>
      </section>

      <section
        id="serve-gold"
        className="scroll-mt-20 bg-[color:var(--paper)] px-5 py-20 md:px-12 md:py-28 lg:px-16"
      >
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">{t.serve.eyebrow}</p>
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
            className="mt-12 inline-block text-lg italic underline-offset-4 hover:underline"
          >
            {t.serve.cta} →
          </Link>
        </div>
      </section>

      <BrandFooter lang={lang} />
    </div>
  );
}
