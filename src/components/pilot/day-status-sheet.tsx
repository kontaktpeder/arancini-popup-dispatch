import { useState } from "react";
import { toast } from "sonner";
import { ContentSheet } from "@/components/pilot/content-sheet";
import { SheetStickyFooter } from "@/components/pilot/sheet-sticky-footer";
import { NumberStepper } from "@/components/pilot/number-stepper";
import { usePilot } from "@/lib/pilot-core/context";
import {
  WORKFLOW_OPTIONS,
  emptyDayLines,
  formatKr,
  remainingThawed,
  todayOslo,
  todayStatus,
} from "@/lib/pilot-core";
import { sheetTextareaClass } from "@/lib/sheetField";
import { cn } from "@/lib/utils";
import type { DayStatusLine, WorkflowRating } from "@/lib/pilot-core";

export function DayStatusSheet({ onClose }: { onClose: () => void }) {
  const { state, saveDay } = usePilot();
  const existing = todayStatus(state);
  const [lines, setLines] = useState<DayStatusLine[]>(
    existing?.lines ?? emptyDayLines(state),
  );
  const [workflow, setWorkflow] = useState<WorkflowRating>(existing?.workflow ?? "ok");
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [priceEdits, setPriceEdits] = useState<Record<string, boolean>>(
    Object.fromEntries(
      (existing?.lines ?? []).map((l) => [l.variantId, l.priceOverrideOre != null]),
    ),
  );

  const patch = (variantId: string, partial: Partial<DayStatusLine>) => {
    setLines((prev) => prev.map((l) => (l.variantId === variantId ? { ...l, ...partial } : l)));
  };

  const sold = lines.reduce((s, l) => s + l.sold, 0);
  const discarded = lines.reduce((s, l) => s + l.discarded, 0);
  const unsold = lines.reduce((s, l) => s + l.thawedUnsold, 0);
  const den = sold + discarded + unsold;
  const revenue = lines.reduce((s, l) => {
    const v = state.variants.find((x) => x.id === l.variantId);
    return s + l.sold * (l.priceOverrideOre ?? v?.defaultPriceOre ?? 0);
  }, 0);

  return (
    <ContentSheet onClose={onClose} title="Dagens status" zClassName="z-[70]">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          saveDay({ lines, workflow, comment });
          toast.success("Dagens status lagret");
          onClose();
        }}
      >
        <div data-sheet-scroll className="scroll-touch min-h-0 flex-1 space-y-4 overflow-y-auto px-5">
          <p className="text-sm text-muted-foreground">
            Ved stengetid. Prisen ligger ferdig — registrer kun avvik. Appen regner omsetning,
            lager og svinn.
          </p>

          {state.variants.map((v) => {
            const line = lines.find((l) => l.variantId === v.id)!;
            const thawed = remainingThawed(state.thawLots, v.id);
            const editingPrice = priceEdits[v.id];
            const priceOre = line.priceOverrideOre ?? v.defaultPriceOre;
            return (
              <div key={v.id} className="surface-card space-y-3">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-xl">{v.name}</h3>
                  <span className="text-xs text-muted-foreground">{thawed} tint nå</span>
                </div>
                <NumberStepper
                  label="Solgt"
                  value={line.sold}
                  onChange={(n) => patch(v.id, { sold: n })}
                />
                <NumberStepper
                  label="Kassert"
                  value={line.discarded}
                  onChange={(n) => patch(v.id, { discarded: n })}
                />
                <NumberStepper
                  label="Tint, ikke solgt"
                  value={line.thawedUnsold}
                  onChange={(n) => patch(v.id, { thawedUnsold: n })}
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">Utsalgspris</span>
                  {editingPrice ? (
                    <div className="flex items-center gap-2">
                      <input
                        inputMode="numeric"
                        className="h-11 w-20 rounded-xl border border-border bg-input px-3 text-right text-base tabular-nums"
                        value={Math.round(priceOre / 100)}
                        onChange={(e) => {
                          const kr = Number(e.target.value.replace(/\D/g, ""));
                          patch(v.id, {
                            priceOverrideOre: Number.isNaN(kr) ? v.defaultPriceOre : kr * 100,
                          });
                        }}
                      />
                      <span className="text-sm">kr</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="text-sm font-medium text-tomato"
                      onClick={() => setPriceEdits((p) => ({ ...p, [v.id]: true }))}
                    >
                      {formatKr(v.defaultPriceOre)} · avvik?
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              Hvordan fungerte arbeidsflyten?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {WORKFLOW_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setWorkflow(o.value)}
                  className={cn(
                    "rounded-2xl border py-3 text-sm font-semibold",
                    workflow === o.value ? "border-espresso bg-espresso/8" : "border-border bg-card",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className={sheetTextareaClass}
            placeholder="Kort kommentar (valgfritt)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <div className="surface-card !py-3 text-sm">
            <Row label="Omsetning" value={formatKr(revenue)} />
            <Row
              label="Svinn"
              value={den ? `${Math.round((discarded / den) * 100)} %` : "—"}
            />
            <Row
              label="Salgsgrad"
              value={den ? `${Math.round((sold / den) * 100)} %` : "—"}
            />
            <Row label="Dato" value={todayOslo()} />
          </div>
        </div>
        <SheetStickyFooter>
          <button type="submit" className="tap-target h-14 w-full bg-espresso text-blush">
            Lagre dagens status
          </button>
        </SheetStickyFooter>
      </form>
    </ContentSheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums font-medium">{value}</span>
    </div>
  );
}
