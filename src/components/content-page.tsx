import { BrandFooter } from "@/components/brand-footer";
import { BrandNav } from "@/components/brand-nav";
import { PreferredSourcesBadge } from "@/components/preferred-sources-badge";

type ContentPageProps = {
  lang?: "no" | "en";
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
};

export function ContentPage({ lang = "no", eyebrow, title, children }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-[color:var(--cream)]">
      <BrandNav lang={lang} />
      <article className="mx-auto max-w-2xl px-6 pb-20 pt-12 md:pt-16">
        {eyebrow ? (
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-foreground/50">
            {eyebrow}
          </p>
        ) : null}

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
      <BrandFooter lang={lang} />
    </div>
  );
}
