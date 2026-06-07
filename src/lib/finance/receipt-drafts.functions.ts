import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AnalyzeInput = z.object({ draftId: z.string().uuid() });

const SYSTEM_PROMPT = `You are an assistant that reads Norwegian receipts and invoices and extracts structured bookkeeping fields. Return ONLY valid JSON, no markdown.

Schema:
{
  "entry_type": "expense" | "income",
  "date_incurred": "YYYY-MM-DD",
  "counterparty": string,
  "description": string,
  "category": string,
  "gross_amount": number,
  "vat_rate": number | null,
  "vat_amount": number | null,
  "payment_status": "paid" | "unpaid" | "partial",
  "invoice_status": "received" | "pending" | "not_required",
  "pre_company_expense": boolean,
  "confidence": { "date_incurred": number, "counterparty": number, "gross_amount": number, "vat_amount": number },
  "field_notes": { "date_incurred": string, "counterparty": string, "gross_amount": string, "vat_amount": string }
}

Rules:
- gross_amount and vat_amount are in ØRE (kroner * 100). E.g. 1234.50 NOK = 123450.
- vat_rate is a decimal: 0.25 for 25%, 0.15 for 15%, null if unclear.
- confidence values are 0.0-1.0.
- If receipt looks like a payment (card terminal slip), payment_status = "paid".
- entry_type defaults to "expense" unless clearly a sales invoice from us.
- pre_company_expense = false unless date clearly precedes company formation; you can't know — keep false.
- field_notes are short Norwegian explanations of where the value came from.`;

export const analyzeReceiptDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => AnalyzeInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");

    const { data: draft, error: dErr } = await supabase
      .from("finance_receipt_drafts" as any)
      .select("*")
      .eq("id", data.draftId)
      .single();
    if (dErr || !draft) throw new Error(dErr?.message || "Draft not found");

    const d = draft as any;
    if (!d.file_path) throw new Error("Draft missing file_path");

    // Download from storage and convert to base64 data URL
    const { data: blob, error: dlErr } = await supabase.storage
      .from("finance-bilag")
      .download(d.file_path);
    if (dlErr || !blob) throw new Error(dlErr?.message || "Could not download file");

    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
    const b64 = btoa(bin);
    const mime = d.mime_type || blob.type || "image/jpeg";
    const dataUrl = `data:${mime};base64,${b64}`;

    try {
      const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Analyser denne kvitteringen/fakturaen og returner JSON i henhold til skjemaet. Husk: beløp i øre.",
                },
                { type: "image_url", image_url: { url: dataUrl } },
              ],
            },
          ],
          response_format: { type: "json_object" },
        }),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`AI gateway ${resp.status}: ${text.slice(0, 300)}`);
      }
      const json = (await resp.json()) as any;
      const content = json?.choices?.[0]?.message?.content ?? "{}";
      let suggestion: any;
      try {
        suggestion = JSON.parse(content);
      } catch {
        suggestion = { _raw: content };
      }

      await supabase
        .from("finance_receipt_drafts" as any)
        .update({
          ai_suggestion: suggestion,
          extracted_text: typeof content === "string" ? content : null,
          status: "draft",
          error: null,
        })
        .eq("id", data.draftId);

      return { ok: true, suggestion };
    } catch (e: any) {
      await supabase
        .from("finance_receipt_drafts" as any)
        .update({ error: String(e?.message || e), status: "draft" })
        .eq("id", data.draftId);
      throw e;
    }
  });
