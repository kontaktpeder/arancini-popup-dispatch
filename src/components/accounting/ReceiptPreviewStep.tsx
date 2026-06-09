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
    <div className="flex h-full flex-col gap-3">
      <div className="flex-1 min-h-0 overflow-auto rounded-lg border bg-muted/30">
        {isPdf ? (
          <iframe src={previewUrl} className="h-full min-h-[60vh] w-full" title="PDF" />
        ) : (
          <div className="h-full w-full overflow-auto touch-pinch-zoom">
            {/* touch-pinch-zoom enables native pinch on iOS Safari */}
            <img
              src={previewUrl}
              alt="Kvittering"
              className="mx-auto max-w-none"
              style={{ maxHeight: "none" }}
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
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
