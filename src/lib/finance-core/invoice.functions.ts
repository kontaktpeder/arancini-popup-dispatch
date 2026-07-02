import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { financeCore, FinanceCoreError } from "./client.server";
import { mapPopupSettlementToInvoiceInput } from "./invoice.mappers";
import type { FinanceCoreInvoice, PopupFcInvoiceRef } from "./types";

const LineSchema = z.object({
  eventName: z.string().min(1).max(120),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalRevenueNok: z.number().positive(),
  ourSharePercent: z.number().min(0).max(100),
  vatRate: z.number().min(0).max(100).optional(),
});

const CreatePopupInvoiceSchema = z.object({
  referenceKey: z.string().min(1).max(120).regex(/^[a-z0-9_-]+$/i),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lines: z.array(LineSchema).min(1),
});

export type CreatePopupInvoiceResult = {
  ok: true;
  alreadyExists: boolean;
  invoice: FinanceCoreInvoice;
  local: PopupFcInvoiceRef | null;
};

export type SendPopupInvoiceResult = {
  ok: true;
  invoice: FinanceCoreInvoice;
};

function fcErrorMessage(e: unknown): string {
  if (e instanceof FinanceCoreError) {
    const body = e.body as { message?: string; error?: string } | null;
    return body?.message ?? body?.error ?? e.message;
  }
  return e instanceof Error ? e.message : String(e);
}

async function loadLocalRef(
  supabase: { from: (t: string) => any },
  referenceKey: string,
): Promise<PopupFcInvoiceRef | null> {
  const { data } = await supabase
    .from("popup_fc_invoices")
    .select("reference_key, finance_core_invoice_id, invoice_number, status")
    .eq("reference_key", referenceKey)
    .maybeSingle();
  return (data as PopupFcInvoiceRef | null) ?? null;
}

export const createPopupInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreatePopupInvoiceSchema.parse(d))
  .handler(async ({ data, context }): Promise<CreatePopupInvoiceResult> => {
    const { supabase } = context;

    const existing = await loadLocalRef(supabase, data.referenceKey);
    if (existing) {
      const invoice = await financeCore.getInvoice(existing.finance_core_invoice_id);
      return { ok: true, alreadyExists: true, invoice, local: existing };
    }

    try {
      const invoice = await financeCore.createInvoice(
        mapPopupSettlementToInvoiceInput({
          issueDate: data.issueDate,
          dueDate: data.dueDate,
          lines: data.lines,
        }),
      );

      const { error } = await supabase.from("popup_fc_invoices").insert({
        reference_key: data.referenceKey,
        finance_core_invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        status: invoice.status,
      });
      if (error) throw new Error(error.message);

      return { ok: true, alreadyExists: false, invoice, local: null };
    } catch (e) {
      throw new Error(fcErrorMessage(e));
    }
  });

export const sendPopupInvoice = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<SendPopupInvoiceResult> => {
    const { supabase } = context;
    try {
      const invoice = await financeCore.sendInvoice(data.invoiceId, {
        sourceApp: "gold-of-sicily",
      });

      await supabase
        .from("popup_fc_invoices")
        .update({
          status: invoice.status,
          invoice_number: invoice.invoice_number,
        })
        .eq("finance_core_invoice_id", invoice.id);

      return { ok: true, invoice };
    } catch (e) {
      throw new Error(fcErrorMessage(e));
    }
  });

export const fetchPopupInvoice = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ invoiceId: z.string().uuid() }).parse(d))
  .handler(async ({ data }): Promise<{ invoice: FinanceCoreInvoice }> => {
    const invoice = await financeCore.getInvoice(data.invoiceId);
    return { invoice };
  });

export const fetchPopupInvoicePdf = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        invoiceId: z.string().uuid().optional(),
        invoiceNumber: z.string().min(1).max(60).optional(),
      })
      .refine((v) => !!v.invoiceId || !!v.invoiceNumber, {
        message: "invoiceId or invoiceNumber required",
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ base64: string; fileName: string }> => {
    let invoiceId = data.invoiceId;
    if (!invoiceId && data.invoiceNumber) {
      const { supabase } = context;
      const { data: row } = await supabase
        .from("popup_fc_invoices")
        .select("finance_core_invoice_id")
        .eq("invoice_number", data.invoiceNumber)
        .maybeSingle();
      invoiceId = (row as { finance_core_invoice_id?: string } | null)?.finance_core_invoice_id;
      if (!invoiceId) {
        throw new Error(`Fant ingen faktura med nummer ${data.invoiceNumber}`);
      }
    }
    const { bytes, fileName } = await financeCore.getInvoicePdf(invoiceId!);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return { base64: btoa(bin), fileName };
  });
