import { PILOT_ORG, PILOT_SETTINGS, PILOT_VARIANTS } from "./catalog";
import { addHoursIso } from "./time";
import type { PilotState } from "./types";
import { PILOT_STATE_VERSION } from "./types";

function isoDaysAgo(days: number, hour = 10): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function dayStamp(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Oslo" }).format(d);
}

/**
 * Oslo Bar og Bowling — 100/week contracted, two variants.
 * Seed is a live week-in-progress so staff and supplier views have numbers.
 */
export function createSeedState(): PilotState {
  const hold = PILOT_SETTINGS.holdHoursAfterThaw;
  const week1At = isoDaysAgo(10, 9);
  const week2At = isoDaysAgo(3, 9);
  const thawYesterday = isoDaysAgo(1, 16);
  const thawToday = isoDaysAgo(0, 15);

  const batchW1N = "b-w1-nduja";
  const batchW1T = "b-w1-truffle";
  const batchW2N = "b-w2-nduja";
  const batchW2T = "b-w2-truffle";

  return {
    version: PILOT_STATE_VERSION,
    org: PILOT_ORG,
    settings: { ...PILOT_SETTINGS },
    variants: PILOT_VARIANTS.map((v) => ({ ...v })),
    batches: [
      {
        id: batchW1N,
        variantId: "nduja",
        lotCode: "GOS-2608-W1-N",
        deliveredAt: week1At,
        deliveredQty: 50,
        freezerRemaining: 12,
      },
      {
        id: batchW1T,
        variantId: "truffle-mushroom",
        lotCode: "GOS-2608-W1-T",
        deliveredAt: week1At,
        deliveredQty: 50,
        freezerRemaining: 18,
      },
      {
        id: batchW2N,
        variantId: "nduja",
        lotCode: "GOS-2608-W2-N",
        deliveredAt: week2At,
        deliveredQty: 50,
        freezerRemaining: 50,
      },
      {
        id: batchW2T,
        variantId: "truffle-mushroom",
        lotCode: "GOS-2608-W2-T",
        deliveredAt: week2At,
        deliveredQty: 50,
        freezerRemaining: 50,
      },
    ],
    thawLots: [
      {
        id: "t-yday-n",
        variantId: "nduja",
        batchId: batchW1N,
        qty: 20,
        remaining: 0,
        takenAt: thawYesterday,
        deadlineAt: addHoursIso(thawYesterday, hold),
      },
      {
        id: "t-yday-t",
        variantId: "truffle-mushroom",
        batchId: batchW1T,
        qty: 16,
        remaining: 0,
        takenAt: thawYesterday,
        deadlineAt: addHoursIso(thawYesterday, hold),
      },
      {
        id: "t-today-n",
        variantId: "nduja",
        batchId: batchW1N,
        qty: 18,
        remaining: 18,
        takenAt: thawToday,
        deadlineAt: addHoursIso(thawToday, hold),
      },
      {
        id: "t-today-t",
        variantId: "truffle-mushroom",
        batchId: batchW1T,
        qty: 16,
        remaining: 16,
        takenAt: thawToday,
        deadlineAt: addHoursIso(thawToday, hold),
      },
    ],
    dayStatuses: [
      {
        id: "ds-2",
        date: dayStamp(2),
        recordedAt: isoDaysAgo(2, 23),
        lines: [
          { variantId: "nduja", sold: 14, discarded: 2, thawedUnsold: 0, priceOverrideOre: null },
          {
            variantId: "truffle-mushroom",
            sold: 12,
            discarded: 0,
            thawedUnsold: 0,
            priceOverrideOre: null,
          },
        ],
        workflow: "easy",
        comment: "Airfryeren bak baren funket fint.",
      },
      {
        id: "ds-1",
        date: dayStamp(1),
        recordedAt: isoDaysAgo(1, 23),
        lines: [
          { variantId: "nduja", sold: 16, discarded: 2, thawedUnsold: 2, priceOverrideOre: 7900 },
          {
            variantId: "truffle-mushroom",
            sold: 14,
            discarded: 2,
            thawedUnsold: 0,
            priceOverrideOre: null,
          },
        ],
        workflow: "ok",
        comment: "Trøffel gikk ut først. Nduja fikk happy hour-pris etter 22.",
      },
    ],
    weeklyObservations: [
      {
        id: "w-prev",
        weekStart: dayStamp(9),
        recordedAt: isoDaysAgo(4, 11),
        drinkImpact: { choice: "up", comment: "Øl og aperitivo sammen med arancini." },
        vsExistingFood: { choice: "better", comment: "Raskere enn pizza, mer «bar-mat»." },
        staffExperience: { choice: "ok", comment: "Tining må huskes — derfor appen." },
        guestFeedback: { choice: "loved", comment: "Flere spurte hva det var. Ingen navn notert." },
        objections: { choice: "price", comment: "Noen synes 89 er dyrt sent på kveld." },
        deliveryExperience: { choice: "smooth", comment: "Levert frosset, merket, i kasser." },
        ideas: "Happy hour-skilt ved airfryeren. Trøffel som ukens.",
      },
    ],
    deviations: [],
    recommendations: [],
    activity: [
      {
        id: "a1",
        at: week1At,
        kind: "delivery",
        title: "Leveranse uke 1",
        detail: "100 stk · 50 nduja + 50 trøffel",
      },
      {
        id: "a2",
        at: week2At,
        kind: "delivery",
        title: "Leveranse uke 2",
        detail: "100 stk · avtalt ukesmengde",
      },
      {
        id: "a3",
        at: thawToday,
        kind: "thaw",
        title: "Uttak fra fryser",
        detail: "18 nduja + 16 trøffel",
      },
    ],
  };
}
