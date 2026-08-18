import { hoursUntil, todayOslo, weekEndOslo, weekStartOslo } from "./time";
import type {
  Batch,
  DayMetrics,
  DayStatus,
  DeadlineItem,
  FunnelTotals,
  HoldHours,
  PilotState,
  ThawLot,
  Variant,
  VariantStock,
  WeekMetrics,
} from "./types";

export function fifoBatch(batches: Batch[], variantId: string): Batch | undefined {
  return batches
    .filter((b) => b.variantId === variantId && b.freezerRemaining > 0)
    .sort((a, b) => a.deliveredAt.localeCompare(b.deliveredAt))[0];
}

export function remainingThawed(lots: ThawLot[], variantId?: string): number {
  return lots
    .filter((l) => (variantId ? l.variantId === variantId : true))
    .reduce((sum, l) => sum + l.remaining, 0);
}

export function remainingFreezer(batches: Batch[], variantId?: string): number {
  return batches
    .filter((b) => (variantId ? b.variantId === variantId : true))
    .reduce((sum, b) => sum + b.freezerRemaining, 0);
}

export function sumDelivered(batches: Batch[], variantId?: string): number {
  return batches
    .filter((b) => (variantId ? b.variantId === variantId : true))
    .reduce((sum, b) => sum + b.deliveredQty, 0);
}

export function sumSold(statuses: DayStatus[], variantId?: string): number {
  return statuses.reduce((sum, d) => {
    for (const line of d.lines) {
      if (variantId && line.variantId !== variantId) continue;
      sum += line.sold;
    }
    return sum;
  }, 0);
}

export function sumDiscarded(statuses: DayStatus[], variantId?: string): number {
  return statuses.reduce((sum, d) => {
    for (const line of d.lines) {
      if (variantId && line.variantId !== variantId) continue;
      sum += line.discarded;
    }
    return sum;
  }, 0);
}

export function revenueOre(state: PilotState, statuses = state.dayStatuses): number {
  const priceByVariant = Object.fromEntries(state.variants.map((v) => [v.id, v.defaultPriceOre]));
  let ore = 0;
  for (const day of statuses) {
    for (const line of day.lines) {
      const price = line.priceOverrideOre ?? priceByVariant[line.variantId] ?? 0;
      ore += line.sold * price;
    }
  }
  return ore;
}

export function wastePct(sold: number, discarded: number, thawedUnsold = 0): number {
  const den = sold + discarded + thawedUnsold;
  if (den <= 0) return 0;
  return discarded / den;
}

export function sellThroughPct(sold: number, discarded: number, thawedUnsold = 0): number {
  const den = sold + discarded + thawedUnsold;
  if (den <= 0) return 0;
  return sold / den;
}

export function funnel(state: PilotState): FunnelTotals {
  const delivered = sumDelivered(state.batches);
  const freezer = remainingFreezer(state.batches);
  const remainingThawedQty = remainingThawed(state.thawLots);
  const sold = sumSold(state.dayStatuses);
  const discarded = sumDiscarded(state.dayStatuses);
  const thawedOut = state.thawLots.reduce((s, l) => s + l.qty, 0);
  return {
    delivered,
    freezer,
    thawed: thawedOut,
    sold,
    discarded,
    remainingThawed: remainingThawedQty,
  };
}

export function stockByVariant(state: PilotState): VariantStock[] {
  return state.variants.map((variant) => {
    const delivered = sumDelivered(state.batches, variant.id);
    const freezer = remainingFreezer(state.batches, variant.id);
    const thawed = remainingThawed(state.thawLots, variant.id);
    const sold = sumSold(state.dayStatuses, variant.id);
    const discarded = sumDiscarded(state.dayStatuses, variant.id);
    const slice: PilotState = {
      ...state,
      dayStatuses: state.dayStatuses.map((d) => ({
        ...d,
        lines: d.lines.filter((l) => l.variantId === variant.id),
      })),
    };
    return {
      variant,
      delivered,
      freezer,
      thawed,
      sold,
      discarded,
      remaining: freezer + thawed,
      revenueOre: revenueOre(slice),
    };
  });
}

export function deadlineStatus(hoursLeft: number): DeadlineItem["status"] {
  if (hoursLeft < 0) return "overdue";
  if (hoursLeft <= 4) return "due";
  if (hoursLeft <= 12) return "soon";
  return "ok";
}

export function approachingDeadlines(state: PilotState, now = new Date()): DeadlineItem[] {
  const variantById = Object.fromEntries(state.variants.map((v) => [v.id, v]));
  const batchById = Object.fromEntries(state.batches.map((b) => [b.id, b]));
  return state.thawLots
    .filter((l) => l.remaining > 0)
    .map((lot) => {
      const hoursLeft = hoursUntil(lot.deadlineAt, now);
      return {
        lot,
        variant: variantById[lot.variantId] as Variant,
        batch: batchById[lot.batchId],
        hoursLeft,
        status: deadlineStatus(hoursLeft),
      };
    })
    .sort((a, b) => a.hoursLeft - b.hoursLeft);
}

export function dayMetricsFor(state: PilotState, date: string): DayMetrics {
  const day = state.dayStatuses.find((d) => d.date === date);
  if (!day) {
    return {
      date,
      sold: 0,
      discarded: 0,
      thawedUnsold: 0,
      revenueOre: 0,
      wastePct: 0,
      sellThroughPct: 0,
      workflow: null,
    };
  }
  const sold = day.lines.reduce((s, l) => s + l.sold, 0);
  const discarded = day.lines.reduce((s, l) => s + l.discarded, 0);
  const thawedUnsold = day.lines.reduce((s, l) => s + l.thawedUnsold, 0);
  const slice: PilotState = { ...state, dayStatuses: [day] };
  return {
    date,
    sold,
    discarded,
    thawedUnsold,
    revenueOre: revenueOre(slice),
    wastePct: wastePct(sold, discarded, thawedUnsold),
    sellThroughPct: sellThroughPct(sold, discarded, thawedUnsold),
    workflow: day.workflow,
  };
}

export function weekMetrics(state: PilotState, weekStart = weekStartOslo()): WeekMetrics {
  const weekEnd = weekEndOslo(weekStart);
  const days: DayMetrics[] = [];
  const cursor = new Date(`${weekStart}T12:00:00+02:00`);
  const end = new Date(`${weekEnd}T12:00:00+02:00`);
  while (cursor <= end) {
    const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(cursor);
    days.push(dayMetricsFor(state, date));
    cursor.setDate(cursor.getDate() + 1);
  }
  const sold = days.reduce((s, d) => s + d.sold, 0);
  const discarded = days.reduce((s, d) => s + d.discarded, 0);
  const thawedUnsold = days.reduce((s, d) => s + d.thawedUnsold, 0);
  const revenueOreSum = days.reduce((s, d) => s + d.revenueOre, 0);
  const deliveredThisWeek = state.batches
    .filter((b) => b.deliveredAt.slice(0, 10) >= weekStart && b.deliveredAt.slice(0, 10) <= weekEnd)
    .reduce((s, b) => s + b.deliveredQty, 0);

  return {
    weekStart,
    weekEnd,
    days,
    sold,
    discarded,
    revenueOre: revenueOreSum,
    wastePct: wastePct(sold, discarded, thawedUnsold),
    sellThroughPct: sellThroughPct(sold, discarded, thawedUnsold),
    deliveredThisWeek,
    contractedWeeklyQty: state.settings.contractedWeeklyQty,
  };
}

export function deductFifo(
  lots: ThawLot[],
  variantId: string,
  qty: number,
  asOfDate?: string,
): ThawLot[] {
  let left = qty;
  const order = lots
    .map((lot, index) => ({ lot, index }))
    .filter((x) => {
      if (x.lot.variantId !== variantId) return false;
      if (asOfDate && x.lot.takenAt.slice(0, 10) > asOfDate) return false;
      return true;
    })
    .sort((a, b) => a.lot.takenAt.localeCompare(b.lot.takenAt) || a.index - b.index);

  const takeById = new Map<string, number>();
  for (const { lot } of order) {
    if (left <= 0 || lot.remaining <= 0) continue;
    const take = Math.min(lot.remaining, left);
    takeById.set(lot.id, take);
    left -= take;
  }

  return lots.map((lot) => {
    const take = takeById.get(lot.id);
    if (!take) return lot;
    return { ...lot, remaining: lot.remaining - take };
  });
}

export function withDerivedLots(state: PilotState): PilotState {
  let lots = state.thawLots.map((lot) => ({ ...lot, remaining: lot.qty }));
  const days = [...state.dayStatuses].sort((a, b) => a.date.localeCompare(b.date));
  for (const day of days) {
    for (const line of day.lines) {
      lots = deductFifo(lots, line.variantId, line.sold + line.discarded, day.date);
    }
  }
  return { ...state, thawLots: lots };
}

export function canThaw(state: PilotState, variantId: string, batchId: string, qty: number): string | null {
  if (qty < 1) return "Velg minst 1 stk";
  const batch = state.batches.find((b) => b.id === batchId);
  if (!batch) return "Fant ikke batch";
  if (batch.variantId !== variantId) return "Batch matcher ikke variant";
  if (batch.freezerRemaining < qty) return `Kun ${batch.freezerRemaining} igjen på frys`;
  return null;
}

export function applyHoldHours(lot: ThawLot, hours: HoldHours, takenAt = lot.takenAt): ThawLot {
  return {
    ...lot,
    deadlineAt: new Date(new Date(takenAt).getTime() + hours * 60 * 60 * 1000).toISOString(),
  };
}

export function todayStatus(state: PilotState, day = todayOslo()): DayStatus | undefined {
  return state.dayStatuses.find((d) => d.date === day);
}

export function guestReactionCounts(state: PilotState): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const w of state.weeklyObservations) {
    const key = w.guestFeedback.choice || "none";
    counts[key] = (counts[key] ?? 0) + 1;
  }
  for (const w of state.weeklyObservations) {
    const key = w.objections.choice || "none";
    counts[`obj:${key}`] = (counts[`obj:${key}`] ?? 0) + 1;
  }
  return counts;
}
