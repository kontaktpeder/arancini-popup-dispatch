import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { financeCore, FinanceCoreError, normalizeEntries } from "./client.server";
import {
  mapKlinkSettlement,
  mapManualEntry,
  mapTestEntry,
} from "./mappers";
import type { AccountingStatus, FinanceCoreEntry } from "./types";

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

export const getAccountingStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async (): Promise<AccountingStatus> => {
    const year = new Date().getFullYear();
    const [entriesRes, summary] = await Promise.all([
      financeCore.getEntries(200).catch((e) => { console.error("[finance-core] getEntries", e); return [] as FinanceCoreEntry[]; }),
      financeCore.getSummary(year).catch((e) => { console.error("[finance-core] getSummary", e); return null; }),
    ]);
    const entries = normalizeEntries(entriesRes as any);
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

const KlinkSchema = z.object({
  eventSlug: z.string().min(1).max(120).regex(/^[a-z0-9_-]+$/i),
  eventName: z.string().min(1).max(200),
  settlementDate: z.string().min(8).max(20),
  totalRevenueNok: z.number().positive(),
  ourSharePercent: z.number().min(0).max(100),
  reportUrl: z.string().url().optional(),
});

export const sendKlinkSettlement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => KlinkSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      const entry = await financeCore.createEntry(mapKlinkSettlement(data));
      return { ok: true, alreadyExists: false, entry };
    } catch (e) {
      if (e instanceof FinanceCoreError && e.status === 400) {
        return { ok: true, alreadyExists: true, entry: null };
      }
      throw e;
    }
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
    await financeCore.uploadAttachment(file, entryId);
    return { ok: true };
  });
