import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function SiteFooter({ copy }: { copy: DiscoveryCopy["footer"] }) {
  return (
    <footer className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-6 pb-10 pt-6 text-center text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground">
      <span>{copy.tagline}</span>
      <span className="opacity-60">{copy.rights}</span>
    </footer>
  );
}
