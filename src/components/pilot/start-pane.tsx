import { AlertTriangle, Snowflake, SunMedium, ClipboardList, CalendarRange } from "lucide-react";
import { FlowDiagram } from "@/components/pilot/flow-diagram";
import { usePilot } from "@/lib/pilot-core/context";
import {
  approachingDeadlines,
  dayMetricsFor,
  formatKr,
  formatOsloDateTime,
  formatPct,
  remainingFreezer,
  remainingThawed,
  todayOslo,
  todayStatus,
} from "@/lib/pilot-core";
import { cn } from "@/lib/utils";

type Props = {
  onThaw: () => void;
  onStatus: () => void;
  onWeekly: () => void;
  onDeviation: () => void;
};

export function StartPane({ onThaw, onStatus, onWeekly, onDeviation }: Props) {
  const { state } = usePilot();
  const today = todayOslo();
  const metrics = dayMetricsFor(state, today);
  const closed = todayStatus(state);
  const due = approachingDeadlines(state);
  const freezer = remainingFreezer(state.batches);
  const thawed = remainingThawed(state.thawLots);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 overflow-hidden">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto scroll-touch pb-2">
        <FlowDiagram />

        <div className="grid grid-cols-3 gap-2">
          <Kpi label="Frys" value={`${freezer}`} />
          <Kpi label="Tint" value={`${thawed}`} />
          <Kpi
            label="Frist"
            value={`${due.filter((d) => d.status !== "ok").length}`}
            warn={due.some((d) => d.status === "due" || d.status === "overdue")}
          />
        </div>

        <button
          type="button"
          onClick={onThaw}
          className="tap-target work-card-soft-land h-16 w-full gap-3 bg-golden text-espresso"
        >
          <Snowflake className="h-5 w-5" />
          Jeg tar ut varer fra fryseren
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onStatus}
            className="min-h-16 rounded-2xl border border-border bg-card px-4 py-3 text-left"
          >
            <ClipboardList className="mb-1 h-4 w-4 text-tomato" />
            <div className="font-semibold">Dagens status</div>
            <div className="text-xs text-muted-foreground">
              {closed ? "Lagret i dag" : "Ved stengetid"}
            </div>
          </button>
          <button
            type="button"
            onClick={onWeekly}
            className="min-h-16 rounded-2xl border border-border bg-card px-4 py-3 text-left"
          >
            <CalendarRange className="mb-1 h-4 w-4 text-olive" />
            <div className="font-semibold">Uken</div>
            <div className="text-xs text-muted-foreground">Fem–seks spørsmål</div>
          </button>
        </div>

        <button
          type="button"
          onClick={onDeviation}
          className="tap-target h-14 w-full gap-2 bg-tomato text-blush"
        >
          <AlertTriangle className="h-5 w-5" />
          Rapporter avvik
        </button>

        <div className="surface-card !py-3">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">I dag</p>
          {closed ? (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <span className="text-muted-foreground">Solgt</span>
              <span className="text-right tabular-nums">{metrics.sold}</span>
              <span className="text-muted-foreground">Kassert</span>
              <span className="text-right tabular-nums">{metrics.discarded}</span>
              <span className="text-muted-foreground">Omsetning</span>
              <span className="text-right tabular-nums">{formatKr(metrics.revenueOre)}</span>
              <span className="text-muted-foreground">Svinn</span>
              <span className="text-right tabular-nums">{formatPct(metrics.wastePct)}</span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              {thawed} tint på kjøl. Status fylles ved stengetid — cirka ett minutt.
            </p>
          )}
        </div>

        {due.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Nærmer seg fristen
            </p>
            {due.slice(0, 4).map((item) => {
              const hours = Math.round(item.hoursLeft);
              return (
                <div
                  key={item.lot.id}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3",
                    item.status === "overdue" || item.status === "due"
                      ? "border-tomato/50 bg-tomato/10"
                      : "border-border bg-card",
                  )}
                >
                  <div>
                    <div className="font-semibold">{item.variant.shortName}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.lot.remaining} stk · {item.batch?.lotCode}
                    </div>
                  </div>
                  <div className="text-right text-sm tabular-nums">
                    {hours < 0 ? "Over frist" : `${hours} t`}
                    <div className="text-[11px] text-muted-foreground">
                      {formatOsloDateTime(item.lot.deadlineAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <SunMedium className="h-4 w-4" />
            Ingen tinte varer nær fristen.
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={cn("rounded-2xl border bg-card px-3 py-2", warn ? "border-tomato" : "border-border")}>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

