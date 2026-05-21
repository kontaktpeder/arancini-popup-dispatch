import { Link } from "@tanstack/react-router";

export function LangSwitch({ lang }: { lang: "no" | "en" }) {
  const to = lang === "no" ? "/en" : "/";
  const label = lang === "no" ? "EN" : "NO";
  return (
    <Link
      to={to}
      aria-label={lang === "no" ? "Switch to English" : "Bytt til norsk"}
      className="fixed right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/70 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-foreground backdrop-blur transition hover:bg-foreground hover:text-background md:right-6 md:top-6"
    >
      {label}
    </Link>
  );
}
