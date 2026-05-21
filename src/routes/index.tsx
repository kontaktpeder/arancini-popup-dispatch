import { createFileRoute } from "@tanstack/react-router";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";
import { buildPageHead, PAGE_SEO } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => buildPageHead(PAGE_SEO["/"]),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
      <h1 className="sr-only">Gold of Sicily — sicilianske arancini i Oslo</h1>
      <LangSwitch lang="no" />
      <Poster
        copy={{
          altArancini: "Arancini på krøllet papir",
          tagTop: "Sprø utenpå.",
          tagBottom: "Myk inni.",
          subtitle: "Italienske risballer med fyll",
          nextLabel: "Neste popup",
          date: "Tirsdag 26. mai",
          address: "18–20 · Sigurds gate 7",
          scarcity: "Når batchen er tom, er den tom.",
          follow: "Følg på Instagram",
          countdownTarget: "2026-05-26T16:00:00Z",
          countdownLabels: {
            days: "Dager",
            hours: "Timer",
            minutes: "Min",
            seconds: "Sek",
            live: "Vi er i gang — kom innom!",
          },
        }}
      />
    </main>
  );
}
