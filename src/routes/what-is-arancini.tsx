import { createFileRoute, Link } from "@tanstack/react-router";
import { ContentPage } from "@/components/content-page";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/what-is-arancini")({
  head: () => buildPageHead(PAGE_SEO["/what-is-arancini"]),
  component: WhatIsAranciniPage,
});

function WhatIsAranciniPage() {
  return (
    <ContentPage eyebrow="Guide" title="Hva er arancini?">
      <p>
        Arancini er sicilianske risballer: ris som formes rundt et fyll, paneres og
        stekes til en sprø skorpe. Inni skal det være mykt, smakrikt og litt «vått» på
        den gode måten — som i gatene i Palermo, ikke som frossen snacks.
      </p>

      <p>
        Navnet kommer av <em>arancina</em> — liten appelsin — fordi de klassiske,
        runde variantene kan ligne en appelsin. I øst-Sicilia er de ofte spisse; i Oslo
        møter du begge tradisjoner gjennom håndverk, ikke fabrikk.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Arancini i Oslo
      </h2>
      <p>
        Folk søker «arancini oslo», «sicilianske risballer» og «hva er arancini» fordi
        de har smakt det et sted — eller nesten. Gold of Sicily er et popup-konsept:
        små batcher, tydelig meny per kveld, og kvalitet før volum.
      </p>

      <h2 className="font-display text-2xl tracking-tight md:text-3xl">
        Slik lager vi dem
      </h2>
      <p>
        Ris som får tid, fyll med ragu, ost eller sesong, panering som tåler varme uten
        å bli fett — og servering mens de fortsatt har tyngde og saft inni. Det er
        gatekjøkken, ikke corporate restaurant-SEO.
      </p>

      <p>
        <Link to="/next-popup">Se neste popup →</Link>
      </p>
    </ContentPage>
  );
}
