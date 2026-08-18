import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loadPilotState,
  persistPilotState,
  recordDayStatus,
  recordDeviation,
  recordRecommendation,
  recordThaw,
  recordWeekly,
  resetPilotState,
  updateHoldHours,
  viewState,
  type DayStatusLine,
  type DeviationKind,
  type HoldHours,
  type PilotState,
  type WeeklyObservation,
  type WorkflowRating,
} from "@/lib/pilot-core";

type PilotStore = {
  state: PilotState;
  thaw: (input: { variantId: string; batchId: string; qty: number }) => void;
  saveDay: (input: {
    date?: string;
    lines: DayStatusLine[];
    workflow: WorkflowRating;
    comment: string;
  }) => void;
  saveWeekly: (input: Omit<WeeklyObservation, "id" | "recordedAt" | "weekStart"> & { weekStart?: string }) => void;
  saveDeviation: (input: {
    kind: DeviationKind;
    batchId: string | null;
    qtyAffected: number;
    remainingOnHand: number;
    description: string;
    photoDataUrl: string | null;
  }) => void;
  recommendDelivery: (qty: number, reason: string) => void;
  setHoldHours: (hours: HoldHours) => void;
  reset: () => void;
};

const PilotContext = createContext<PilotStore | null>(null);

function commit(next: PilotState): PilotState {
  persistPilotState(next);
  return next;
}

export function PilotProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PilotState>(() => loadPilotState());

  const thaw = useCallback((input: { variantId: string; batchId: string; qty: number }) => {
    setState((s) => commit(recordThaw(s, input)));
  }, []);

  const saveDay = useCallback(
    (input: {
      date?: string;
      lines: DayStatusLine[];
      workflow: WorkflowRating;
      comment: string;
    }) => {
      setState((s) => commit(recordDayStatus(s, input)));
    },
    [],
  );

  const saveWeekly = useCallback(
    (input: Omit<WeeklyObservation, "id" | "recordedAt" | "weekStart"> & { weekStart?: string }) => {
      setState((s) => commit(recordWeekly(s, input)));
    },
    [],
  );

  const saveDeviation = useCallback(
    (input: {
      kind: DeviationKind;
      batchId: string | null;
      qtyAffected: number;
      remainingOnHand: number;
      description: string;
      photoDataUrl: string | null;
    }) => {
      setState((s) => commit(recordDeviation(s, input)));
    },
    [],
  );

  const recommendDelivery = useCallback((qty: number, reason: string) => {
    setState((s) => commit(recordRecommendation(s, qty, reason)));
  }, []);

  const setHoldHours = useCallback((hours: HoldHours) => {
    setState((s) => commit(updateHoldHours(s, hours)));
  }, []);

  const reset = useCallback(() => {
    setState(resetPilotState());
  }, []);

  const value = useMemo(
    () => ({
      state: viewState(state),
      thaw,
      saveDay,
      saveWeekly,
      saveDeviation,
      recommendDelivery,
      setHoldHours,
      reset,
    }),
    [state, thaw, saveDay, saveWeekly, saveDeviation, recommendDelivery, setHoldHours, reset],
  );

  return <PilotContext.Provider value={value}>{children}</PilotContext.Provider>;
}

export function usePilot(): PilotStore {
  const ctx = useContext(PilotContext);
  if (!ctx) throw new Error("usePilot must be used inside PilotProvider");
  return ctx;
}
