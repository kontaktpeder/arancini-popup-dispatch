import type { FinanceCoreEntryInput } from "./types";

export const SOURCE_APP = "gold-of-sicily";

export interface KlinkSettlementInput {
  eventSlug: string;
  eventName: string;
  settlementDate: string; // YYYY-MM-DD
  totalRevenueNok: number;
  ourSharePercent: number;
  reportUrl?: string;
}

export function mapKlinkSettlement(s: KlinkSettlementInput): FinanceCoreEntryInput {
  const ourShare = Math.round(s.totalRevenueNok * (s.ourSharePercent / 100));
  return {
    entry_type: "income",
    entry_date: s.settlementDate,
    description: `Andel av omsetning fra ${s.eventName}`,
    counterparty: s.eventName,
    category: "Popup-salg",
    category_group: "Inntekter",
    amount_gross: ourShare,
    amount_net: ourShare,
    vat_rate: 0,
    payment_status: "unpaid",
    invoice_status: "sent",
    source_app: SOURCE_APP,
    source_type: "popup_settlement",
    source_ref: s.eventSlug,
    external_url: s.reportUrl,
    notes: `Total omsetning: ${s.totalRevenueNok} kr. Vår andel: ${s.ourSharePercent}%.`,
  };
}

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
