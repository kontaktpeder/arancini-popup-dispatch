import { useState } from "react";
import { Sparkles, Upload, AlertCircle, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

import { ReceiptCameraInput } from "./ReceiptCameraInput";
import { ReceiptPreviewStep } from "./ReceiptPreviewStep";
import { ReceiptReviewStep } from "./ReceiptReviewStep";
import type { ReceiptDraft } from "./ReceiptFieldEditor";

import {
  useScanReceipt, useSendManualEntry, useUploadAttachment,
} from "@/lib/finance-core/hooks";
import type { AiReceiptScan } from "@/lib/finance-core/types";
import { normalizeReceiptFile } from "@/lib/receipt-image";

type Step = "capture" | "preview" | "review";

function emptyDraft(): ReceiptDraft {
  return {
    entry_type: "expense",
    entry_date: new Date().toISOString().slice(0, 10),
    counterparty: "",
    description: "",
    category: "Annet",
    amount_gross: 0,
    vat_rate: 0,
    payment_status: "unpaid",
    invoice_status: "received",
    before_company_founded: false,
    notes: "",
  };
}

function fromScan(s: AiReceiptScan): ReceiptDraft {
  return {
    entry_type: s.entry_type ?? "expense",
    entry_date: s.entry_date ?? new Date().toISOString().slice(0, 10),
    counterparty: s.counterparty ?? "",
    description: s.description ?? "",
    category: s.category ?? "Annet",
    amount_gross: s.amount_gross ?? 0,
    vat_rate: s.vat_rate ?? 0,
    payment_status: s.payment_status ?? "unpaid",
    invoice_status: s.invoice_status ?? "received",
    before_company_founded: s.before_company_founded ?? false,
    notes: s.notes ?? "",
  };
}

interface Props {
  /** Render compact (icon-only-ish) trigger for the toolbar. Defaults to large mobile-first CTA. */
  variant?: "primary" | "compact";
}

export function MobileReceiptScanButton({ variant = "primary" }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("capture");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReceiptDraft | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const scan = useScanReceipt();
  const create = useSendManualEntry();
  const upload = useUploadAttachment();

  function resetAll() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setDraft(null);
    setConfidence(null);
    setScanError(null);
    setStep("capture");
  }

  function close() {
    resetAll();
    setOpen(false);
  }

  function pickFile(f: File) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setDraft(null);
    setConfidence(null);
    setScanError(null);
    setStep("preview");
  }

  async function runScan() {
    if (!file) return;
    setScanError(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await scan.mutateAsync(form);
      setDraft(fromScan(r.scan));
      setConfidence(r.scan.confidence ?? null);
      setStep("review");
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      setScanError(msg);
      toast.error(`AI-skanning feilet: ${msg}`);
    }
  }

  function manualFromImage() {
    setDraft(emptyDraft());
    setConfidence(null);
    setScanError(null);
    setStep("review");
  }

  async function approve() {
    if (!draft) return;
    if (!draft.description || !draft.amount_gross) {
      toast.error("Beskrivelse og beløp er påkrevd");
      return;
    }
    try {
      const notes = [
        draft.notes,
        draft.before_company_founded ? "Før selskapsstiftelse." : "",
      ].filter(Boolean).join(" ").trim() || undefined;
      const r = await create.mutateAsync({
        entry_type: draft.entry_type,
        entry_date: draft.entry_date,
        description: draft.description,
        amount_gross: draft.amount_gross,
        category: draft.category,
        counterparty: draft.counterparty || undefined,
        notes,
      });
      if (file && r.entry?.id) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("entry_id", r.entry.id);
        try {
          await upload.mutateAsync(fd);
        } catch (e) {
          console.warn("Attachment upload failed", e);
        }
      }
      toast.success("Post opprettet i Finance Core");
      close();
    } catch (e: any) {
      toast.error(`Kunne ikke opprette post: ${e?.message ?? e}`);
    }
  }

  // Trigger
  const Trigger = variant === "compact" ? (
    <Button variant="default" size="sm">
      <Sparkles className="h-4 w-4" /> Skann
    </Button>
  ) : (
    <Button size="lg" className="h-14 w-full text-base">
      <Sparkles className="h-5 w-5" /> Skann kvittering
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={
          isMobile
            ? "h-[100dvh] w-full max-w-none p-0 flex flex-col gap-0"
            : "h-[100dvh] w-full max-w-3xl sm:max-w-3xl p-0 flex flex-col gap-0"
        }
      >
        <SheetHeader className="border-b px-4 py-3 text-left">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" /> Skann kvittering
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
          {step === "capture" && (
            <div className="flex h-full flex-col justify-center gap-4">
              <p className="text-center text-sm text-muted-foreground">
                Ta bilde av kvitteringen eller velg fra galleriet. AI foreslår felter — du godkjenner før posten bokføres.
              </p>
              <ReceiptCameraInput onFile={pickFile} />
            </div>
          )}

          {step === "preview" && file && previewUrl && (
            <div className="flex h-full flex-col gap-3">
              <ReceiptPreviewStep
                file={file}
                previewUrl={previewUrl}
                scanning={scan.isPending}
                onRetake={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setFile(null);
                  setPreviewUrl(null);
                  setStep("capture");
                }}
                onUse={runScan}
              />
              {scanError && (
                <div className="space-y-2 rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm">
                  <div className="flex items-start gap-2 text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>AI-skanning feilet. Du kan opprette posten manuelt med samme bilde.</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={manualFromImage}>
                    <Pencil className="h-4 w-4" /> Opprett manuelt
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === "review" && file && previewUrl && draft && (
            <ReceiptReviewStep
              file={file}
              previewUrl={previewUrl}
              draft={draft}
              confidence={confidence}
              onChange={(patch) => setDraft((d) => (d ? { ...d, ...patch } : d))}
            />
          )}
        </div>

        {step === "review" && (
          <div className="sticky bottom-0 border-t bg-background/95 px-4 py-3 backdrop-blur">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="h-12 flex-1"
                onClick={() => setStep("preview")}
              >
                Tilbake
              </Button>
              <Button
                className="h-12 flex-[2]"
                onClick={approve}
                disabled={create.isPending}
              >
                <Upload className="h-4 w-4" />
                {create.isPending ? "Oppretter…" : "Godkjenn og opprett post"}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
