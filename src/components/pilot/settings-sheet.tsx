import { toast } from "sonner";
import { ContentSheet } from "@/components/pilot/content-sheet";
import { SheetStickyFooter } from "@/components/pilot/sheet-sticky-footer";
import { usePilot } from "@/lib/pilot-core/context";
import { ANNEX_4_WORDING, HOLD_HOURS_NOTE } from "@/lib/pilot-core";
import { cn } from "@/lib/utils";

export function SettingsSheet({ onClose }: { onClose: () => void }) {
  const { state, setHoldHours, reset } = usePilot();

  return (
    <ContentSheet onClose={onClose} title="Innstillinger" zClassName="z-[60]">
      <div className="flex min-h-0 flex-1 flex-col">
        <div data-sheet-scroll className="scroll-touch min-h-0 flex-1 space-y-4 overflow-y-auto px-5">
          <section className="space-y-2">
            <h3 className="font-display text-lg">Holdbarhet etter uttak</h3>
            <p className="text-sm text-muted-foreground">{HOLD_HOURS_NOTE}</p>
            <div className="grid grid-cols-2 gap-2">
              {([24, 48] as const).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHoldHours(h)}
                  className={cn(
                    "rounded-2xl border py-3 font-semibold",
                    state.settings.holdHoursAfterThaw === h
                      ? "border-espresso bg-espresso/8"
                      : "border-border bg-card",
                  )}
                >
                  {h} timer
                  <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                    {h === 24 ? "Nettside" : "Kontrakt"}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="surface-card space-y-1 text-sm">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Leveranse under piloten
            </p>
            <p className="text-lg font-semibold tabular-nums">
              {state.settings.contractedWeeklyQty} stk / uke
            </p>
            <p className="text-muted-foreground">
              Kontraktsfestet. Appen kan anbefale endring, men endrer aldri leveransen uten
              skriftlig avtale.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-display text-lg">Vedlegg 4 — forslag til formulering</h3>
            <p className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">{ANNEX_4_WORDING}</p>
          </section>

          <section className="text-sm text-muted-foreground">
            Pilot Core er første versjon: loggføring, automatiske beregninger og enkle varsler. Fire
            uker og 400 produkter er for lite til avansert AI.
          </section>
        </div>
        <SheetStickyFooter>
          <button
            type="button"
            className="tap-target h-12 w-full border border-border bg-card"
            onClick={() => {
              reset();
              toast.success("Demodata tilbakestilt");
              onClose();
            }}
          >
            Tilbakestill demodata
          </button>
        </SheetStickyFooter>
      </div>
    </ContentSheet>
  );
}
