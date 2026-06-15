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
  ai_confidence?: number | null;
  ai_model?: string | null;
  ai_notes?: string | null;
  created_at: string;
}

export interface FinanceCoreEntryPatch {
  entry_date?: string;
  description?: string;
  counterparty?: string | null;
  category?: string | null;
  category_group?: string | null;
  amount_gross?: number;
  amount_net?: number;
  vat_rate?: number | null;
  payment_status?: PaymentStatus;
  invoice_status?: InvoiceStatus;
  notes?: string | null;
  external_url?: string | null;
}

export interface FinanceCoreAttachment {
  id: string;
  filename?: string | null;
  mime_type?: string | null;
  size?: number | null;
  url?: string | null;
  created_at?: string | null;
}

export interface FinanceCoreSummary {
  year?: number;
  income?: number;
  expense?: number;
  result?: number;
  months?: Record<string, { income?: number; expense?: number; vat?: number }>;
}

export interface FinanceCoreCategoryReport {
  category: string;
  amount: number;
  share?: number;
}

export interface AiReceiptScan {
  entry_type?: EntryType;
  entry_date?: string;
  counterparty?: string;
  description?: string;
  category?: string;
  category_group?: string;
  amount_gross?: number;
  amount_net?: number;
  vat_rate?: number;
  payment_status?: PaymentStatus;
  invoice_status?: InvoiceStatus;
  before_company_founded?: boolean;
  notes?: string;
  attachment_id?: string;
  attachment_url?: string;
  confidence?: number;
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

export type FinanceCoreInvoiceStatus = "draft" | "sent" | "paid";

export interface FinanceCoreInvoiceLine {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  vat_rate: number;
  line_net?: number;
  line_vat?: number;
  line_total?: number;
}

export interface FinanceCoreInvoiceInput {
  issue_date?: string;
  due_date?: string | null;
  customer_name: string;
  customer_org_number?: string | null;
  customer_email?: string | null;
  customer_address?: string | null;
  lines: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    vat_rate: number;
  }>;
}

export interface FinanceCoreInvoice {
  id: string;
  invoice_number: string | null;
  status: FinanceCoreInvoiceStatus;
  issue_date: string;
  due_date: string | null;
  customer_name: string;
  customer_org_number: string | null;
  customer_email: string | null;
  customer_address: string | null;
  subtotal: number;
  vat_amount: number;
  total: number;
  invoice_lines?: FinanceCoreInvoiceLine[];
}

export interface PopupFcInvoiceRef {
  reference_key: string;
  finance_core_invoice_id: string;
  invoice_number: string | null;
  status: FinanceCoreInvoiceStatus;
}
