import { Link, useRouterState } from "@tanstack/react-router";

type EnPath = "/en" | "/en/what-is-arancini" | "/en/next-popup" | "/en/about";
type NoPath = "/" | "/what-is-arancini" | "/next-popup" | "/about";

const NO_TO_EN: Record<string, EnPath> = {
  "/": "/en",
  "/what-is-arancini": "/en/what-is-arancini",
  "/next-popup": "/en/next-popup",
  "/about": "/en/about",
};

const EN_TO_NO: Record<string, NoPath> = {
  "/en": "/",
  "/en/": "/",
  "/en/what-is-arancini": "/what-is-arancini",
  "/en/next-popup": "/next-popup",
  "/en/about": "/about",
};

export function LangSwitch({ lang }: { lang: "no" | "en" }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const to: EnPath | NoPath =
    lang === "no" ? (NO_TO_EN[pathname] ?? "/en") : (EN_TO_NO[pathname] ?? "/");
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
