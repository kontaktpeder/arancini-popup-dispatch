import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FlowDiagram } from "@/components/pilot/flow-diagram";
import { usePilot } from "@/lib/pilot-core/context";
import {
  WEEKLY_QUESTIONS,
  approachingDeadlines,
  endEvaluationStub,
  formatKr,
  formatOsloDate,
  formatOsloDateTime,
  formatPct,
  funnel,
  stockByVariant,
  weekMetrics,
  weekStartOslo,
  weeklyStatusText,
} from "@/lib/pilot-core";
import { cn } from "@/lib/utils";

export function SupplierPane() {
  const { state, recommendDelivery } = usePilot();
  const totals = funnel(state);
  const stock = stockByVariant(state);
  const week = weekMetrics(state);
  const due = approachingDeadlines(state);
  const weekStart = weekStartOslo();
  const report = weeklyStatusText(state, weekStart);
  const evalText = endEvaluationStub(state);
  const [qty, setQty] = useState(state.settings.contractedWeeklyQty);
  const maxFunnel = Math.max(totals.delivered, 1);

  const reactions = useMemo(() => {
    const map = new Map<string, number>();
    for (const w of state.weeklyObservations) {
      const g = WEEKLY_QUESTIONS.find((q) => q.key === "guestFeedback")?.options.find(
        (o) => o.value === w.guestFeedback.choice,
      );
      if (g) map.set(g.label, (map.get(g.label) ?? 0) + 1);
      const o = WEEKLY_QUESTIONS.find((q) => q.key === "objections")?.options.find(
        (o) => o.value === w.objections.choice,
      );
      if (o && o.value !== "none") map.set(`Innvending: ${o.label}`, (map.get(`Innvending: ${o.label}`) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [state.weeklyObservations]);

  const workflowIssues = state.dayStatuses.filter((d) => d.workflow === "hard");
  const deliveryIssues = state.weeklyObservations.filter((w) => w.deliveryExperience.choice === "issues");

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto scroll-touch pb-6">
        <FlowDiagram />

        <div className="grid grid-cols-5 gap-1 text-center">
          <FunnelCell label="Levert" value={totals.delivered} />
          <FunnelCell label="Frys" value={totals.freezer} />
          <FunnelCell label="Tint" value={totals.thawed} />
          <FunnelCell label="Solgt" value={totals.sold} />
          <FunnelCell label="Kassert" value={totals.discarded} accent />
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-olive"
            style={{ width: `${(totals.sold / maxFunnel) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Stat label="Omsetning uke" value={formatKr(week.revenueOre)} />
          <Stat label="Svinn uke" value={formatPct(week.wastePct)} />
        </div>

        <section>
          <h2 className="mb-2 font-display text-xl">Per variant og batch</h2>
          <div className="space-y-2">
            {stock.map((s) => (
              <div key={s.variant.id} className="surface-card !p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-semibold">{s.variant.name}</h3>
                  <span className="text-sm tabular-nums">{formatKr(s.revenueOre)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Levert {s.delivered} · frys {s.freezer} · tint {s.thawed} · solgt {s.sold} ·
                  kassert {s.discarded}
                </p>
                <div className="mt-2 space-y-1">
                  {state.batches
                    .filter((b) => b.variantId === s.variant.id)
                    .map((b) => (
                      <div key={b.id} className="flex justify-between font-mono text-xs">
                        <span>{b.lotCode}</span>
                        <span className="tabular-nums text-muted-foreground">
                          {b.freezerRemaining} på frys / {b.deliveredQty} levert
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl">Må brukes snart</h2>
          {due.filter((d) => d.lot.remaining > 0).length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen åpne tinepartier nær frist.</p>
          ) : (
            due
              .filter((d) => d.lot.remaining > 0)
              .map((item) => (
                <div
                  key={item.lot.id}
                  className={cn(
                    "mb-2 rounded-2xl border px-4 py-3",
                    item.status === "ok" ? "border-border bg-card" : "border-tomato/40 bg-tomato/10",
                  )}
                >
                  <div className="font-semibold">
                    {item.variant.shortName} · {item.lot.remaining} stk
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.batch?.lotCode} · frist {formatOsloDateTime(item.lot.deadlineAt)}
                  </div>
                </div>
              ))
          )}
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl">Dag og uke</h2>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {week.days.map((d) => (
              <div key={d.date} className="min-w-[4.5rem] rounded-2xl border border-border bg-card px-2 py-2 text-center">
                <div className="text-[10px] uppercase text-muted-foreground">
                  {formatOsloDate(d.date).slice(0, 3)}
                </div>
                <div className="text-sm font-semibold tabular-nums">{d.sold}</div>
                <div className="text-[10px] text-muted-foreground">{d.discarded} svinn</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl">Gjestenes reaksjoner</h2>
          {reactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Ingen ukesobservasjoner ennå.</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {reactions.map(([label, n]) => (
                <li key={label} className="flex justify-between rounded-xl bg-card px-3 py-2">
                  <span>{label}</span>
                  <span className="tabular-nums text-muted-foreground">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-2 font-display text-xl">Arbeidsflyt og levering</h2>
          <p className="text-sm text-muted-foreground">
            Vanskelige kvelder: {workflowIssues.length}. Leveringsproblemer i ukesnotat:{" "}
            {deliveryIssues.length}. Avvik sendt: {state.deviations.length}.
          </p>
          {state.deviations.slice(0, 3).map((d) => (
            <div key={d.id} className="mt-2 rounded-2xl border border-tomato/30 bg-card px-4 py-3 text-sm">
              <div className="font-semibold">{d.kind}</div>
              <p className="text-muted-foreground">{d.description}</p>
              <p className="text-xs text-muted-foreground">{formatOsloDateTime(d.recordedAt)}</p>
            </div>
          ))}
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-xl">Automatisk ukesrapport</h2>
          <pre className="whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-xs leading-relaxed">
            {report}
          </pre>
          <h3 className="font-display text-lg">Sluttevaluering</h3>
          <pre className="whitespace-pre-wrap rounded-2xl bg-muted px-4 py-3 text-xs leading-relaxed">
            {evalText}
          </pre>
        </section>

        <section className="surface-card space-y-3">
          <h2 className="font-display text-xl">Anbefal leveranseendring</h2>
          <p className="text-sm text-muted-foreground">
            Avtalt {state.settings.contractedWeeklyQty} stk/uke. Anbefalingen lagres, men iverksettes
            ikke uten skriftlig avtale.
          </p>
          <div className="flex gap-2">
            <input
              inputMode="numeric"
              className="h-12 w-24 rounded-xl border border-border bg-input px-3 text-center text-base tabular-nums"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value.replace(/\D/g, "")) || 0)}
            />
            <button
              type="button"
              className="tap-target h-12 flex-1 bg-espresso text-blush"
              onClick={() => {
                recommendDelivery(qty, "Manuell anbefaling fra leverandørvisning");
                toast.message("Anbefaling lagret", {
                  description: "Leveransen er uendret til avtalen er oppdatert.",
                });
              }}
            >
              Lagre anbefaling
            </button>
          </div>
          {state.recommendations[0] ? (
            <p className="text-xs text-muted-foreground">
              Siste: {state.recommendations[0].suggestedWeeklyQty} stk · ikke iverksatt
            </p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

function FunnelCell({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div>
      <div className={cn("text-lg font-semibold tabular-nums", accent && "text-tomato")}>{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
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
