import { Link } from "@tanstack/react-router";

export function LangSwitch({ lang }: { lang: "no" | "en" }) {
  const to = lang === "no" ? "/en" : "/";
  const label = lang === "no" ? "EN" : "NO";
  return (
    <Link
      to={to}
      aria-label={lang === "no" ? "Switch to English" : "Bytt til norsk"}
      className="fixed right-3 top-3 z-50 inline-flex h-7 w-7 items-center justify-center rounded-full border border-foreground/15 text-[0.55rem] font-medium uppercase tracking-[0.18em] text-foreground/55 transition hover:border-foreground/40 hover:text-foreground md:right-5 md:top-5 md:h-8 md:w-8 md:text-[0.6rem]"
    >
      {label}
    </Link>
  );
}
