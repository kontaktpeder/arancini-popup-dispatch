import { Link } from "@tanstack/react-router";
import { PreferredSourcesBadge } from "@/components/preferred-sources-badge";
import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function SiteFooter({
  copy,
  lang = "no",
}: {
  copy: DiscoveryCopy["footer"];
  lang?: "no" | "en";
}) {
  return (
    <footer className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 pb-10 pt-6 text-center text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
      <PreferredSourcesBadge lang={lang} />
      <Link
        to={copy.barsTo}
        className="text-foreground/55 underline-offset-4 transition hover:text-foreground hover:underline"
      >
        {copy.barsLabel} <span aria-hidden>→</span>
      </Link>
      <span>{copy.tagline}</span>
      <span className="opacity-60">{copy.rights}</span>
    </footer>
  );
}
