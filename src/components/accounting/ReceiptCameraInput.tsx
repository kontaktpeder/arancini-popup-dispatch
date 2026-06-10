import { useRef } from "react";
import { Camera, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onFile: (file: File) => void;
}

/**
 * Two big touch-friendly buttons:
 *  - "Ta bilde" → opens iPhone camera (capture="environment")
 *  - "Velg fil" → opens gallery / PDF picker
 */
export function ReceiptCameraInput({ onFile }: Props) {
  const cameraRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="grid gap-3">
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
      <Button
        size="lg"
        className="h-14 text-base"
        onClick={() => cameraRef.current?.click()}
      >
        <Camera className="h-5 w-5" /> Ta bilde av kvittering
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="h-14 text-base"
        onClick={() => fileRef.current?.click()}
      >
        <ImageIcon className="h-5 w-5" /> Velg fra galleri / PDF
      </Button>
    </div>
  );
}
