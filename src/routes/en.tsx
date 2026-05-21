import { createFileRoute } from "@tanstack/react-router";

import { EditorialCards } from "@/components/editorial-cards";
import { HeroIntro } from "@/components/hero-intro";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";
import { SiteFooter } from "@/components/site-footer";
import { DISCOVERY_EN } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/en")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  component: IndexEn,
});

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — Sicilian arancini in Oslo</h1>
      <LangSwitch lang="en" />
      <HeroIntro copy={DISCOVERY_EN.heroIntro} />
      <Poster
        copy={{
          altArancini: "Arancini on crinkled paper",
          tagTop: "Crispy outside.",
          tagBottom: "Soft inside.",
          subtitle: "Italian rice balls with filling",
          nextLabel: "Next popup",
          date: "Tuesday May 26",
          address: "18–20 · Sigurds gate 7",
          scarcity: "When the batch is gone, it's gone.",
          follow: "Follow on Instagram",
          countdownTarget: "2026-05-26T16:00:00Z",
          countdownLabels: {
            days: "Days",
            hours: "Hours",
            minutes: "Min",
            seconds: "Sec",
            live: "We're live — come by!",
          },
        }}
      />
      
      <EditorialCards copy={DISCOVERY_EN.editorial} />
      <SiteFooter copy={DISCOVERY_EN.footer} />
    </main>
  );
}
