import { useState } from "react";
import { toast } from "sonner";
import { ContentSheet } from "@/components/pilot/content-sheet";
import { SheetStickyFooter } from "@/components/pilot/sheet-sticky-footer";
import { NumberStepper } from "@/components/pilot/number-stepper";
import { usePilot } from "@/lib/pilot-core/context";
import { DEVIATION_KINDS, remainingFreezer, remainingThawed } from "@/lib/pilot-core";
import { sheetTextareaClass } from "@/lib/sheetField";
import { cn } from "@/lib/utils";
import type { DeviationKind } from "@/lib/pilot-core";

export function DeviationSheet({ onClose }: { onClose: () => void }) {
  const { state, saveDeviation } = usePilot();
  const [kind, setKind] = useState<DeviationKind>("freeze_chain");
  const [batchId, setBatchId] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const remaining = remainingFreezer(state.batches) + remainingThawed(state.thawLots);

  return (
    <ContentSheet onClose={onClose} title="Rapporter avvik" zClassName="z-[80]">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (!description.trim()) {
            toast.error("Skriv en kort beskrivelse");
            return;
          }
          saveDeviation({
            kind,
            batchId: batchId || null,
            qtyAffected: qty,
            remainingOnHand: remaining,
            description,
            photoDataUrl: photo,
          });
          toast.success("Gold of Sicily varslet");
          onClose();
        }}
      >
        <div data-sheet-scroll className="scroll-touch min-h-0 flex-1 space-y-4 overflow-y-auto px-5">
          <p className="rounded-2xl bg-tomato/15 px-4 py-3 text-sm">
            Avvik venter ikke på dagens status. Leverandøren varsles med en gang.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {DEVIATION_KINDS.map((k) => (
              <button
                key={k.value}
                type="button"
                onClick={() => setKind(k.value)}
                className={cn(
                  "rounded-2xl border px-3 py-3 text-left",
                  kind === k.value ? "border-tomato bg-tomato/10" : "border-border bg-card",
                )}
              >
                <div className="text-sm font-semibold">{k.label}</div>
                <div className="text-[11px] text-muted-foreground">{k.hint}</div>
              </button>
            ))}
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Batch</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setBatchId("")}
                className={cn(
                  "w-full rounded-2xl border px-4 py-3 text-left text-sm",
                  !batchId ? "border-tomato bg-tomato/10" : "border-border bg-card",
                )}
              >
                Ukjent / flere batcher
              </button>
              {state.batches.map((b) => {
                const v = state.variants.find((x) => x.id === b.variantId);
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBatchId(b.id)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
                      batchId === b.id ? "border-tomato bg-tomato/10" : "border-border bg-card",
                    )}
                  >
                    <span className="font-mono text-sm">{b.lotCode}</span>
                    <span className="text-xs text-muted-foreground">{v?.shortName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <NumberStepper label="Berørt antall" value={qty} onChange={setQty} min={0} />

          <div className="text-sm text-muted-foreground">
            Gjenværende beholdning nå: <span className="font-semibold text-foreground">{remaining} stk</span>
          </div>

          <textarea
            className={sheetTextareaClass}
            placeholder="Hva skjedde?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-wider text-muted-foreground">
              Bilde (valgfritt)
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="block w-full text-sm"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) {
                  setPhoto(null);
                  return;
                }
                if (file.size > 1_200_000) {
                  toast.error("Velg et mindre bilde (under 1 MB)");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => setPhoto(typeof reader.result === "string" ? reader.result : null);
                reader.readAsDataURL(file);
              }}
            />
            {photo ? (
              <img src={photo} alt="Vedlegg" className="mt-3 max-h-40 rounded-2xl object-cover" />
            ) : null}
          </label>
        </div>
        <SheetStickyFooter>
          <button type="submit" className="tap-target h-14 w-full bg-tomato text-blush">
            Send avvik nå
          </button>
        </SheetStickyFooter>
      </form>
    </ContentSheet>
  );
}
