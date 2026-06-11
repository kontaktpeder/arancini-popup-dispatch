import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { POPUP_DEFAULTS } from "./defaults";
import type { SitePopupSettings } from "./types";

const popupSchema = z.object({
  popup_status: z.enum(["announced", "coming_soon"]),
  venue: z.string().trim().max(200).nullable().optional(),
  date_label: z.string().trim().max(200).nullable().optional(),
  date_label_en: z.string().trim().max(200).nullable().optional(),
  date_short: z.string().trim().max(120).nullable().optional(),
  date_short_en: z.string().trim().max(120).nullable().optional(),
  time_label: z.string().trim().max(60).nullable().optional(),
  address_short: z.string().trim().max(200).nullable().optional(),
  address_full: z.string().trim().max(400).nullable().optional(),
  maps_google: z.string().trim().max(800).nullable().optional(),
  maps_apple: z.string().trim().max(800).nullable().optional(),
  countdown_target: z.string().trim().nullable().optional(),
});

export const getPopupSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SitePopupSettings> => {
    const { data, error } = await supabaseAdmin
      .from("site_popup_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) console.error("getPopupSettings error", error);
      return {
        id: "",
        updated_at: new Date().toISOString(),
        ...POPUP_DEFAULTS,
      };
    }
    return data as SitePopupSettings;
  },
);

export const savePopupSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => popupSchema.parse(input))
  .handler(async ({ data }) => {
    const { data: existing } = await supabaseAdmin
      .from("site_popup_settings")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const payload = {
      popup_status: data.popup_status,
      venue: data.venue ?? null,
      date_label: data.date_label ?? null,
      date_label_en: data.date_label_en ?? null,
      date_short: data.date_short ?? null,
      date_short_en: data.date_short_en ?? null,
      time_label: data.time_label ?? null,
      address_short: data.address_short ?? null,
      address_full: data.address_full ?? null,
      maps_google: data.maps_google ?? null,
      maps_apple: data.maps_apple ?? null,
      countdown_target: data.countdown_target ?? null,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      const { error } = await supabaseAdmin
        .from("site_popup_settings")
        .update(payload)
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("site_popup_settings")
        .insert(payload);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });
