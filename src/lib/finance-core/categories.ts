import type { EntryType } from "./types";

export const EXPENSE_CATEGORIES = [
  "Råvarer",
  "Emballasje",
  "Transport",
  "Verktøy og utstyr",
  "Markedsføring",
  "Programvare",
  "Oppstartskostnad",
  "Annet",
] as const;

export const INCOME_CATEGORIES = [
  "Popup-salg",
  "Catering",
  "Eventer",
  "Test",
  "Annet",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export function categoriesFor(type: EntryType): readonly string[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

export function normalizeCategory(type: EntryType, raw: string | null | undefined): string {
  const list = categoriesFor(type);
  if (!raw) return "Annet";
  const hit = list.find((c) => c.toLowerCase() === raw.toLowerCase());
  return hit ?? "Annet";
}

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "Ubetalt",
  paid: "Betalt",
  partial: "Delvis betalt",
  cancelled: "Kansellert",
};

export const INVOICE_STATUS_LABEL: Record<string, string> = {
  pending: "Avventer",
  sent: "Sendt",
  received: "Mottatt",
  not_required: "Ikke nødvendig",
};
