import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => buildPageHead(PAGE_SEO["/about"]),
  component: AboutPage,
});

function AboutPage() {
  return (
    <ContentPage eyebrow="Om oss" title="Sicilia, i små batcher">
      <p>
        Gold of Sicily startet med et enkelt spørsmål: hvorfor finnes ikke ekte,
        sicilianske arancini som gatekjøkken i Oslo — sprø, myke, med fyll som smaker
        av noe — uten å bli en «italiensk restaurant»-opplevelse?
      </p>

      <p>
        Vi er popup og streetfood: Dennis og teamet baker batcher når det er en dato og
        et sted, ikke hver dag året rundt. Det betyr at du får det som er ferskt den
        kvelden — og når batchen er tom, er den tom.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Sicilia, ikke corporate
      </h2>
      <p>
        Inspirasjonen kommer fra Palermo — lyden av friture, papir, folk som spiser
        stående. Vi vil ikke skrive «we are passionate about food». Vi vil servere
        arancini som føles ekte, fysisk og litt rå på kantene — som mote møter
        gatekjøkken.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Små batcher
      </h2>
      <p>
        Mindre batch betyr bedre kontroll på ris, fyll og sprøhet. Det er også hvorfor
        dette manglet: det skalerer ikke som en kjede, men det smaker bedre.
      </p>

      <p>
        <Link to="/next-popup">Neste popup →</Link>
        {" · "}
        <a href={SITE.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </p>
    </ContentPage>
  );
}
