import { createFileRoute } from "@tanstack/react-router";


import { EditorialCards } from "@/components/editorial-cards";
import { FeedbackSection } from "@/components/feedback-section";
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

      <FeedbackSection
        copy={{
          eyebrow: "Batch #001",
          title: "Hjelp oss forme Gold of Sicily",
          body: "Vi lager små batcher sicilianske arancini i Oslo og tester konseptet live. Smakte du en? Fortell oss hva du synes — om smak, pris og hva vi bør lage mer av.",
          microNote: "Tar under 30 sekunder",
          cta: "Gi feedback",
          qrLabel: "Scan og svar",
          formTitle: "Live · Batch 001",
          stats: [
            { value: "100", label: "pcs only" },
            { value: "3", label: "fillings" },
            { value: "01", label: "first popup" },
          ],
        }}
      />

      <EditorialCards copy={DISCOVERY_NO.editorial} />
      
      
      <SiteFooter copy={DISCOVERY_NO.footer} />
    </main>
  );
}

