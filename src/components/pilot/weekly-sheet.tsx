import { useState } from "react";
import { toast } from "sonner";
import { ContentSheet } from "@/components/pilot/content-sheet";
import { SheetStickyFooter } from "@/components/pilot/sheet-sticky-footer";
import { usePilot } from "@/lib/pilot-core/context";
import {
  WEEKLY_QUESTIONS,
  formatKr,
  formatOsloDate,
  formatPct,
  weekEndOslo,
  weekMetrics,
  weekStartOslo,
  weeklyStatusText,
} from "@/lib/pilot-core";
import { sheetTextareaClass } from "@/lib/sheetField";
import { cn } from "@/lib/utils";
import type { ChoiceComment } from "@/lib/pilot-core";

const emptyChoice = (): ChoiceComment => ({ choice: "", comment: "" });

export function WeeklySheet({ onClose }: { onClose: () => void }) {
  const { state, saveWeekly } = usePilot();
  const weekStart = weekStartOslo();
  const week = weekMetrics(state, weekStart);
  const existing = state.weeklyObservations.find((w) => w.weekStart === weekStart);

  const [drinkImpact, setDrinkImpact] = useState(existing?.drinkImpact ?? emptyChoice());
  const [vsExistingFood, setVs] = useState(existing?.vsExistingFood ?? emptyChoice());
  const [staffExperience, setStaff] = useState(existing?.staffExperience ?? emptyChoice());
  const [guestFeedback, setGuest] = useState(existing?.guestFeedback ?? emptyChoice());
  const [objections, setObj] = useState(existing?.objections ?? emptyChoice());
  const [deliveryExperience, setDel] = useState(existing?.deliveryExperience ?? emptyChoice());
  const [ideas, setIdeas] = useState(existing?.ideas ?? "");
  const [showReport, setShowReport] = useState(false);

  const fields = {
    drinkImpact,
    vsExistingFood,
    staffExperience,
    guestFeedback,
    objections,
    deliveryExperience,
  };
  const setters = {
    drinkImpact: setDrinkImpact,
    vsExistingFood: setVs,
    staffExperience: setStaff,
    guestFeedback: setGuest,
    objections: setObj,
    deliveryExperience: setDel,
  };

  const ready = WEEKLY_QUESTIONS.every((q) => fields[q.key].choice);

  const report = weeklyStatusText(state, weekStart, {
    id: "preview",
    weekStart,
    recordedAt: new Date().toISOString(),
    drinkImpact,
    vsExistingFood,
    staffExperience,
    guestFeedback,
    objections,
    deliveryExperience,
    ideas,
  });

  return (
    <ContentSheet onClose={onClose} title="Ukentlig oppsummering" zClassName="z-[70]">
      <form
        className="flex min-h-0 flex-1 flex-col"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ready) {
            toast.error("Velg et svar på hvert spørsmål");
            return;
          }
          saveWeekly({
            drinkImpact,
            vsExistingFood,
            staffExperience,
            guestFeedback,
            objections,
            deliveryExperience,
            ideas,
            weekStart,
          });
          toast.success("Ukesstatus lagret — erstatter separat rapport");
          onClose();
        }}
      >
        <div data-sheet-scroll className="scroll-touch min-h-0 flex-1 space-y-4 overflow-y-auto px-5">
          <p className="text-sm text-muted-foreground">
            Avtalen ber om kort ukentlig status, ikke daglig rapportering. Tallene under bygges
            automatisk fra uttak og dagsstatus. Fem–seks spørsmål, cirka to minutter.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="Solgt" value={`${week.sold}`} />
            <Stat label="Kassert" value={`${week.discarded}`} />
            <Stat label="Omsetning" value={formatKr(week.revenueOre)} />
            <Stat label="Svinn" value={formatPct(week.wastePct)} />
            <Stat label="Salgsgrad" value={formatPct(week.sellThroughPct)} />
            <Stat
              label="Levert / avtalt"
              value={`${week.deliveredThisWeek}/${week.contractedWeeklyQty}`}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatOsloDate(week.weekStart)} – {formatOsloDate(weekEndOslo(week.weekStart))}
          </p>

          {WEEKLY_QUESTIONS.map((q) => {
            const value = fields[q.key];
            const set = setters[q.key];
            return (
              <div key={q.key} className="space-y-2">
                <div>
                  <p className="font-semibold">{q.title}</p>
                  <p className="text-xs text-muted-foreground">{q.hint}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.options.map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => set({ ...value, choice: o.value })}
                      className={cn(
                        "rounded-full border px-3 py-2 text-sm font-medium",
                        value.choice === o.value
                          ? "border-espresso bg-espresso text-blush"
                          : "border-border bg-card",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
                <input
                  className="w-full rounded-xl border border-border bg-input px-4 py-2.5 text-base"
                  placeholder="Kort kommentar (valgfritt)"
                  value={value.comment}
                  onChange={(e) => set({ ...value, comment: e.target.value })}
                />
              </div>
            );
          })}

          <textarea
            className={sheetTextareaClass}
            placeholder="Forbedrings- og markedsføringsideer (valgfritt)"
            value={ideas}
            onChange={(e) => setIdeas(e.target.value)}
          />

          <button
            type="button"
            className="text-sm font-medium text-tomato"
            onClick={() => setShowReport((v) => !v)}
          >
            {showReport ? "Skjul automatisk rapport" : "Forhåndsvis automatisk ukesrapport"}
          </button>
          {showReport ? (
            <pre className="whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-xs leading-relaxed">
              {report}
            </pre>
          ) : null}
        </div>
        <SheetStickyFooter>
          <button type="submit" className="tap-target h-14 w-full bg-olive text-blush">
            Lagre ukesstatus
          </button>
        </SheetStickyFooter>
      </form>
    </ContentSheet>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
