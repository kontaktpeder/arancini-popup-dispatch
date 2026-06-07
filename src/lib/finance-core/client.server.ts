// Server-only Finance Core HTTP client.
// Never import this from client code.
import type {
  AiReceiptScan,
  FinanceCoreAttachment,
  FinanceCoreCategoryReport,
  FinanceCoreEntry,
  FinanceCoreEntryInput,
  FinanceCoreEntryPatch,
  FinanceCoreSummary,
} from "./types";

export class FinanceCoreError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Finance Core error ${status}`);
    this.status = status;
    this.body = body;
  }
}

function getConfig() {
  const baseUrl = process.env.FINANCE_CORE_BASE_URL;
  const apiKey = process.env.FINANCE_CORE_API_KEY;
  if (!baseUrl || !apiKey) {
    throw new Error(
      "Missing FINANCE_CORE_BASE_URL or FINANCE_CORE_API_KEY env vars",
    );
  }
  return { baseUrl: baseUrl.replace(/\/+$/, ""), apiKey };
}

async function call<T>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey}`);
  headers.set("Accept", "application/json");

  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }

  const res = await fetch(`${baseUrl}${path}`, { ...init, headers, body });
  const text = await res.text();
  let parsed: unknown = null;
  if (text) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = text;
    }
  }
  if (!res.ok) {
    throw new FinanceCoreError(res.status, parsed);
  }
  return parsed as T;
}

function unwrap<T = unknown>(res: unknown): T {
  if (res && typeof res === "object") {
    const o = res as Record<string, unknown>;
    if ("data" in o) return o.data as T;
  }
  return res as T;
}

export function normalizeEntries(res: unknown): FinanceCoreEntry[] {
  if (Array.isArray(res)) return res as FinanceCoreEntry[];
  if (res && typeof res === "object") {
    const o = res as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as FinanceCoreEntry[];
    if (Array.isArray(o.entries)) return o.entries as FinanceCoreEntry[];
  }
  return [];
}

export const financeCore = {
  async getEntries(limit = 200): Promise<FinanceCoreEntry[]> {
    const res = await call<unknown>(`/api/public/v1/entries?limit=${limit}`);
    return normalizeEntries(res);
  },

  async getEntry(id: string): Promise<FinanceCoreEntry | null> {
    try {
      const res = await call<unknown>(`/api/public/v1/entries/${encodeURIComponent(id)}`);
      return unwrap<FinanceCoreEntry>(res);
    } catch (e) {
      if (e instanceof FinanceCoreError && e.status === 404) return null;
      throw e;
    }
  },

  async createEntry(input: FinanceCoreEntryInput): Promise<FinanceCoreEntry> {
    const res = await call<unknown>("/api/public/v1/entries", {
      method: "POST",
      json: input,
    });
    const entry = unwrap<FinanceCoreEntry>(res) ?? (res as any)?.entry ?? res;
    if (!entry || typeof entry !== "object" || !(entry as any).id) {
      throw new FinanceCoreError(500, res, "Missing data in createEntry response");
    }
    return entry as FinanceCoreEntry;
  },

  async patchEntry(id: string, patch: FinanceCoreEntryPatch): Promise<FinanceCoreEntry> {
    const res = await call<unknown>(`/api/public/v1/entries/${encodeURIComponent(id)}`, {
      method: "PATCH",
      json: patch,
    });
    return unwrap<FinanceCoreEntry>(res) ?? (res as any);
  },

  async listAttachments(entryId: string): Promise<FinanceCoreAttachment[]> {
    const res = await call<unknown>(
      `/api/public/v1/entries/${encodeURIComponent(entryId)}/attachments`,
    );
    const list = unwrap<unknown>(res);
    if (Array.isArray(list)) return list as FinanceCoreAttachment[];
    if (res && typeof res === "object") {
      const o = res as Record<string, unknown>;
      if (Array.isArray(o.attachments)) return o.attachments as FinanceCoreAttachment[];
    }
    return [];
  },

  async getSummary(year?: number): Promise<FinanceCoreSummary> {
    const qs = year ? `?year=${year}` : "";
    const res = await call<any>(`/api/public/v1/reports/summary${qs}`);
    const payload = res?.data ?? res?.summary ?? res;
    if (payload && (typeof payload.income === "number" || typeof payload.expense === "number")) {
      const income = Number(payload.income) || 0;
      const expense = Number(payload.expense) || 0;
      return {
        year: payload.year,
        income,
        expense,
        result: income - expense,
        months: payload.months,
      };
    }
    const months = payload?.months ?? {};
    let income = 0, expense = 0;
    for (const m of Object.values(months) as any[]) {
      income += Number(m?.income) || 0;
      expense += Number(m?.expense) || 0;
    }
    return { year: payload?.year, income, expense, result: income - expense, months };
  },

  async getCategoryReport(year?: number): Promise<FinanceCoreCategoryReport[] | null> {
    try {
      const qs = year ? `?year=${year}` : "";
      const res = await call<unknown>(`/api/public/v1/reports/categories${qs}`);
      const list = unwrap<unknown>(res);
      if (Array.isArray(list)) return list as FinanceCoreCategoryReport[];
      return [];
    } catch (e) {
      if (e instanceof FinanceCoreError && (e.status === 404 || e.status === 501)) return null;
      throw e;
    }
  },

  async uploadAttachment(file: File, entryId?: string): Promise<FinanceCoreAttachment> {
    const form = new FormData();
    form.append("file", file);
    if (entryId) form.append("entry_id", entryId);
    const { baseUrl, apiKey } = getConfig();
    const res = await fetch(`${baseUrl}/api/public/v1/attachments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
    if (!res.ok) throw new FinanceCoreError(res.status, parsed);
    return (unwrap<FinanceCoreAttachment>(parsed) ?? (parsed as any)) as FinanceCoreAttachment;
  },

  async scanReceipt(file: File): Promise<AiReceiptScan> {
    const form = new FormData();
    form.append("file", file);
    const { baseUrl, apiKey } = getConfig();
    const res = await fetch(`${baseUrl}/api/public/v1/ai/scan-receipt`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });
    const text = await res.text();
    let parsed: unknown = null;
    try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
    if (!res.ok) throw new FinanceCoreError(res.status, parsed);
    const data = unwrap<AiReceiptScan>(parsed) ?? (parsed as AiReceiptScan);
    return data;
  },
};
