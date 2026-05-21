import { createFileRoute } from "@tanstack/react-router";
import { LangSwitch } from "@/components/lang-switch";
import { Poster } from "@/components/poster";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arancini — Siciliansk streetfood" },
      {
        name: "description",
        content: "Sprø utenpå. Myk inni. Neste popup tirsdag 26. mai.",
      },
      { property: "og:title", content: "Arancini" },
      { property: "og:description", content: "Sprø utenpå. Myk inni." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="min-h-screen bg-background">
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
        }}
      />
    </main>
  );
}
