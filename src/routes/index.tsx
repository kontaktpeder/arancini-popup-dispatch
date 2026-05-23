import { createFileRoute } from "@tanstack/react-router";


import { EditorialCards } from "@/components/editorial-cards";
import { SiteHeader } from "@/components/site-header";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";
import { SiteFooter } from "@/components/site-footer";
import { DISCOVERY_NO } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CURRENT_POPUP } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — sicilianske arancini i Oslo</h1>
      <LangSwitch lang="no" />
      <SiteHeader tagline={DISCOVERY_NO.heroIntro.body} />

      <Poster
        copy={{
          altArancini: "Arancini på krøllet papir",
          tagTop: "Sprø utenpå.",
          tagBottom: "Myk inni.",
          subtitle: "Siciliansk streetfood",
          nextLabel: "Neste popup",
          date: CURRENT_POPUP.dateShort,
          address: `${CURRENT_POPUP.timeLabel} · ${CURRENT_POPUP.addressShort}`,
          scarcity: CURRENT_POPUP.scarcity,
          follow: "Følg på Instagram",
          countdownTarget: CURRENT_POPUP.countdownTarget,
          countdownLabels: {
            days: "Dager",
            hours: "Timer",
            minutes: "Min",
            seconds: "Sek",
            live: "Vi er i gang — kom innom!",
          },
        }}
      />

      <EditorialCards copy={DISCOVERY_NO.editorial} />
      <CreditsLinks copy={DISCOVERY_NO.credits} />
      <SiteFooter copy={DISCOVERY_NO.footer} />
    </main>
  );
}

