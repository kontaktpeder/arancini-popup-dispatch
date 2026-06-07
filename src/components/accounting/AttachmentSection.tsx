import { useState } from "react";
import { Paperclip, Upload, ExternalLink, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useEntryAttachments, useUploadAttachment } from "@/lib/finance-core/hooks";

interface Props {
  entryId: string;
}

export function AttachmentSection({ entryId }: Props) {
  const q = useEntryAttachments(entryId);
  const upload = useUploadAttachment();
  const [file, setFile] = useState<File | null>(null);

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
        <div className="text-xs text-muted-foreground">Ingen bilag på denne posten.</div>
      )}

      {attachments.length > 0 && (
        <ul className="space-y-1">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between rounded border bg-background px-2 py-1 text-xs">
              <span className="inline-flex items-center gap-2 truncate">
                <Paperclip className="h-3 w-3" />
                <span className="truncate">{a.filename ?? a.id}</span>
              </span>
              {a.url && (
                <a href={a.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  Åpne <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

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
