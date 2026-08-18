import { canThaw, fifoBatch, withDerivedLots } from "./calc";
import { PILOT_SETTINGS } from "./catalog";
import { createSeedState } from "./seed";
import { addHoursIso, nowIso, todayOslo, weekStartOslo } from "./time";
import type {
  DayStatusLine,
  Deviation,
  DeviationKind,
  HoldHours,
  PilotState,
  WeeklyObservation,
  WorkflowRating,
} from "./types";
import { PILOT_STATE_VERSION } from "./types";

const STORAGE_KEY = "gos.pilot-core.v1";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone<T>(v: T): T {
  return structuredClone(v);
}

function isState(value: unknown): value is PilotState {
  if (!value || typeof value !== "object") return false;
  const v = value as PilotState;
  return v.version === PILOT_STATE_VERSION && !!v.org && Array.isArray(v.batches);
}

export function loadPilotState(): PilotState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeedState();
    const parsed = JSON.parse(raw) as unknown;
    if (!isState(parsed)) return createSeedState();
    return parsed;
  } catch {
    return createSeedState();
  }
}

export function persistPilotState(state: PilotState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function viewState(state: PilotState): PilotState {
  return withDerivedLots(state);
}

export function resetPilotState(): PilotState {
  const next = createSeedState();
  persistPilotState(next);
  return next;
}

function pushActivity(
  state: PilotState,
  kind: PilotState["activity"][number]["kind"],
  title: string,
  detail: string,
): PilotState {
  return {
    ...state,
    activity: [
      { id: uid(), at: nowIso(), kind, title, detail },
      ...state.activity,
    ].slice(0, 80),
  };
}

export function recordThaw(
  state: PilotState,
  input: { variantId: string; batchId: string; qty: number },
): PilotState {
  const err = canThaw(state, input.variantId, input.batchId, input.qty);
  if (err) throw new Error(err);
  const takenAt = nowIso();
  const variant = state.variants.find((v) => v.id === input.variantId);
  const batch = state.batches.find((b) => b.id === input.batchId)!;
  const next: PilotState = {
    ...state,
    batches: state.batches.map((b) =>
      b.id === input.batchId ? { ...b, freezerRemaining: b.freezerRemaining - input.qty } : b,
    ),
    thawLots: [
      {
        id: uid(),
        variantId: input.variantId,
        batchId: input.batchId,
        qty: input.qty,
        remaining: input.qty,
        takenAt,
        deadlineAt: addHoursIso(takenAt, state.settings.holdHoursAfterThaw),
      },
      ...state.thawLots,
    ],
  };
  return pushActivity(
    next,
    "thaw",
    "Uttak fra fryser",
    `${input.qty} ${variant?.shortName ?? "stk"} · ${batch.lotCode}`,
  );
}

export function recordDayStatus(
  state: PilotState,
  input: {
    date?: string;
    lines: DayStatusLine[];
    workflow: WorkflowRating;
    comment: string;
  },
): PilotState {
  const existing = state.dayStatuses.find((d) => d.date === date);
  const entry = {
    id: existing?.id ?? uid(),
    date,
    recordedAt: nowIso(),
    lines: input.lines,
    workflow: input.workflow,
    comment: input.comment.trim(),
  };
  const next: PilotState = {
    ...state,
    dayStatuses: [entry, ...state.dayStatuses.filter((d) => d.date !== date)],
  };
  const sold = input.lines.reduce((s, l) => s + l.sold, 0);
  const discarded = input.lines.reduce((s, l) => s + l.discarded, 0);
  return pushActivity(
    next,
    "day_status",
    existing ? "Dagens status oppdatert" : "Dagens status",
    `${sold} solgt · ${discarded} kassert`,
  );
}

export function recordWeekly(
  state: PilotState,
  input: Omit<WeeklyObservation, "id" | "recordedAt" | "weekStart"> & { weekStart?: string },
): PilotState {
  const weekStart = input.weekStart ?? weekStartOslo();
  const existing = state.weeklyObservations.find((w) => w.weekStart === weekStart);
  const entry: WeeklyObservation = {
    ...input,
    id: existing?.id ?? uid(),
    weekStart,
    recordedAt: nowIso(),
  };
  const next: PilotState = {
    ...state,
    weeklyObservations: [entry, ...state.weeklyObservations.filter((w) => w.weekStart !== weekStart)],
  };
  return pushActivity(next, "weekly", "Ukentlig oppsummering", "Observasjoner lagret · tallene er allerede med");
}

export function recordDeviation(
  state: PilotState,
  input: {
    kind: DeviationKind;
    batchId: string | null;
    qtyAffected: number;
    remainingOnHand: number;
    description: string;
    photoDataUrl: string | null;
  },
): PilotState {
  const entry: Deviation = {
    id: uid(),
    recordedAt: nowIso(),
    kind: input.kind,
    batchId: input.batchId,
    qtyAffected: input.qtyAffected,
    remainingOnHand: input.remainingOnHand,
    description: input.description.trim(),
    photoDataUrl: input.photoDataUrl,
    notified: true,
  };
  const next: PilotState = {
    ...state,
    deviations: [entry, ...state.deviations],
  };
  return pushActivity(next, "deviation", "Avvik rapportert", input.description.trim().slice(0, 80));
}

export function recordRecommendation(state: PilotState, suggestedWeeklyQty: number, reason: string): PilotState {
  if (state.settings.autoChangeDeliveries) {
    throw new Error("Leveranser kan ikke endres automatisk under piloten");
  }
  const next: PilotState = {
    ...state,
    recommendations: [
      {
        id: uid(),
        recordedAt: nowIso(),
        suggestedWeeklyQty,
        reason,
        applied: false,
      },
      ...state.recommendations,
    ],
  };
  return pushActivity(
    next,
    "recommendation",
    "Anbefaling om leveranse",
    `${suggestedWeeklyQty} stk/uke — ikke iverksatt uten skriftlig avtale`,
  );
}

export function updateHoldHours(state: PilotState, hours: HoldHours): PilotState {
  const source = hours === 48 ? "contract" : "website";
  return {
    ...state,
    settings: {
      ...state.settings,
      holdHoursAfterThaw: hours,
      holdHoursSource: source,
    },
  };
}

export function defaultThawDraft(state: PilotState, variantId: string) {
  const batch = fifoBatch(state.batches, variantId);
  return {
    variantId,
    batchId: batch?.id ?? "",
    qty: Math.min(8, batch?.freezerRemaining ?? 0) || 1,
  };
}

export function emptyDayLines(state: PilotState): DayStatusLine[] {
  return state.variants.map((v) => ({
    variantId: v.id,
    sold: 0,
    discarded: 0,
    thawedUnsold: 0,
    priceOverrideOre: null,
  }));
}

export { PILOT_SETTINGS, uid };
