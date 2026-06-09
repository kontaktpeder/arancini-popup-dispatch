import { AlertTriangle } from "lucide-react";
import { ReceiptFieldEditor, type ReceiptDraft } from "./ReceiptFieldEditor";

interface Props {
  file: File;
  previewUrl: string;
  draft: ReceiptDraft;
  confidence: number | null;
  onChange: (patch: Partial<ReceiptDraft>) => void;
}

export function ReceiptReviewStep({ file, previewUrl, draft, confidence, onChange }: Props) {
  const isPdf = file.type === "application/pdf";
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Image first on mobile, side-by-side on md+ */}
      <div className="md:order-2">
        <div className="overflow-hidden rounded-lg border bg-muted/30">
          {isPdf ? (
            <iframe src={previewUrl} className="h-[40vh] w-full md:h-[60vh]" title="PDF" />
          ) : (
            <img src={previewUrl} alt="Kvittering" className="max-h-[40vh] w-full object-contain md:max-h-[60vh]" />
          )}
        </div>
        {confidence != null && (
          <div className="mt-2 text-xs text-muted-foreground">
            AI-konfidens: {Math.round(confidence * 100)}%
          </div>
        )}
      </div>

      <div className="md:order-1 space-y-3">
        <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50/40 p-2 text-xs text-amber-700">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          AI kan tolke feil. Kontroller beløp, dato og leverandør før du oppretter posten.
        </div>
        <ReceiptFieldEditor draft={draft} onChange={onChange} />
      </div>
    </div>
  );
}
