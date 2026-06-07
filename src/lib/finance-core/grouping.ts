import { categoriesFor, normalizeCategory } from "./categories";
import type { EntryType, FinanceCoreEntry } from "./types";

export interface CategoryGroupData {
  category: string;
  entries: FinanceCoreEntry[];
  total: number;
  count: number;
  unpaidTotal: number;
  missingAttachmentCount: number;
}

export function groupByCategory(
  entries: FinanceCoreEntry[],
  type: EntryType,
): CategoryGroupData[] {
  const order = categoriesFor(type);
  const buckets = new Map<string, CategoryGroupData>();
  for (const cat of order) {
    buckets.set(cat, {
      category: cat,
      entries: [],
      total: 0,
      count: 0,
      unpaidTotal: 0,
      missingAttachmentCount: 0,
    });
  }
  for (const e of entries) {
    if (e.entry_type !== type) continue;
    const key = normalizeCategory(type, e.category);
    const bucket = buckets.get(key)!;
    const amount = Number(e.amount_gross) || 0;
    bucket.entries.push(e);
    bucket.total += amount;
    bucket.count++;
    if (e.payment_status === "unpaid") bucket.unpaidTotal += amount;
    if (type === "expense" && !(e.has_attachment || (e.attachment_count ?? 0) > 0)) {
      bucket.missingAttachmentCount++;
    }
  }
  // Sort entries inside each bucket: newest first
  for (const b of buckets.values()) {
    b.entries.sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1));
  }
  return Array.from(buckets.values());
}

export interface MonthRow {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  result: number;
}

export function monthsFromSummary(
  summary: { months?: Record<string, { income?: number; expense?: number }> } | null | undefined,
): MonthRow[] {
  const months = summary?.months ?? {};
  const rows: MonthRow[] = Object.entries(months).map(([m, v]) => {
    const income = Number(v?.income) || 0;
    const expense = Number(v?.expense) || 0;
    return { month: m, income, expense, result: income - expense };
  });
  // If summary did not include months, return empty (caller may derive from entries).
  rows.sort((a, b) => (a.month < b.month ? -1 : 1));
  return rows;
}

export function monthsFromEntries(entries: FinanceCoreEntry[]): MonthRow[] {
  const map = new Map<string, MonthRow>();
  for (const e of entries) {
    const m = (e.entry_date || "").slice(0, 7);
    if (!m) continue;
    const row = map.get(m) ?? { month: m, income: 0, expense: 0, result: 0 };
    const amt = Number(e.amount_gross) || 0;
    if (e.entry_type === "income") row.income += amt;
    else row.expense += amt;
    row.result = row.income - row.expense;
    map.set(m, row);
  }
  return Array.from(map.values()).sort((a, b) => (a.month < b.month ? -1 : 1));
}

export interface CategoryShareRow {
  category: string;
  amount: number;
  share: number;
}

export function categorySharesFromEntries(
  entries: FinanceCoreEntry[],
  type: EntryType,
): CategoryShareRow[] {
  const groups = groupByCategory(entries, type);
  const total = groups.reduce((s, g) => s + g.total, 0) || 1;
  return groups
    .filter((g) => g.total > 0)
    .map((g) => ({ category: g.category, amount: g.total, share: g.total / total }))
    .sort((a, b) => b.amount - a.amount);
}
