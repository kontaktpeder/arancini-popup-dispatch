import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CMS_DEFAULTS } from "./defaults";
import { CMS_SCHEMAS, SLUGS } from "./schemas";
import type { CmsContentMap, CmsSlug } from "./types";

const slugSchema = z.enum(SLUGS as [CmsSlug, ...CmsSlug[]]);

function mergeWithDefaults<S extends CmsSlug>(
  slug: S,
  stored: unknown,
): CmsContentMap[S] {
  const defaults = CMS_DEFAULTS[slug] as CmsContentMap[S];
  if (!stored || typeof stored !== "object") return defaults;
  return { ...defaults, ...(stored as object) } as CmsContentMap[S];
}

export const getCmsPage = createServerFn({ method: "GET" })
  .inputValidator((slug: CmsSlug) => slugSchema.parse(slug))
  .handler(async ({ data: slug }): Promise<CmsContentMap[CmsSlug]> => {
    const { data, error } = await supabaseAdmin
      .from("cms_pages")
      .select("content")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("getCmsPage error", error);
      return CMS_DEFAULTS[slug];
    }
    return mergeWithDefaults(slug, data?.content);
  });

export const saveCmsPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { slug: CmsSlug; content: unknown }) => ({
    slug: slugSchema.parse(input.slug),
    content: input.content,
  }))
  .handler(async ({ data, context }) => {
    const schema = CMS_SCHEMAS[data.slug];
    const parsed = schema.parse(data.content);

    const { error } = await supabaseAdmin
      .from("cms_pages")
      .upsert(
        {
          slug: data.slug,
          content: parsed as unknown as Record<string, unknown>,
          updated_by: context.userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      );

    if (error) {
      console.error("saveCmsPage error", error);
      throw new Error(error.message);
    }
    return { ok: true };
  });
