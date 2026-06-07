// Finance Core API types. Amounts are NOK decimals (not øre).

export type EntryType = "income" | "expense";
export type PaymentStatus = "unpaid" | "paid" | "partial" | "cancelled";
export type InvoiceStatus = "pending" | "sent" | "received" | "not_required";

export interface FinanceCoreEntryInput {
  entry_type: EntryType;
  entry_date?: string; // YYYY-MM-DD
  description: string;
  counterparty?: string;
  category?: string;
  category_group?: string;
  amount_gross: number; // NOK
  amount_net?: number; // NOK
  vat_rate?: number; // 0..1 (omit if unknown). Never null.
  payment_status?: PaymentStatus;
  invoice_status?: InvoiceStatus;
  source_app: string;
  source_type?: string;
  source_ref?: string;
  external_url?: string; // Must be full https:// URL
  notes?: string;
}

export interface FinanceCoreEntry {
  id: string;
  entry_type: EntryType;
  entry_date: string;
  description: string;
  counterparty: string | null;
  category: string | null;
  category_group: string | null;
  amount_gross: number;
  amount_net: number;
  vat_rate: number | null;
  payment_status: PaymentStatus;
  invoice_status: InvoiceStatus;
  source_app: string | null;
  source_type: string | null;
  source_ref: string | null;
  external_url: string | null;
  notes: string | null;
  has_attachment?: boolean;
  attachment_count?: number;
  created_at: string;
}

export interface FinanceCoreSummary {
  year?: number;
  income?: number;
  expense?: number;
  result?: number;
}

export interface AccountingStatus {
  summary: FinanceCoreSummary | null;
  entries: FinanceCoreEntry[];
  totals: {
    income: number;
    expense: number;
    result: number;
    unpaidCount: number;
    missingAttachmentCount: number;
  };
}
