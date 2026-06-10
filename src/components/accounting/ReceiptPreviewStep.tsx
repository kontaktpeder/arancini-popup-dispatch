import { RefreshCcw, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  file: File;
  previewUrl: string;
  scanning: boolean;
  onRetake: () => void;
  onUse: () => void;
}

export function ReceiptPreviewStep({ file, previewUrl, scanning, onRetake, onUse }: Props) {
  const isPdf = file.type === "application/pdf";
  return (
    <div className="flex flex-col gap-3">
      <div className="min-h-[60vh] overflow-auto rounded-lg border bg-muted/30">
        {isPdf ? (
          <iframe src={previewUrl} className="min-h-[60vh] w-full" title="PDF" />
        ) : (
          <img
            src={previewUrl}
            alt="Kvittering"
            className="mx-auto w-full max-h-[70vh] object-contain"
          />
        )}
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          className="h-12"
          onClick={onRetake}
          disabled={scanning}
        >
          <RefreshCcw className="h-4 w-4" /> Ta på nytt
        </Button>
        <Button size="lg" className="h-12" onClick={onUse} disabled={scanning}>
          {scanning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {scanning ? "Skanner…" : "Bruk bilde"}
        </Button>
      </div>
    </div>
  );
}
