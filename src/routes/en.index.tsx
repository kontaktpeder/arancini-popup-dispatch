import { createFileRoute } from "@tanstack/react-router";


import { EditorialCards } from "@/components/editorial-cards";
import { FeedbackSection } from "@/components/feedback-section";
import { SiteHeader } from "@/components/site-header";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";
import { SiteFooter } from "@/components/site-footer";
import { DISCOVERY_EN } from "@/lib/discovery-copy";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";
import { CURRENT_POPUP_EN } from "@/lib/site";

export const Route = createFileRoute("/en/")({
  head: () => buildPageHead(PAGE_SEO["/en"]),
  component: IndexEn,
});

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — Sicilian arancini in Oslo</h1>
      <LangSwitch lang="en" />
      <SiteHeader tagline={DISCOVERY_EN.heroIntro.body} />

      <Poster
        copy={{
          altArancini: "Arancini on crinkled paper",
          tagTop: "Crispy outside.",
          tagBottom: "Soft inside.",
          subtitle: "Sicilian street food",
          nextLabel: "Next popup",
          date: CURRENT_POPUP_EN.dateShort,
          address: `${CURRENT_POPUP_EN.timeLabel} · ${CURRENT_POPUP_EN.addressShort}`,
          scarcity: CURRENT_POPUP_EN.scarcity,
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
