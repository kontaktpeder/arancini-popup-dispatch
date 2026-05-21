import { Link } from "@tanstack/react-router";
import type { DiscoveryCopy } from "@/lib/discovery-copy";

export function CreditsLinks({ copy }: { copy: DiscoveryCopy["credits"] }) {
  return (
    <nav
      aria-label={copy.label}
      className="credits-row mt-8 flex flex-col items-center gap-3 md:mt-10 md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-2"
    >
      {copy.links.map((link) => (
        <Link key={link.to} to={link.to} className="credits-link">
          {link.label} <span aria-hidden>→</span>
        </Link>
      ))}
    </nav>
  );
}
