import { useState } from "react";
import { Paperclip, Upload, ExternalLink, AlertCircle, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useDeleteAttachment, useEntryAttachments, useOpenPopupInvoicePdf, useUploadAttachment,
} from "@/lib/finance-core/hooks";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Props {
  entryId: string;
  sourceType?: string | null;
  sourceRef?: string | null;
  invoiceId?: string | null;
}

export function AttachmentSection({ entryId, sourceType, sourceRef, invoiceId }: Props) {
  const q = useEntryAttachments(entryId);
  const upload = useUploadAttachment();
  const del = useDeleteAttachment();
  const openInvoicePdf = useOpenPopupInvoicePdf();
  const [file, setFile] = useState<File | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const resolvedInvoiceId = invoiceId ?? (sourceRef && UUID_RE.test(sourceRef) ? sourceRef : null);
  const resolvedInvoiceNumber = !resolvedInvoiceId && sourceRef ? sourceRef : null;
  const isInvoiceEntry = sourceType === "invoice" && (resolvedInvoiceId || resolvedInvoiceNumber);

  async function handleOpenInvoicePdf() {
    try {
      await openInvoicePdf.mutateAsync(
        resolvedInvoiceId
          ? { invoiceId: resolvedInvoiceId }
          : { invoiceNumber: resolvedInvoiceNumber! },
      );
    } catch (e: any) {
      toast.error(`Kunne ikke åpne faktura-PDF: ${e?.message ?? e}`);
    }
  }

  async function handleUpload() {
    if (!file) {
      toast.error("Velg en fil først");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    form.append("entry_id", entryId);
    try {
      await upload.mutateAsync(form);
      toast.success("Bilag lastet opp");
      setFile(null);
      q.refetch();
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  const supported = q.data?.supported ?? true;
  const attachments = q.data?.attachments ?? [];

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Bilag</div>

      {!supported && (
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50/40 p-2 text-xs text-amber-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
          Visning av bilagsliste krever Finance Core-oppdatering. Du kan fortsatt laste opp.
        </div>
      )}

      {q.isLoading && supported && (
        <div className="text-xs text-muted-foreground">Laster bilag…</div>
      )}

      {supported && attachments.length === 0 && !q.isLoading && (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground">Ingen bilag på denne posten.</div>
          {isInvoiceEntry && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleOpenInvoicePdf}
              disabled={openInvoicePdf.isPending}
            >
              <FileText className="h-3.5 w-3.5" />
              {openInvoicePdf.isPending ? "Åpner…" : "Åpne faktura-PDF"}
            </Button>
          )}
        </div>
      )}

      {attachments.length > 0 && (
        <ul className="space-y-1">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded border bg-background px-2 py-1 text-xs">
              <span className="inline-flex items-center gap-2 truncate">
                <Paperclip className="h-3 w-3" />
                <span className="truncate">{a.filename ?? a.id}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                {a.url && (
                  <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    Åpne <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setConfirmId(a.id)}
                  className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive"
                  aria-label="Slett bilag"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog open={!!confirmId} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Slette bilag?</AlertDialogTitle>
            <AlertDialogDescription>
              Bilaget fjernes permanent fra Finance Core. Handlingen kan ikke angres.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Avbryt</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (!confirmId) return;
                try {
                  await del.mutateAsync(confirmId);
                  toast.success("Bilag slettet");
                  setConfirmId(null);
                  q.refetch();
                } catch (e: any) {
                  toast.error(`Feil: ${e?.message ?? e}`);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Slett
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <input
          type="file"
          accept="application/pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full max-w-xs text-xs"
        />
        <Button size="sm" variant="outline" onClick={handleUpload} disabled={!file || upload.isPending}>
          <Upload className="h-3.5 w-3.5" /> Last opp
        </Button>
      </div>
    </div>
  );
}
