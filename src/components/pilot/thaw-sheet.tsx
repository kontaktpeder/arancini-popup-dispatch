import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ContentSheet } from "@/components/pilot/content-sheet";
import { SheetStickyFooter } from "@/components/pilot/sheet-sticky-footer";
import { NumberStepper } from "@/components/pilot/number-stepper";
import { usePilot } from "@/lib/pilot-core/context";
import { addHoursIso, formatOsloDateTime } from "@/lib/pilot-core";
import { fifoBatch } from "@/lib/pilot-core/calc";
import { cn } from "@/lib/utils";

export function ThawSheet({ onClose }: { onClose: () => void }) {
  const { state, thaw } = usePilot();
  const firstWithStock = state.variants.find((v) =>
    state.batches.some((b) => b.variantId === v.id && b.freezerRemaining > 0),
  );
  const [variantId, setVariantId] = useState(firstWithStock?.id ?? state.variants[0]?.id ?? "");
  const suggested = fifoBatch(state.batches, variantId);
  const [batchId, setBatchId] = useState(suggested?.id ?? "");
  const [qty, setQty] = useState(Math.min(8, suggested?.freezerRemaining ?? 1) || 1);

  const batches = state.batches.filter((b) => b.variantId === variantId && b.freezerRemaining > 0);
  const batch = batches.find((b) => b.id === batchId) ?? suggested;
  const deadline = addHoursIso(new Date().toISOString(), state.settings.holdHoursAfterThaw);

  const selectVariant = (id: string) => {
    setVariantId(id);
    const next = fifoBatch(state.batches, id);
    setBatchId(next?.id ?? "");
    setQty(Math.min(8, next?.freezerRemaining ?? 1) || 1);
  };

  const max = batch?.freezerRemaining ?? 0;
  const variant = state.variants.find((v) => v.id === variantId);

  const canSave = useMemo(() => !!batch && qty >= 1 && qty <= max, [batch, qty, max]);

  return (
    <ContentSheet onClose={onClose} title="Uttak fra fryser" zClassName="z-[70]">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (!batch) return;
          try {
            thaw({ variantId, batchId: batch.id, qty });
            toast.success(`${qty} ${variant?.shortName} tatt ut`);
            onClose();
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Kunne ikke lagre");
          }
        }}
      >
        <div data-sheet-scroll className="scroll-touch min-h-0 flex-1 space-y-4 overflow-y-auto px-5">
          <p className="text-sm text-muted-foreground">
            Registrer når varene tas ut — ikke ved stengetid. Dato, klokkeslett og frist fylles inn
            automatisk.
          </p>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">Variant</p>
            <div className="grid grid-cols-2 gap-2">
              {state.variants.map((v) => {
                const left = state.batches
                  .filter((b) => b.variantId === v.id)
                  .reduce((s, b) => s + b.freezerRemaining, 0);
                const active = v.id === variantId;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => selectVariant(v.id)}
                    className={cn(
                      "rounded-2xl border px-4 py-3 text-left",
                      active ? "border-espresso bg-espresso/8" : "border-border bg-card",
                    )}
                  >
                    <div className="font-semibold">{v.name}</div>
                    <div className="text-xs text-muted-foreground">{left} på frys</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              Batch · FIFO forhåndsvalgt
            </p>
            <div className="space-y-2">
              {batches.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  Ingen på fryselager for denne varianten.
                </p>
              ) : (
                batches.map((b) => {
                  const active = b.id === (batch?.id ?? "");
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBatchId(b.id);
                        setQty(Math.min(qty, b.freezerRemaining));
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left",
                        active ? "border-espresso bg-espresso/8" : "border-border bg-card",
                      )}
                    >
                      <span className="font-mono text-sm">{b.lotCode}</span>
                      <span className="text-sm tabular-nums text-muted-foreground">
                        {b.freezerRemaining} stk
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <NumberStepper value={qty} onChange={setQty} min={1} max={Math.max(1, max)} label="Antall" />

          <div className="surface-card !py-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tidspunkt</span>
              <span className="tabular-nums">{formatOsloDateTime(new Date().toISOString())}</span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-muted-foreground">
                Frist tilberedning / kassering ({state.settings.holdHoursAfterThaw} t)
              </span>
              <span className="tabular-nums">{formatOsloDateTime(deadline)}</span>
            </div>
          </div>
        </div>
        <SheetStickyFooter>
          <button
            type="submit"
            disabled={!canSave}
            className="tap-target h-14 w-full bg-golden text-espresso disabled:opacity-40"
          >
            Bekreft uttak
          </button>
        </SheetStickyFooter>
      </form>
    </ContentSheet>
  );
}
