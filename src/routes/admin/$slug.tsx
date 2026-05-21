import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCmsPage, saveCmsPage } from "@/lib/cms/cms.functions";
import { CMS_DEFAULTS } from "@/lib/cms/defaults";
import { CMS_SCHEMAS, SLUGS, SLUG_LABELS } from "@/lib/cms/schemas";
import type {
  AboutContent,
  CmsSlug,
  NextPopupContent,
  WhatIsAranciniContent,
} from "@/lib/cms/types";

type FieldDef = {
  key: string;
  label: string;
  type: "input" | "textarea";
  hint?: string;
};

const FIELDS: Record<CmsSlug, { groups: { title: string; fields: FieldDef[] }[] }> = {
  "what-is-arancini": {
    groups: [
      {
        title: "SEO",
        fields: [
          { key: "seo_title", label: "SEO-tittel", type: "input", hint: "≤ 60 tegn" },
          {
            key: "seo_description",
            label: "Meta description",
            type: "textarea",
            hint: "≤ 160 tegn",
          },
        ],
      },
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "input" },
          { key: "title", label: "H1 (tittel)", type: "input" },
        ],
      },
      {
        title: "Innhold",
        fields: [
          { key: "intro_1", label: "Intro – avsnitt 1", type: "textarea" },
          {
            key: "intro_2_before",
            label: "Intro 2 – tekst før kursiv",
            type: "textarea",
          },
          {
            key: "intro_2_emphasis",
            label: "Intro 2 – kursiv ord",
            type: "input",
            hint: "Rendres som <em>",
          },
          {
            key: "intro_2_after",
            label: "Intro 2 – tekst etter kursiv",
            type: "textarea",
          },
          { key: "section_1_heading", label: "Seksjon 1 – H2", type: "input" },
          { key: "section_1_body", label: "Seksjon 1 – tekst", type: "textarea" },
          { key: "section_2_heading", label: "Seksjon 2 – H2", type: "input" },
          { key: "section_2_body", label: "Seksjon 2 – tekst", type: "textarea" },
        ],
      },
      {
        title: "Lenker",
        fields: [{ key: "cta_label", label: "CTA-label", type: "input" }],
      },
    ],
  },
  about: {
    groups: [
      {
        title: "SEO",
        fields: [
          { key: "seo_title", label: "SEO-tittel", type: "input" },
          { key: "seo_description", label: "Meta description", type: "textarea" },
        ],
      },
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "input" },
          { key: "title", label: "H1", type: "input" },
        ],
      },
      {
        title: "Innhold",
        fields: [
          { key: "intro_1", label: "Intro 1", type: "textarea" },
          { key: "intro_2", label: "Intro 2", type: "textarea" },
          { key: "section_1_heading", label: "Seksjon 1 – H2", type: "input" },
          { key: "section_1_body", label: "Seksjon 1 – tekst", type: "textarea" },
          { key: "section_2_heading", label: "Seksjon 2 – H2", type: "input" },
          { key: "section_2_body", label: "Seksjon 2 – tekst", type: "textarea" },
        ],
      },
      {
        title: "Lenker",
        fields: [
          { key: "cta_popup_label", label: "CTA – popup", type: "input" },
          { key: "cta_instagram_label", label: "CTA – Instagram", type: "input" },
        ],
      },
    ],
  },
  "next-popup": {
    groups: [
      {
        title: "SEO",
        fields: [
          { key: "seo_title", label: "SEO-tittel", type: "input" },
          { key: "seo_description", label: "Meta description", type: "textarea" },
        ],
      },
      {
        title: "Header",
        fields: [
          { key: "eyebrow", label: "Eyebrow", type: "input" },
          { key: "title", label: "H1", type: "input" },
        ],
      },
      {
        title: "Tid & sted",
        fields: [
          { key: "date_label", label: "Dato (tekst)", type: "input" },
          { key: "time_label", label: "Klokkeslett (tekst)", type: "input" },
          { key: "address_short", label: "Adresse – kort", type: "input" },
          { key: "address_full", label: "Adresse – full", type: "input" },
          { key: "maps_url", label: "Google Maps URL", type: "input" },
        ],
      },
      {
        title: "Innhold",
        fields: [
          { key: "intro_body", label: "Brødtekst", type: "textarea" },
          { key: "scarcity", label: "Scarcity-linje (italic)", type: "input" },
          { key: "menu_heading", label: "Meny – overskrift", type: "input" },
        ],
      },
      {
        title: "Lenker",
        fields: [
          { key: "cta_maps_label", label: "CTA – kart", type: "input" },
          { key: "cta_instagram_label", label: "CTA – Instagram", type: "input" },
          { key: "cta_what_is_label", label: "CTA – hva er arancini", type: "input" },
        ],
      },
    ],
  },
};

function isCmsSlug(v: string): v is CmsSlug {
  return (SLUGS as string[]).includes(v);
}

export const Route = createFileRoute("/admin/$slug")({
  beforeLoad: ({ params }) => {
    if (!isCmsSlug(params.slug)) throw notFound();
  },
  loader: ({ params }) => getCmsPage({ data: params.slug as CmsSlug }),
  component: AdminEditor,
});

type AnyContent = WhatIsAranciniContent | AboutContent | NextPopupContent;

function AdminEditor() {
  const { slug } = Route.useParams();
  const initial = Route.useLoaderData() as AnyContent;
  const router = useRouter();
  const save = useServerFn(saveCmsPage);

  const slugTyped = slug as CmsSlug;
  const [form, setForm] = useState<AnyContent>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial);
  }, [initial]);

  const config = FIELDS[slugTyped];

  const set = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }) as AnyContent);
  };

  const menu = useMemo(() => {
    if (slugTyped !== "next-popup") return null;
    return (form as NextPopupContent).menu ?? [];
  }, [form, slugTyped]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsed = CMS_SCHEMAS[slugTyped].parse(form);
      await save({ data: { slug: slugTyped, content: parsed } });
      toast.success("Lagret");
      router.invalidate();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Kunne ikke lagre. Sjekk feltene.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setForm(CMS_DEFAULTS[slugTyped] as AnyContent);
    toast("Tilbakestilt til standardtekst (ikke lagret).");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ← Tilbake
          </Link>
          <h1 className="mt-1 font-display text-3xl tracking-tight">
            {SLUG_LABELS[slugTyped]}
          </h1>
          <p className="text-sm text-muted-foreground">
            Redigerer{" "}
            <Link
              to={slugTyped === "about" ? "/about" : slugTyped === "next-popup" ? "/next-popup" : "/what-is-arancini"}
              className="underline"
              target="_blank"
            >
              /{slugTyped}
            </Link>
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={resetToDefaults}>
            Tilbakestill
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Lagrer…" : "Lagre"}
          </Button>
        </div>
      </div>

      {config.groups.map((group) => (
        <section
          key={group.title}
          className="space-y-4 rounded-xl border border-border/60 bg-card p-5"
        >
          <h2 className="font-display text-lg tracking-tight">{group.title}</h2>
          <div className="space-y-4">
            {group.fields.map((f) => {
              const value = (form as Record<string, unknown>)[f.key];
              const stringValue = typeof value === "string" ? value : "";
              return (
                <div key={f.key} className="space-y-1.5">
                  <Label htmlFor={f.key}>
                    {f.label}
                    {f.hint ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {f.hint}
                      </span>
                    ) : null}
                  </Label>
                  {f.type === "textarea" ? (
                    <Textarea
                      id={f.key}
                      value={stringValue}
                      rows={f.key.endsWith("_body") || f.key.includes("intro") ? 5 : 3}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={f.key}
                      value={stringValue}
                      onChange={(e) => set(f.key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {menu ? (
        <section className="space-y-4 rounded-xl border border-border/60 bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg tracking-tight">Meny</h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                set("menu", [...menu, { name: "", description: "" }])
              }
            >
              + Legg til
            </Button>
          </div>
          {menu.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen retter.</p>
          ) : (
            <ul className="space-y-4">
              {menu.map((item, idx) => (
                <li
                  key={idx}
                  className="space-y-2 rounded-lg border border-border/60 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      #{idx + 1}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const next = menu.filter((_, i) => i !== idx);
                        set("menu", next);
                      }}
                    >
                      Fjern
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Navn</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => {
                        const next = menu.map((m, i) =>
                          i === idx ? { ...m, name: e.target.value } : m,
                        );
                        set("menu", next);
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Beskrivelse</Label>
                    <Textarea
                      rows={2}
                      value={item.description}
                      onChange={(e) => {
                        const next = menu.map((m, i) =>
                          i === idx ? { ...m, description: e.target.value } : m,
                        );
                        set("menu", next);
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Lagrer…" : "Lagre"}
        </Button>
      </div>
    </form>
  );
}
