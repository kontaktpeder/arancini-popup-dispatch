// Server-only Finance Core HTTP client.
// Never import this from client code.
import type {
  FinanceCoreEntry,
  FinanceCoreEntryInput,
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

export const financeCore = {
  async getEntries(limit = 100): Promise<{ entries: FinanceCoreEntry[] } | FinanceCoreEntry[]> {
    return call(`/api/public/v1/entries?limit=${limit}`);
  },
  async createEntry(input: FinanceCoreEntryInput): Promise<FinanceCoreEntry> {
    const res = await call<{ entry?: FinanceCoreEntry } | FinanceCoreEntry>(
      "/api/public/v1/entries",
      { method: "POST", json: input },
    );
    return (res as any).entry ?? (res as FinanceCoreEntry);
  },
  async getSummary(year?: number): Promise<FinanceCoreSummary> {
    const qs = year ? `?year=${year}` : "";
    const res = await call<FinanceCoreSummary | { summary: FinanceCoreSummary }>(
      `/api/public/v1/reports/summary${qs}`,
    );
    return (res as any).summary ?? (res as FinanceCoreSummary);
  },
  async uploadAttachment(file: File, entryId?: string): Promise<unknown> {
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
    return parsed;
  },
};

export function normalizeEntries(
  res: { entries: FinanceCoreEntry[] } | FinanceCoreEntry[],
): FinanceCoreEntry[] {
  return Array.isArray(res) ? res : res.entries ?? [];
}
