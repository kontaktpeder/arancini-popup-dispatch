/** Pilot Core domain types — system of record for frozen arancini ops. */

export const PILOT_STATE_VERSION = 1 as const;

export type HoldHours = 24 | 48;

export type WorkflowRating = "easy" | "ok" | "hard";

export type DeviationKind =
  | "freeze_chain"
  | "packaging"
  | "labeling"
  | "allergen"
  | "product"
  | "airfryer"
  | "other";

export type ChoiceComment = {
  choice: string;
  comment: string;
};

export type Variant = {
  id: string;
  name: string;
  shortName: string;
  sku: string;
  /** Suggested retail price in øre. Staff only override when it differs. */
  defaultPriceOre: number;
  allergenProductId: string;
  accent: string;
};

export type Batch = {
  id: string;
  variantId: string;
  lotCode: string;
  deliveredAt: string;
  deliveredQty: number;
  freezerRemaining: number;
};

export type ThawLot = {
  id: string;
  variantId: string;
  batchId: string;
  qty: number;
  remaining: number;
  takenAt: string;
  deadlineAt: string;
};

export type DayStatusLine = {
  variantId: string;
  sold: number;
  discarded: number;
  thawedUnsold: number;
  /** Override in øre. Null = use catalog price. */
  priceOverrideOre: number | null;
};

export type DayStatus = {
  id: string;
  date: string;
  recordedAt: string;
  lines: DayStatusLine[];
  workflow: WorkflowRating;
  comment: string;
};

export type WeeklyObservation = {
  id: string;
  weekStart: string;
  recordedAt: string;
  drinkImpact: ChoiceComment;
  vsExistingFood: ChoiceComment;
  staffExperience: ChoiceComment;
  guestFeedback: ChoiceComment;
  objections: ChoiceComment;
  deliveryExperience: ChoiceComment;
  ideas: string;
};

export type Deviation = {
  id: string;
  recordedAt: string;
  kind: DeviationKind;
  batchId: string | null;
  qtyAffected: number;
  remainingOnHand: number;
  description: string;
  photoDataUrl: string | null;
  notified: boolean;
};

export type DeliveryRecommendation = {
  id: string;
  recordedAt: string;
  suggestedWeeklyQty: number;
  reason: string;
  /** Contracted qty is never auto-changed during the pilot. */
  applied: false;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  venueName: string;
  createdAt: string;
};

export type PilotSettings = {
  holdHoursAfterThaw: HoldHours;
  /**
   * Website says 24h, contract says 48h.
   * Unresolved until Gold of Sicily confirms in writing.
   */
  holdHoursSource: "contract" | "website" | "unresolved";
  contractedWeeklyQty: number;
  autoChangeDeliveries: false;
  suggestedRetailNote: string;
};

export type ActivityKind =
  | "delivery"
  | "thaw"
  | "day_status"
  | "weekly"
  | "deviation"
  | "recommendation";

export type Activity = {
  id: string;
  at: string;
  kind: ActivityKind;
  title: string;
  detail: string;
};

export type PilotState = {
  version: typeof PILOT_STATE_VERSION;
  org: Organization;
  settings: PilotSettings;
  variants: Variant[];
  batches: Batch[];
  thawLots: ThawLot[];
  dayStatuses: DayStatus[];
  weeklyObservations: WeeklyObservation[];
  deviations: Deviation[];
  recommendations: DeliveryRecommendation[];
  activity: Activity[];
};

export type VariantStock = {
  variant: Variant;
  delivered: number;
  freezer: number;
  thawed: number;
  sold: number;
  discarded: number;
  remaining: number;
  revenueOre: number;
};

export type FunnelTotals = {
  delivered: number;
  freezer: number;
  thawed: number;
  sold: number;
  discarded: number;
  remainingThawed: number;
};

export type DeadlineItem = {
  lot: ThawLot;
  variant: Variant;
  batch: Batch | undefined;
  hoursLeft: number;
  status: "ok" | "soon" | "due" | "overdue";
};

export type DayMetrics = {
  date: string;
  sold: number;
  discarded: number;
  thawedUnsold: number;
  revenueOre: number;
  wastePct: number;
  sellThroughPct: number;
  workflow: WorkflowRating | null;
};

export type WeekMetrics = {
  weekStart: string;
  weekEnd: string;
  days: DayMetrics[];
  sold: number;
  discarded: number;
  revenueOre: number;
  wastePct: number;
  sellThroughPct: number;
  deliveredThisWeek: number;
  contractedWeeklyQty: number;
};
