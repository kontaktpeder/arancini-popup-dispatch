import { createFileRoute } from "@tanstack/react-router";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";

export const Route = createFileRoute("/en")({
  head: () => ({
    meta: [
      { title: "Arancini — Sicilian Street Food" },
      {
        name: "description",
        content: "Crispy outside. Soft inside. Next popup Tuesday May 26.",
      },
      { property: "og:title", content: "Arancini" },
      { property: "og:description", content: "Crispy outside. Soft inside." },
      { property: "og:url", content: "https://goldofsicily.no/en" },
    ],
    links: [{ rel: "canonical", href: "https://goldofsicily.no/en" }],
  }),
  component: IndexEn,
});

function IndexEn() {
  return (
    <main className="min-h-screen bg-background">
      <LangSwitch lang="en" />
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
    </main>
  );
}
