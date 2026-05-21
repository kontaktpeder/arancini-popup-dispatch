import { createFileRoute } from "@tanstack/react-router";
import heroArancini from "@/assets/hero-arancini.jpg";
import popupNight from "@/assets/popup-night.jpg";
import handsArancini from "@/assets/hands-arancini.jpg";
import menuRagu from "@/assets/menu-ragu.jpg";
import menuPistachio from "@/assets/menu-pistachio.jpg";
import menuMozzarella from "@/assets/menu-mozzarella.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arancini — Siciliansk streetfood, laget samme dag" },
      {
        name: "description",
        content:
          "Sprø utenpå. Varm inni. Siciliansk streetfood laget for hånd i små batcher. Popups i Oslo.",
      },
      { property: "og:title", content: "Arancini — Siciliansk streetfood" },
      { property: "og:description", content: "Sprø utenpå. Varm inni. Laget samme dag." },
      { property: "og:image", content: heroArancini },
    ],
  }),
  component: Index,
});

function ArchedLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 500 110"
      className={className}
      aria-label="Arancini"
      role="img"
    >
      <defs>
        <path
          id="arc"
          d="M 40,95 A 220,180 0 0 1 460,95"
          fill="none"
        />
      </defs>
      <text className="arched fill-foreground" fontSize="34">
        <textPath href="#arc" startOffset="50%" textAnchor="middle">
          ARANCINI
        </textPath>
      </text>
    </svg>
  );
}

function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 px-6 pt-6 md:px-12 md:pt-8">
      <div className="flex items-center justify-between">
        <ArchedLogo className="h-12 w-44 md:h-14 md:w-52" />
        <button
          aria-label="Meny"
          className="flex flex-col gap-[5px] p-2 text-foreground/80 transition hover:text-foreground"
        >
          <span className="block h-px w-7 bg-current" />
          <span className="block h-px w-7 bg-current" />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background">
      <Nav />
      <img
        src={heroArancini}
        alt="Sprø arancini brutt opp med smeltet ost"
        className="absolute inset-0 h-full w-full object-cover"
        width={1536}
        height={1920}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30" />
      <div className="absolute inset-0 flex items-end md:items-center">
        <div className="w-full px-6 pb-24 md:px-16 md:pb-0">
          <div className="max-w-2xl">
            <h1 className="font-display text-[clamp(3rem,9vw,7rem)] leading-[0.95] tracking-tight text-foreground">
              Sprø utenpå.
              <br />
              <em className="not-italic text-foreground/95">Varm inni.</em>
            </h1>
            <p className="eyebrow mt-8 !text-foreground/80">
              Siciliansk streetfood. Laget samme dag.
            </p>
            <a
              href="#popup"
              className="mt-10 inline-flex items-center gap-4 bg-foreground px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-background transition hover:bg-foreground/85"
            >
              Se neste popup
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="relative -mt-12 bg-background pt-24 pb-32 md:pt-40 md:pb-48">
      <div className="absolute inset-x-0 top-0 h-10 torn-top bg-background" />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="eyebrow">Arancini</p>
        <p className="mt-6 font-display text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] text-foreground">
          Siciliansk streetfood
          <br />
          laget for hånd i små batcher.
        </p>
        <div className="mx-auto mt-10 h-px w-12 bg-accent/60" />
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-background pb-32 md:pb-48">
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-4 px-4 md:gap-8 md:px-12">
        <div className="col-span-12 md:col-span-5">
          <img
            src={popupNight}
            alt="Popup-stand om kvelden i Oslo"
            className="aspect-[3/4] w-full object-cover"
            loading="lazy"
            width={1080}
            height={1440}
          />
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7 md:pt-32">
          <img
            src={handsArancini}
            alt="Hender som holder en nystekt arancini"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
            width={1080}
            height={1350}
          />
        </div>

        <div className="col-span-12 mt-16 md:col-span-7 md:col-start-3 md:mt-24">
          <p className="eyebrow">En liten historie</p>
          <p className="mt-6 font-display text-[clamp(1.5rem,2.8vw,2.25rem)] leading-[1.35] text-foreground">
            Lyden av frityr. Papir som krølles. Folk som står ute i vinterkulda
            og venter på neste batch.
          </p>
          <div className="mt-10 max-w-md space-y-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            <p>
              Vi begynte med en panne, et bord, og en lengsel etter Palermo
              klokken to om natta.
            </p>
            <p>
              Sicilia møter Oslo. Friteres på stedet. Serveres varmt, i papir,
              uten omsvøp.
            </p>
            <p className="text-foreground">Når batchen er tom, er den tom.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Menu() {
  const items = [
    {
      name: "Al Ragù",
      img: menuRagu,
      note: "Langtidskokt oksekjøtt, tomat, erter.",
    },
    {
      name: "Mozzarella",
      img: menuMozzarella,
      note: "Fior di latte. Strekker som den skal.",
    },
    {
      name: "Pistacchio",
      img: menuPistachio,
      note: "Bronte-pistasj, ricotta, sitronskall.",
    },
  ];

  return (
    <section className="bg-background pb-32 md:pb-48">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="mb-16 text-center md:mb-24">
          <p className="eyebrow">Meny</p>
          <h2 className="mt-6 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[1] text-foreground">
            Noen favoritter
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-10">
          {items.map((it, i) => (
            <article key={it.name} className={i === 1 ? "md:mt-24" : ""}>
              <div className="overflow-hidden">
                <img
                  src={it.img}
                  alt={it.name}
                  className="aspect-[3/4] w-full object-cover transition duration-[1200ms] hover:scale-[1.03]"
                  loading="lazy"
                  width={1080}
                  height={1440}
                />
              </div>
              <div className="mt-6">
                <h3 className="font-display text-2xl italic md:text-3xl">
                  {it.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.note}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-20 text-center text-sm italic text-muted-foreground">
          Menyen endrer seg fra popup til popup.
        </p>
      </div>
    </section>
  );
}

function Popup() {
  return (
    <section id="popup" className="bg-foreground py-32 text-background md:py-48">
      <div className="mx-auto max-w-4xl px-6 text-center md:px-12">
        <p className="font-sans text-[0.7rem] uppercase tracking-[0.32em] text-background/60">
          Neste popup
        </p>
        <p className="mt-10 font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[1] text-background">
          Fredag 30. mai
        </p>
        <p className="mt-8 font-display text-xl italic text-background/80 md:text-2xl">
          Grünerløkka, Oslo · 18:00 — til batchen er tom
        </p>

        <div className="mx-auto mt-12 h-px w-12 bg-background/30" />

        <p className="mx-auto mt-12 max-w-md text-sm leading-relaxed text-background/70">
          120 arancini. Førstemann til mølla. Ingen forhåndsbestilling. Følg
          Instagram for lokasjon noen timer i forveien.
        </p>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="mt-12 inline-flex items-center gap-4 border border-background/40 px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.22em] text-background transition hover:bg-background hover:text-foreground"
        >
          Følg på Instagram
          <span aria-hidden>→</span>
        </a>
      </div>
    </section>
  );
}

function Faq() {
  const qs = [
    {
      q: "Kan jeg forhåndsbestille?",
      a: "Nei. Alt lages samme dag, i begrenset antall.",
    },
    {
      q: "Hva koster det?",
      a: "Fra 75 kr per arancini. Kontant eller Vipps.",
    },
    {
      q: "Vegetar?",
      a: "Alltid minst én. Ofte to.",
    },
    {
      q: "Kan dere catre?",
      a: "Iblant. Send en e-post, så snakkes vi.",
    },
  ];

  return (
    <section className="bg-background py-32 md:py-48">
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <p className="eyebrow text-center">Spørsmål</p>
        <div className="mt-16 divide-y divide-border">
          {qs.map((item) => (
            <div key={item.q} className="grid grid-cols-12 gap-6 py-8">
              <p className="col-span-12 font-display text-xl text-foreground md:col-span-5 md:text-2xl">
                {item.q}
              </p>
              <p className="col-span-12 text-muted-foreground md:col-span-7 md:pt-2">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-background pb-12 pt-8">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <ArchedLogo className="mx-auto h-16 w-56 opacity-80" />
        <div className="mt-10 flex flex-col items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-muted-foreground md:flex-row">
          <p>Oslo · Palermo</p>
          <div className="flex gap-6">
            <a href="https://instagram.com" className="hover:text-foreground">
              Instagram
            </a>
            <a href="mailto:hei@arancini.no" className="hover:text-foreground">
              E-post
            </a>
          </div>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Intro />
      <Story />
      <Menu />
      <Popup />
      <Faq />
      <Footer />
    </main>
  );
}
