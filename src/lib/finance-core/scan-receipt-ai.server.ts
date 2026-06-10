import type { AiReceiptScan, EntryType } from "./types";
import { FinanceCoreError } from "./client.server";
import { normalizeCategory } from "./categories";

const SYSTEM_PROMPT = `Du leser norske kvitteringer og fakturaer. Returner KUN gyldig JSON, ingen markdown.
Schema (beløp i NOK kroner, IKKE øre):
{
  "entry_type": "expense" | "income",
  "entry_date": "YYYY-MM-DD",
  "counterparty": string,
  "description": string,
  "category": string,
  "amount_gross": number,
  "vat_rate": number,
  "payment_status": "paid" | "unpaid" | "partial",
  "invoice_status": "received" | "pending" | "not_required",
  "before_company_founded": boolean,
  "notes": string,
  "confidence": number
}
Regler:
- amount_gross er i kroner (f.eks. 1234.50), ikke øre
- vat_rate som desimal (0.25 = 25%)
- payment_status = "paid" for kortkvittering
- confidence 0.0–1.0 (ett tall for hele tolkningen)`;

async function fileToDataUrl(file: File): Promise<string> {
  const buf = new Uint8Array(await file.arrayBuffer());
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  const b64 = btoa(bin);
  const mime = file.type || "image/jpeg";
  return `data:${mime};base64,${b64}`;
}

function mapGatewayJson(raw: Record<string, unknown>): AiReceiptScan {
  const entryType = (raw.entry_type === "income" ? "income" : "expense") as EntryType;
  let amount = Number(raw.amount_gross ?? raw.gross_amount ?? 0);
  if (amount > 100_000 && Number.isInteger(amount)) amount = amount / 100;

  return {
    entry_type: entryType,
    entry_date:
      typeof raw.entry_date === "string"
        ? raw.entry_date
        : typeof raw.date_incurred === "string"
        ? (raw.date_incurred as string)
        : undefined,
    counterparty: String(raw.counterparty ?? ""),
    description: String(raw.description ?? ""),
    category: normalizeCategory(entryType, String(raw.category ?? "")),
    amount_gross: amount,
    vat_rate: Number(raw.vat_rate ?? 0),
    payment_status: (raw.payment_status as AiReceiptScan["payment_status"]) ?? "unpaid",
    invoice_status: (raw.invoice_status as AiReceiptScan["invoice_status"]) ?? "received",
    before_company_founded: Boolean(
      raw.before_company_founded ?? raw.pre_company_expense ?? false,
    ),
    notes: typeof raw.notes === "string" ? raw.notes : "",
    confidence: typeof raw.confidence === "number" ? raw.confidence : undefined,
  };
}

export async function scanReceiptWithLovableGateway(file: File): Promise<AiReceiptScan> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) throw new Error("Missing LOVABLE_API_KEY");
  if (file.type === "application/pdf") {
    throw new Error(
      "PDF-støtte krever Finance Core AI-endepunkt. Bruk bilde eller «Opprett manuelt».",
    );
  }

  const dataUrl = await fileToDataUrl(file);
  const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyser kvitteringen og returner JSON." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`AI gateway ${resp.status}: ${text.slice(0, 200)}`);
  }

  const json = await resp.json();
  const content = json?.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as Record<string, unknown>;
  return mapGatewayJson(parsed);
}

export async function scanReceiptWithFallback(
  financeCoreScan: (file: File) => Promise<AiReceiptScan>,
  file: File,
): Promise<{ scan: AiReceiptScan; source: "finance-core" | "lovable-gateway" }> {
  try {
    const scan = await financeCoreScan(file);
    return { scan, source: "finance-core" };
  } catch (e) {
    if (
      e instanceof FinanceCoreError &&
      (e.status === 404 || e.status === 501)
    ) {
      console.warn(
        "[scan-receipt] Finance Core unavailable, falling back to Lovable gateway",
      );
      const scan = await scanReceiptWithLovableGateway(file);
      return { scan, source: "lovable-gateway" };
    }
    throw e;
  }
}
