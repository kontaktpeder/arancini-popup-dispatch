import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const EVENT_TYPES = [
  "bryllup",
  "firmaevent",
  "festival",
  "bursdag",
  "popup_samarbeid",
  "annet",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(255),
  event_type: z.enum(EVENT_TYPES),
  guest_count: z.string().trim().max(50).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
  lang: z.enum(["no", "en"]).default("no"),
});

export const submitCollaborationInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin
      .from("collaboration_inquiries")
      .insert({
        name: data.name,
        email: data.email,
        event_type: data.event_type,
        guest_count: data.guest_count?.trim() || null,
        message: data.message,
        lang: data.lang,
      });
    if (error) {
      console.error("submitCollaborationInquiry error", error);
      throw new Error("Kunne ikke sende henvendelsen. Prøv igjen.");
    }
    return { ok: true };
  });
