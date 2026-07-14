import type { FinanceCoreEntryInput } from "./types";

export const SOURCE_APP = "gold-of-sicily";

export function mapTestEntry(): FinanceCoreEntryInput {
  return {
    entry_type: "income",
    description: "Gold of Sicily testinntekt",
    amount_gross: 100,
    amount_net: 100,
    category: "Test",
    source_app: SOURCE_APP,
    source_type: "test",
    source_ref: "gold-of-sicily-test-entry",
  };
}

export interface ManualEntryInput {
  entry_type: "income" | "expense";
  entry_date: string;
  description: string;
  amount_gross: number;
  category?: string;
  counterparty?: string;
  notes?: string;
}

export function mapManualEntry(m: ManualEntryInput): FinanceCoreEntryInput {
  return {
    entry_type: m.entry_type,
    entry_date: m.entry_date,
    description: m.description,
    amount_gross: m.amount_gross,
    amount_net: m.amount_gross,
    category: m.category,
    counterparty: m.counterparty,
    notes: m.notes,
    vat_rate: 0,
    source_app: SOURCE_APP,
    source_type: "manual",
    source_ref: `manual-${Date.now()}`,
  };
}
