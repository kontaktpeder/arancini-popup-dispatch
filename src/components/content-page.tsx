import { Link } from "@tanstack/react-router";
import { LangSwitch } from "@/components/lang-switch";
import { PreferredSourcesBadge } from "@/components/preferred-sources-badge";

type ContentPageProps = {
  lang?: "no" | "en";
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
};

export function ContentPage({ lang = "no", eyebrow, title, children }: ContentPageProps) {
  return (
    <main className="min-h-screen bg-background">
      <LangSwitch lang={lang} />

      <article className="mx-auto max-w-2xl px-6 pb-16 pt-20 md:pt-28">
        <Link
          to={lang === "en" ? "/en" : "/"}
          className="text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground transition hover:text-foreground"
        >
          ← Gold of Sicily
        </Link>

        {eyebrow ? <p className="eyebrow mt-10">{eyebrow}</p> : null}

        <h1 className="mt-4 font-display text-[clamp(2.25rem,6vw,3.75rem)] leading-[1.05] tracking-tight">
          {title}
        </h1>

        <div className="prose-gos mt-10 flex flex-col gap-6 text-base leading-relaxed text-foreground/85 md:text-lg">
          {children}
        </div>

        <div className="mt-12 border-t border-foreground/10 pt-8">
          <PreferredSourcesBadge lang={lang} />
        </div>
      </article>
    </main>
  );
}
