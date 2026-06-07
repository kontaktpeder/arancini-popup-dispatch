import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Upload, Loader2, Check, X, FileText, Sparkles, AlertTriangle, Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

import { useFinanceAttachmentUpload } from "@/lib/finance/useFinanceAttachmentUpload";
import { formatNok, parseKrToOre } from "@/lib/finance/format";
import {
  useCreateReceiptDraft, useUpdateReceiptDraft, useDeleteReceiptDraft,
  type ReceiptDraft, type AiSuggestion,
} from "@/lib/finance/receipt-drafts.hooks";
import { analyzeReceiptDraft } from "@/lib/finance/receipt-drafts.functions";
import { useUpsertEntry } from "@/lib/finance/hooks";
import { useAccountingT } from "@/lib/finance/i18n";

// ------------------------------ Upload Button ------------------------------

export function ReceiptUploadButton({
  bookId, userId, onUploaded,
}: {
  bookId: string;
  userId: string;
  onUploaded: (draftId: string) => void;
}) {
  const { uploadAttachment, isUploading } = useFinanceAttachmentUpload();
  const createDraft = useCreateReceiptDraft();
  const analyze = useServerFn(analyzeReceiptDraft);
  const qc = useQueryClient();
  const { t } = useAccountingT();
  const [analyzing, setAnalyzing] = useState(false);

  const handleFile = async (file: File) => {
    try {
      const up = await uploadAttachment(file, "org", null, null);
      const draft = await createDraft.mutateAsync({
        book_id: bookId,
        uploaded_by: userId,
        file_url: up.url,
        file_path: up.path,
        file_name: up.name,
        mime_type: file.type || "application/octet-stream",
      });
      onUploaded(draft.id);
      setAnalyzing(true);
      toast.info(t.analyzing);
      try {
        await analyze({ data: { draftId: draft.id } });
        await qc.invalidateQueries({ queryKey: ["receipt-drafts", bookId] });
        toast.success(t.aiReady);
      } catch (e: any) {
        await qc.invalidateQueries({ queryKey: ["receipt-drafts", bookId] });
        toast.error(e?.message || t.aiFailed);
      } finally {
        setAnalyzing(false);
      }
    } catch (e: any) {
      toast.error(e?.message || t.uploadFailed);
    }
  };

  const busy = isUploading || analyzing;
  return (
    <label className="inline-flex">
      <Button size="sm" variant="default" asChild>
        <span className="cursor-pointer">
          {busy ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-1" />
          )}
          {t.uploadReceipt}
        </span>
      </Button>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </label>
  );
}

// ------------------------------ Document Preview ------------------------------

export function ReceiptDocumentPreview({ draft }: { draft: ReceiptDraft }) {
  const { t } = useAccountingT();
  const isPdf = (draft.mime_type || "").includes("pdf");
  const isImage = (draft.mime_type || "").startsWith("image/");
  if (!draft.file_url) {
    return <div className="text-xs text-muted-foreground">{t.review.noPreview}</div>;
  }
  if (isImage) {
    return (
      <img
        src={draft.file_url}
        alt={draft.file_name || "Receipt"}
        className="w-full h-auto rounded-md border border-border/60 bg-muted"
      />
    );
  }
  if (isPdf) {
    return (
      <iframe
        src={draft.file_url}
        title={draft.file_name || "PDF"}
        className="w-full h-[70vh] rounded-md border border-border/60 bg-muted"
      />
    );
  }
  return (
    <a
      href={draft.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
    >
      <FileText className="h-4 w-4" /> {t.review.open} {draft.file_name}
    </a>
  );
}

// ------------------------------ Field approval row ------------------------------

export function ReceiptFieldApproval({
  label, suggested, note, confidence, approved,
  children, onApprove,
}: {
  label: string;
  suggested?: string | number | null;
  note?: string;
  confidence?: number;
  approved: boolean;
  children: React.ReactNode;
  onApprove: () => void;
}) {
  const { t } = useAccountingT();
  const pct = confidence != null ? Math.round(confidence * 100) : null;
  return (
    <div className={`rounded-md border p-3 space-y-1.5 ${approved ? "border-emerald-300/60 bg-emerald-50/40 dark:bg-emerald-950/20" : "border-border/60"}`}>
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs font-medium">{label}</Label>
        <div className="flex items-center gap-2">
          {pct != null && (
            <Badge variant="outline" className="text-[10px] font-normal h-5">
              {pct}%
            </Badge>
          )}
          <Button
            type="button"
            size="sm"
            variant={approved ? "secondary" : "outline"}
            className="h-7 px-2"
            onClick={onApprove}
          >
            {approved ? <Check className="h-3 w-3 mr-1" /> : null}
            {approved ? t.review.approved : t.review.approve}
          </Button>
        </div>
      </div>
      {children}
      {(suggested !== undefined && suggested !== null && suggested !== "") || note ? (
        <p className="text-[11px] text-muted-foreground">
          {suggested !== undefined && suggested !== null && suggested !== "" && (
            <>
              <Sparkles className="inline h-3 w-3 mr-0.5" />
              AI: <span className="font-medium">{String(suggested)}</span>
              {note ? ". " : ""}
            </>
          )}
          {note}
        </p>
      ) : null}
    </div>
  );
}

// ------------------------------ Review Dialog ------------------------------

interface FormState {
  entry_type: "expense" | "income";
  date_incurred: string;
  counterparty: string;
  description: string;
  category: string;
  gross_amount_kr: string;
  vat_rate: string;
  vat_amount_kr: string;
  payment_status: "paid" | "unpaid" | "partial";
  invoice_status: "received" | "pending" | "not_required";
  pre_company_expense: boolean;
}

function suggestionToForm(s: AiSuggestion | null): FormState {
  return {
    entry_type: s?.entry_type === "income" ? "income" : "expense",
    date_incurred: s?.date_incurred || new Date().toISOString().slice(0, 10),
    counterparty: s?.counterparty || "",
    description: s?.description || "",
    category: s?.category || "",
    gross_amount_kr: s?.gross_amount != null ? (s.gross_amount / 100).toFixed(2) : "",
    vat_rate: s?.vat_rate != null ? String(s.vat_rate) : "",
    vat_amount_kr: s?.vat_amount != null ? (s.vat_amount / 100).toFixed(2) : "",
    payment_status: s?.payment_status || "unpaid",
    invoice_status: s?.invoice_status || "received",
    pre_company_expense: !!s?.pre_company_expense,
  };
}

export function ReceiptReviewDialog({
  draft, bookId, userId, open, onOpenChange,
}: {
  draft: ReceiptDraft | null;
  bookId: string;
  userId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useAccountingT();
  const [form, setForm] = useState<FormState>(suggestionToForm(null));
  const [approved, setApproved] = useState<Record<string, boolean>>({});
  const update = useUpdateReceiptDraft(bookId);
  const upsertExpense = useUpsertEntry(bookId, "expense");
  const upsertIncome = useUpsertEntry(bookId, "income");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(suggestionToForm(draft?.ai_suggestion ?? null));
    setApproved({});
  }, [draft?.id, draft?.ai_suggestion]);

  if (!draft) return null;
  const s = draft.ai_suggestion;
  const conf = s?.confidence || {};
  const notes = s?.field_notes || {};

  const setField = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));
  const toggle = (k: string) => setApproved((a) => ({ ...a, [k]: !a[k] }));
  const approveAll = () => {
    const keys = [
      "entry_type","date_incurred","counterparty","description","category",
      "gross_amount","vat_rate","vat_amount","payment_status","invoice_status","pre_company_expense",
    ];
    setApproved(Object.fromEntries(keys.map((k) => [k, true])));
  };

  const handleSave = async () => {
    if (!form.description.trim() && !form.counterparty.trim()) {
      toast.error(t.review.fillRequired);
      return;
    }
    const gross = parseKrToOre(form.gross_amount_kr);
    if (gross <= 0) {
      toast.error(t.review.amountRequired);
      return;
    }
    setSaving(true);
    try {
      const fn = form.entry_type === "expense" ? upsertExpense : upsertIncome;
      const entry: any = await fn.mutateAsync({
        created_by: userId,
        description: form.description || form.counterparty,
        counterparty: form.counterparty || null,
        category: form.category || null,
        gross_amount: gross,
        net_amount: gross,
        vat_rate: form.vat_rate ? Number(form.vat_rate) : null,
        vat_amount: form.vat_amount_kr ? parseKrToOre(form.vat_amount_kr) : null,
        date_incurred: form.date_incurred,
        payment_status: form.payment_status,
        invoice_status: form.invoice_status,
        pre_company_expense: form.pre_company_expense,
        attachment_url: draft.file_url,
        attachment_name: draft.file_name,
      });
      await update.mutateAsync({
        id: draft.id,
        status: "converted",
        converted_entry_id: entry?.id ?? null,
      });
      toast.success(t.review.created);
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.message || t.review.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    await update.mutateAsync({ id: draft.id, status: "rejected" });
    toast.success(t.review.rejected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Kontroller AI-forslag
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-md border border-amber-300/60 bg-amber-50/60 dark:bg-amber-950/20 p-3 flex items-start gap-2 text-xs">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            AI kan tolke feil. Du må kontrollere at beløp, dato, leverandør og MVA stemmer
            før posten lagres.
          </p>
        </div>

        {draft.error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
            AI-feil: {draft.error}
          </div>
        )}
        {!s && !draft.error && (
          <div className="rounded-md border border-border/60 p-3 text-xs text-muted-foreground inline-flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" /> AI analyserer dokumentet…
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <ReceiptDocumentPreview draft={draft} />
            <div className="mt-2 text-[11px] text-muted-foreground truncate">
              {draft.file_name}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={approveAll}>
                Godkjenn alle
              </Button>
            </div>

            <ReceiptFieldApproval
              label="Type"
              suggested={s?.entry_type}
              approved={!!approved.entry_type}
              onApprove={() => toggle("entry_type")}
            >
              <Select value={form.entry_type} onValueChange={(v) => setField("entry_type", v as any)}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Utgift</SelectItem>
                  <SelectItem value="income">Inntekt</SelectItem>
                </SelectContent>
              </Select>
            </ReceiptFieldApproval>

            <ReceiptFieldApproval
              label="Dato"
              suggested={s?.date_incurred}
              note={notes.date_incurred}
              confidence={conf.date_incurred}
              approved={!!approved.date_incurred}
              onApprove={() => toggle("date_incurred")}
            >
              <Input
                type="date"
                className="h-8 text-xs"
                value={form.date_incurred}
                onChange={(e) => setField("date_incurred", e.target.value)}
              />
            </ReceiptFieldApproval>

            <ReceiptFieldApproval
              label="Leverandør / motpart"
              suggested={s?.counterparty}
              note={notes.counterparty}
              confidence={conf.counterparty}
              approved={!!approved.counterparty}
              onApprove={() => toggle("counterparty")}
            >
              <Input
                className="h-8 text-xs"
                value={form.counterparty}
                onChange={(e) => setField("counterparty", e.target.value)}
              />
            </ReceiptFieldApproval>

            <ReceiptFieldApproval
              label="Beskrivelse"
              suggested={s?.description}
              approved={!!approved.description}
              onApprove={() => toggle("description")}
            >
              <Textarea
                className="text-xs min-h-[60px]"
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
              />
            </ReceiptFieldApproval>

            <ReceiptFieldApproval
              label="Kategori"
              suggested={s?.category}
              approved={!!approved.category}
              onApprove={() => toggle("category")}
            >
              <Input
                className="h-8 text-xs"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                list="finance-category-suggestions"
              />
            </ReceiptFieldApproval>

            <ReceiptFieldApproval
              label="Totalbeløp (kr)"
              suggested={s?.gross_amount != null ? formatNok(s.gross_amount) : null}
              note={notes.gross_amount}
              confidence={conf.gross_amount}
              approved={!!approved.gross_amount}
              onApprove={() => toggle("gross_amount")}
            >
              <Input
                inputMode="decimal"
                className="h-8 text-xs tabular-nums"
                value={form.gross_amount_kr}
                onChange={(e) => setField("gross_amount_kr", e.target.value)}
              />
            </ReceiptFieldApproval>

            <div className="grid grid-cols-2 gap-3">
              <ReceiptFieldApproval
                label="MVA-sats"
                suggested={s?.vat_rate}
                approved={!!approved.vat_rate}
                onApprove={() => toggle("vat_rate")}
              >
                <Input
                  inputMode="decimal"
                  className="h-8 text-xs"
                  placeholder="0.25"
                  value={form.vat_rate}
                  onChange={(e) => setField("vat_rate", e.target.value)}
                />
              </ReceiptFieldApproval>
              <ReceiptFieldApproval
                label="MVA-beløp (kr)"
                suggested={s?.vat_amount != null ? formatNok(s.vat_amount) : null}
                note={notes.vat_amount}
                confidence={conf.vat_amount}
                approved={!!approved.vat_amount}
                onApprove={() => toggle("vat_amount")}
              >
                <Input
                  inputMode="decimal"
                  className="h-8 text-xs tabular-nums"
                  value={form.vat_amount_kr}
                  onChange={(e) => setField("vat_amount_kr", e.target.value)}
                />
              </ReceiptFieldApproval>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ReceiptFieldApproval
                label="Betalingsstatus"
                suggested={s?.payment_status}
                approved={!!approved.payment_status}
                onApprove={() => toggle("payment_status")}
              >
                <Select value={form.payment_status} onValueChange={(v) => setField("payment_status", v as any)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">Ubetalt</SelectItem>
                    <SelectItem value="paid">Betalt</SelectItem>
                    <SelectItem value="partial">Delvis</SelectItem>
                  </SelectContent>
                </Select>
              </ReceiptFieldApproval>
              <ReceiptFieldApproval
                label="Fakturastatus"
                suggested={s?.invoice_status}
                approved={!!approved.invoice_status}
                onApprove={() => toggle("invoice_status")}
              >
                <Select value={form.invoice_status} onValueChange={(v) => setField("invoice_status", v as any)}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Mangler</SelectItem>
                    <SelectItem value="received">Mottatt</SelectItem>
                    <SelectItem value="not_required">Ikke nødvendig</SelectItem>
                  </SelectContent>
                </Select>
              </ReceiptFieldApproval>
            </div>

            <ReceiptFieldApproval
              label="Før selskapsstiftelse"
              suggested={s?.pre_company_expense != null ? String(s.pre_company_expense) : null}
              approved={!!approved.pre_company_expense}
              onApprove={() => toggle("pre_company_expense")}
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={form.pre_company_expense}
                  onCheckedChange={(v) => setField("pre_company_expense", v)}
                />
                <span className="text-xs text-muted-foreground">
                  {form.pre_company_expense ? "Ja" : "Nei"}
                </span>
              </div>
            </ReceiptFieldApproval>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleReject}>
            <X className="h-4 w-4 mr-1" /> Avvis forslag
          </Button>
          <Button onClick={handleSave} disabled={saving || !s}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
            Godkjenn og opprett post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ------------------------------ Draft list ------------------------------

export function ReceiptDraftList({
  drafts, onReview, bookId,
}: {
  drafts: ReceiptDraft[];
  onReview: (id: string) => void;
  bookId: string;
}) {
  const del = useDeleteReceiptDraft(bookId);
  if (drafts.length === 0) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card">
      <div className="px-3 py-2 border-b border-border/60 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium">AI-utkast som venter på godkjenning</h3>
        <Badge variant="secondary" className="ml-auto">{drafts.length}</Badge>
      </div>
      <ul className="divide-y divide-border/60">
        {drafts.map((d) => {
          const s = d.ai_suggestion;
          return (
            <li key={d.id} className="px-3 py-2 flex items-center gap-3 text-sm">
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="truncate">
                  {s?.counterparty || d.file_name || "Kvittering"}
                  {s?.gross_amount != null && (
                    <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                      {formatNok(s.gross_amount)}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {d.error ? `Feil: ${d.error}` : s ? s.description || "AI-forslag klart" : "Analyserer…"}
                </div>
              </div>
              {d.status === "rejected" && (
                <Badge variant="outline" className="text-[10px]">Avvist</Badge>
              )}
              <Button size="sm" variant="outline" onClick={() => onReview(d.id)}>
                Kontroller
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => {
                  if (confirm("Slett utkast?")) del.mutate(d.id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
