import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { financeCore, FinanceCoreError } from "./client.server";
import { scanReceiptWithFallback } from "./scan-receipt-ai.server";
import { mapManualEntry, mapTestEntry } from "./mappers";
import type {
  AccountingStatus,
  FinanceCoreCategoryReport,
  FinanceCoreEntry,
} from "./types";

function aggregate(entries: FinanceCoreEntry[]) {
  let income = 0, expense = 0, unpaid = 0, missing = 0;
  for (const e of entries) {
    if (e.entry_type === "income") income += Number(e.amount_gross) || 0;
    else expense += Number(e.amount_gross) || 0;
    if (e.payment_status === "unpaid") unpaid++;
    if (e.entry_type === "expense" && !(e.has_attachment || (e.attachment_count ?? 0) > 0)) missing++;
  }
  return { income, expense, result: income - expense, unpaidCount: unpaid, missingAttachmentCount: missing };
}

function logFcError(label: string, e: unknown) {
  if (e instanceof FinanceCoreError) {
    console.error(`[finance-core] ${label} failed: status=${e.status} body=`, e.body);
  } else {
    console.error(`[finance-core] ${label} failed:`, e);
  }
}

export const getAccountingStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<AccountingStatus> => {
    const year = new Date().getFullYear();
    const [entriesResult, summaryResult] = await Promise.allSettled([
      financeCore.getEntries(300),
      financeCore.getSummary(year),
    ]);

    let entries: FinanceCoreEntry[] = [];
    if (entriesResult.status === "fulfilled") {
      entries = entriesResult.value;
    } else {
      logFcError("getEntries", entriesResult.reason);
      const r = entriesResult.reason;
      const msg = r instanceof FinanceCoreError ? `Finance Core ${r.status}: ${JSON.stringify(r.body)}` : (r?.message ?? String(r));
      throw new Error(msg);
    }

    let summary = null as AccountingStatus["summary"];
    if (summaryResult.status === "fulfilled") {
      summary = summaryResult.value;
    } else {
      logFcError("getSummary", summaryResult.reason);
    }

    return { summary, entries, totals: aggregate(entries) };
  });

export const sendTestIncome = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    try {
      const entry = await financeCore.createEntry(mapTestEntry());
      return { ok: true, alreadyExists: false, entry };
    } catch (e) {
      if (e instanceof FinanceCoreError && e.status === 400) {
        return { ok: true, alreadyExists: true, entry: null };
      }
      throw e;
    }
  });

const ManualSchema = z.object({
  entry_type: z.enum(["income", "expense"]),
  entry_date: z.string().min(8).max(20),
  description: z.string().min(1).max(500),
  amount_gross: z.number().positive(),
  category: z.string().max(120).optional(),
  counterparty: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

export const sendManualEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ManualSchema.parse(d))
  .handler(async ({ data }) => {
    const entry = await financeCore.createEntry(mapManualEntry(data));
    return { ok: true, entry };
  });

export const uploadAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    if (!(d instanceof FormData)) throw new Error("Expected FormData");
    return d;
  })
  .handler(async ({ data }) => {
    const file = data.get("file");
    const entryId = (data.get("entry_id") as string) || undefined;
    if (!(file instanceof File)) throw new Error("Missing file");
    const attachment = await financeCore.uploadAttachment(file, entryId);
    return { ok: true, attachment };
  });

/* ── New: PATCH entry ─────────────────────────────────────── */
const PatchSchema = z.object({
  id: z.string().min(1),
  patch: z.object({
    entry_date: z.string().min(8).max(20).optional(),
    description: z.string().min(1).max(500).optional(),
    counterparty: z.string().max(200).nullable().optional(),
    category: z.string().max(120).nullable().optional(),
    category_group: z.string().max(120).nullable().optional(),
    amount_gross: z.number().optional(),
    amount_net: z.number().optional(),
    vat_rate: z.number().min(0).max(1).nullable().optional(),
    payment_status: z.enum(["unpaid", "paid", "partial", "cancelled"]).optional(),
    invoice_status: z.enum(["pending", "sent", "received", "not_required"]).optional(),
    notes: z.string().max(2000).nullable().optional(),
    external_url: z.string().url().nullable().optional(),
  }),
});

export const patchEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => PatchSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const entry = await financeCore.patchEntry(data.id, data.patch);
      return { ok: true, supported: true, entry };
    } catch (e) {
      if (e instanceof FinanceCoreError && (e.status === 404 || e.status === 405 || e.status === 501)) {
        return { ok: false, supported: false, entry: null };
      }
      throw e;
    }
  });

/* ── New: GET single entry ────────────────────────────────── */
export const fetchEntry = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const entry = await financeCore.getEntry(data.id);
    return { entry };
  });

/* ── New: list attachments for an entry (degrades gracefully) ── */
export const listEntryAttachments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ entryId: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const attachments = await financeCore.listAttachments(data.entryId);
      return { ok: true, supported: true, attachments };
    } catch (e) {
      if (e instanceof FinanceCoreError && (e.status === 404 || e.status === 501)) {
        return { ok: false, supported: false, attachments: [] };
      }
      throw e;
    }
  });

/* ── New: category report ─────────────────────────────────── */
export const fetchCategoryReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ year: z.number().int().optional() }).parse(d))
  .handler(async ({ data }) => {
    const rows = await financeCore.getCategoryReport(data.year);
    return { supported: rows !== null, rows: (rows ?? []) as FinanceCoreCategoryReport[] };
  });

/* ── New: AI scan receipt ─────────────────────────────────── */
export const scanReceipt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => {
    if (!(d instanceof FormData)) throw new Error("Expected FormData");
    return d;
  })
  .handler(async ({ data }) => {
    const file = data.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    const { scan, source } = await scanReceiptWithFallback(
      (f) => financeCore.scanReceipt(f),
      file,
    );
    return { ok: true, scan, source };
  });

/* ── New: DELETE entry ────────────────────────────────────── */
export const deleteEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    await financeCore.deleteEntry(data.id);
    return { ok: true };
  });

/* ── New: DELETE attachment ───────────────────────────────── */
export const deleteAttachment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    await financeCore.deleteAttachment(data.id);
    return { ok: true };
  });
