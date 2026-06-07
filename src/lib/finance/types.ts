export interface FinanceBook {
  id: string;
  owner_type: "org";
  owner_id: string | null;
  name: string;
  type: "budget" | "actual";
  currency: string;
  status: "draft" | "active" | "closed";
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type FinanceEntryType = "income" | "expense";
export type FinanceEntryStatus = "planned" | "confirmed" | "paid" | "cancelled";
export type FinancePaymentStatus = "unpaid" | "paid" | "partial" | "cancelled";
export type FinanceInvoiceStatus = "pending" | "received" | "not_required";
export type FinanceSourceType = "manual" | "adjustment";

export interface FinanceEntry {
  id: string;
  book_id: string;
  entry_type: FinanceEntryType;
  source_type: FinanceSourceType;
  category: string | null;
  subcategory: string | null;
  description: string;
  counterparty: string | null;
  quantity: number | null;
  unit_amount: number | null;
  gross_amount: number;
  fee_amount: number | null;
  net_amount: number;
  vat_rate: number | null;
  vat_amount: number | null;
  date_incurred: string;
  date_paid: string | null;
  status: FinanceEntryStatus;
  sort_order: number | null;
  notes: string | null;
  voucher_number: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  internal_only: boolean;
  payment_status: FinancePaymentStatus;
  paid_amount: number | null;
  invoice_status: FinanceInvoiceStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}
