import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  allergenCopy,
  allergenProducts,
} from "@/lib/allergen-info";

type Lang = "no" | "en";

export function AllergenInformation({ lang = "no" }: { lang?: Lang }) {
  const t = allergenCopy[lang];

  return (
    <section
      id="allergener"
      aria-labelledby="allergen-info-heading"
      className="border-b-2 border-foreground bg-[color:var(--paper)]"
    >
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-8 md:py-20">
        <div className="border border-foreground/20 bg-background/80 px-5 py-5 md:px-6 md:py-6">
          <div className="flex items-start gap-3">
            <Info
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-foreground/45"
              strokeWidth={1.75}
            />
            <div className="min-w-0 flex-1">
              <h2
                id="allergen-info-heading"
                className="font-display text-xl tracking-tight md:text-2xl"
              >
                {t.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75 md:text-base">
                {t.intro}
              </p>
            </div>
          </div>

          <Accordion type="single" collapsible className="mt-2">
            <AccordionItem value="details" className="border-foreground/15">
              <AccordionTrigger className="py-3 text-left text-sm font-medium text-foreground/70 hover:no-underline hover:text-foreground">
                {lang === "no" ? "Se detaljer og foreløpig oversikt" : "See details and preliminary overview"}
              </AccordionTrigger>
              <AccordionContent className="space-y-6 text-sm leading-relaxed text-foreground/80 md:text-base">
                {t.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground/55">
                    {t.overviewLabel}
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/80 md:text-base">
                    {t.overviewSummary}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {allergenProducts.map((product) => (
                    <article
                      key={product.id}
                      className="border border-foreground/15 bg-[color:var(--paper)]/60 p-4"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-lg tracking-tight">
                          {product.name[lang]}
                        </h3>
                        <span className="text-[0.65rem] uppercase tracking-[0.14em] text-foreground/45">
                          {product.status[lang]}
                        </span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foreground/45">
                            {t.confirmedLabel}
                          </p>
                          <ul className="mt-2 flex flex-wrap gap-1.5">
                            {product.confirmed[lang].map((item) => (
                              <li
                                key={item}
                                className="border border-foreground/20 bg-background px-2 py-0.5 text-xs text-foreground/75"
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="text-[0.65rem] uppercase tracking-[0.14em] text-foreground/45">
                            {t.dependsLabel}
                          </p>
                          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-foreground/70 md:text-sm">
                            {product.dependsOnIngredients[lang].map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <p>{t.closing}</p>

                <p>
                  <a
                    href={t.contactHref}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {t.contactLink}
                  </a>
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}
