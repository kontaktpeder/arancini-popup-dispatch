import { useState } from "react";
import { Sparkles, Upload, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useScanReceipt, useSendManualEntry, useUploadAttachment } from "@/lib/finance-core/hooks";
import { categoriesFor, INVOICE_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/finance-core/categories";
import type { AiReceiptScan, EntryType } from "@/lib/finance-core/types";

interface DraftForm {
  entry_type: EntryType;
  entry_date: string;
  counterparty: string;
  description: string;
  category: string;
  amount_gross: number;
  vat_rate: number;
  payment_status: string;
  invoice_status: string;
  before_company_founded: boolean;
  notes: string;
}

function emptyDraft(): DraftForm {
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

function fromScan(s: AiReceiptScan): DraftForm {
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

export function AiScanDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftForm | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);

  const scan = useScanReceipt();
  const create = useSendManualEntry();
  const upload = useUploadAttachment();

  function reset() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setDraft(null);
    setConfidence(null);
  }

  function close() {
    reset();
    setOpen(false);
  }

  function onFile(f: File | null) {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setDraft(null);
  }

  async function runScan() {
    if (!file) {
      toast.error("Velg en fil først");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await scan.mutateAsync(form);
      setDraft(fromScan(r.scan));
      setConfidence(r.scan.confidence ?? null);
      toast.success("AI-forslag klart — kontroller før du oppretter post");
    } catch (e: any) {
      toast.error(`AI-skanning feilet: ${e?.message ?? e}`);
    }
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
      // Koble bilag til ny post
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

  const cats = draft ? categoriesFor(draft.entry_type) : [];

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogTrigger asChild>
        <Button variant="default">
          <Sparkles className="h-4 w-4" /> AI-skann kvittering
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> AI-skanning av kvittering
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50/40 p-2 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
          AI kan tolke feil. Kontroller dato, beløp, leverandør og MVA før posten opprettes.
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Document panel */}
          <div className="space-y-3">
            <div>
              <Label>Last opp kvittering eller faktura</Label>
              <Input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-lg border bg-muted/30">
              {!previewUrl && (
                <div className="px-6 text-center text-sm text-muted-foreground">
                  Velg en kvittering for å forhåndsvise.
                </div>
              )}
              {previewUrl && file?.type.startsWith("image/") && (
                <img src={previewUrl} alt="Kvittering" className="max-h-[420px] w-full object-contain" />
              )}
              {previewUrl && file?.type === "application/pdf" && (
                <iframe src={previewUrl} className="h-[420px] w-full" title="PDF-forhåndsvisning" />
              )}
            </div>
            <Button onClick={runScan} disabled={!file || scan.isPending} className="w-full">
              {scan.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {scan.isPending ? "Analyserer…" : "Kjør AI-skanning"}
            </Button>
          </div>

          {/* AI suggestion panel */}
          <div className="space-y-3">
            {!draft && (
              <div className="flex h-full min-h-[320px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                {scan.isPending ? "Henter AI-forslag…" : "AI-forslag vises her etter skanning."}
              </div>
            )}
            {draft && (
              <>
                {confidence != null && (
                  <div className="text-xs text-muted-foreground">
                    AI-konfidens: {Math.round(confidence * 100)}%
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Type</Label>
                    <Select
                      value={draft.entry_type}
                      onValueChange={(v) => setDraft((d) => d && ({ ...d, entry_type: v as EntryType, category: "Annet" }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expense">Utgift</SelectItem>
                        <SelectItem value="income">Inntekt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Dato</Label>
                    <Input
                      type="date"
                      value={draft.entry_date}
                      onChange={(e) => setDraft((d) => d && ({ ...d, entry_date: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label>Motpart</Label>
                  <Input
                    value={draft.counterparty}
                    onChange={(e) => setDraft((d) => d && ({ ...d, counterparty: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Beskrivelse</Label>
                  <Input
                    value={draft.description}
                    onChange={(e) => setDraft((d) => d && ({ ...d, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Kategori</Label>
                    <Select
                      value={draft.category}
                      onValueChange={(v) => setDraft((d) => d && ({ ...d, category: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Beløp (kr)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.amount_gross}
                      onChange={(e) => setDraft((d) => d && ({ ...d, amount_gross: Number(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>MVA (0–1)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="1"
                      value={draft.vat_rate}
                      onChange={(e) => setDraft((d) => d && ({ ...d, vat_rate: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Betaling</Label>
                    <Select
                      value={draft.payment_status}
                      onValueChange={(v) => setDraft((d) => d && ({ ...d, payment_status: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(PAYMENT_STATUS_LABEL).map(([k, l]) => (
                          <SelectItem key={k} value={k}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Faktura</Label>
                    <Select
                      value={draft.invoice_status}
                      onValueChange={(v) => setDraft((d) => d && ({ ...d, invoice_status: v }))}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {Object.entries(INVOICE_STATUS_LABEL).map(([k, l]) => (
                          <SelectItem key={k} value={k}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="before-co"
                    checked={draft.before_company_founded}
                    onCheckedChange={(v) => setDraft((d) => d && ({ ...d, before_company_founded: !!v }))}
                  />
                  <Label htmlFor="before-co" className="text-xs">Før selskapsstiftelse</Label>
                </div>

                <div>
                  <Label>Notater</Label>
                  <Textarea
                    rows={2}
                    value={draft.notes}
                    onChange={(e) => setDraft((d) => d && ({ ...d, notes: e.target.value }))}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={close}>Avbryt</Button>
          <Button onClick={approve} disabled={!draft || create.isPending}>
            <Upload className="h-4 w-4" />
            Godkjenn og opprett post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
