/** @deprecated Bruk Finance Core API via src/lib/finance-core/ */
import type { FinanceEntry } from "./types";

function escape(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  if (/[",;\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Export entries to CSV. Amounts are converted from øre to NOK with dot separator. */
export function entriesToCsv(entries: FinanceEntry[]): string {
  const headers = [
    "voucher_number",
    "date_incurred",
    "entry_type",
    "category",
    "subcategory",
    "description",
    "counterparty",
    "gross_amount_nok",
    "fee_amount_nok",
    "net_amount_nok",
    "vat_rate",
    "vat_amount_nok",
    "payment_status",
    "invoice_status",
    "attachment_name",
    "pre_company_expense",
    "notes",
  ];
  const rows = entries.map((e) =>
    [
      e.voucher_number,
      e.date_incurred,
      e.entry_type,
      e.category,
      e.subcategory,
      e.description,
      e.counterparty,
      (e.gross_amount / 100).toFixed(2),
      e.fee_amount != null ? (e.fee_amount / 100).toFixed(2) : "",
      (e.net_amount / 100).toFixed(2),
      e.vat_rate,
      e.vat_amount != null ? (e.vat_amount / 100).toFixed(2) : "",
      e.payment_status,
      e.invoice_status,
      e.attachment_name,
      e.pre_company_expense ? "true" : "false",
      e.notes,
    ]
      .map(escape)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
