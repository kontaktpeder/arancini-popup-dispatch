import { WEEKLY_QUESTIONS } from "./catalog";
import { funnel, revenueOre, stockByVariant, approachingDeadlines, weekMetrics } from "./calc";
import { formatKr, formatOsloDate, formatPct, weekEndOslo } from "./time";
import type { PilotState, WeeklyObservation } from "./types";

type WeeklyKey =
  | "drinkImpact"
  | "vsExistingFood"
  | "staffExperience"
  | "guestFeedback"
  | "objections"
  | "deliveryExperience";

function choiceLabel(key: WeeklyKey, value: string): string {
  const q = WEEKLY_QUESTIONS.find((item) => item.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}

export function weeklyStatusText(
  state: PilotState,
  weekStart: string,
  observation?: WeeklyObservation,
): string {
  const week = weekMetrics(state, weekStart);
  const stock = stockByVariant(state);
  const funnelNow = funnel(state);
  const due = approachingDeadlines(state).filter((d) => d.status !== "ok");
  const obs = observation ?? state.weeklyObservations.find((w) => w.weekStart === weekStart);

  const lines = [
    `Ukentlig status — ${state.org.venueName}`,
    `Uke ${formatOsloDate(week.weekStart)} – ${formatOsloDate(weekEndOslo(week.weekStart))}`,
    "",
    "Dette erstatter separat ukesrapport (punkt 10). Daglig registrering er en enkel metode som bygger statusen automatisk — ikke en ny plikt.",
    "",
    "Tall",
    `• Levert denne uken: ${week.deliveredThisWeek} av avtalt ${week.contractedWeeklyQty} stk (endres ikke automatisk)`,
    `• Solgt: ${week.sold} stk`,
    `• Kassert: ${week.discarded} stk`,
    `• Omsetning: ${formatKr(week.revenueOre)}`,
    `• Svinn: ${formatPct(week.wastePct)}`,
    `• Salgsgrad: ${formatPct(week.sellThroughPct)}`,
    `• På fryselager nå: ${funnelNow.freezer} stk`,
    `• Tint beholdning nå: ${funnelNow.remainingThawed} stk`,
    "",
    "Per variant",
    ...stock.map(
      (s) =>
        `• ${s.variant.name}: levert ${s.delivered}, frys ${s.freezer}, tint ${s.thawed}, solgt ${s.sold}, kassert ${s.discarded}, omsetning ${formatKr(s.revenueOre)}`,
    ),
  ];

  if (due.length) {
    lines.push("", "Nærmer seg frist");
    for (const item of due.slice(0, 6)) {
      const hours = Math.round(item.hoursLeft);
      lines.push(
        `• ${item.variant.shortName} ${item.lot.remaining} stk · ${item.batch?.lotCode ?? "batch"} · ${hours < 0 ? "over frist" : `${hours} t igjen`}`,
      );
    }
  }

  if (obs) {
    lines.push("", "Observasjoner");
    lines.push(
      `• Drikkesalg / matomsetning: ${choiceLabel("drinkImpact", obs.drinkImpact.choice)}${obs.drinkImpact.comment ? ` — ${obs.drinkImpact.comment}` : ""}`,
    );
    lines.push(
      `• Mot pizza / eksisterende mat: ${choiceLabel("vsExistingFood", obs.vsExistingFood.choice)}${obs.vsExistingFood.comment ? ` — ${obs.vsExistingFood.comment}` : ""}`,
    );
    lines.push(
      `• Ansatte: ${choiceLabel("staffExperience", obs.staffExperience.choice)}${obs.staffExperience.comment ? ` — ${obs.staffExperience.comment}` : ""}`,
    );
    lines.push(
      `• Gjester (anonymisert): ${choiceLabel("guestFeedback", obs.guestFeedback.choice)}${obs.guestFeedback.comment ? ` — ${obs.guestFeedback.comment}` : ""}`,
    );
    lines.push(
      `• Innvendinger: ${choiceLabel("objections", obs.objections.choice)}${obs.objections.comment ? ` — ${obs.objections.comment}` : ""}`,
    );
    lines.push(
      `• Leveranser: ${choiceLabel("deliveryExperience", obs.deliveryExperience.choice)}${obs.deliveryExperience.comment ? ` — ${obs.deliveryExperience.comment}` : ""}`,
    );
    if (obs.ideas.trim()) lines.push(`• Ideer: ${obs.ideas.trim()}`);
  } else {
    lines.push("", "Observasjoner: ikke fylt ut denne uken.");
  }

  const openDev = state.deviations.filter((d) => d.recordedAt.slice(0, 10) >= week.weekStart);
  if (openDev.length) {
    lines.push("", `Avvik denne uken: ${openDev.length} (varslet umiddelbart, ikke via dagsrapport)`);
  }

  lines.push(
    "",
    "Leveranseanbefalinger i appen iverksettes ikke uten skriftlig avtale. Første versjon er loggføring, automatiske beregninger og enkle varsler — ikke AI-prognoser.",
  );

  return lines.join("\n");
}

export function endEvaluationStub(state: PilotState): string {
  const sold = state.dayStatuses.reduce(
    (s, d) => s + d.lines.reduce((n, l) => n + l.sold, 0),
    0,
  );
  const discarded = state.dayStatuses.reduce(
    (s, d) => s + d.lines.reduce((n, l) => n + l.discarded, 0),
    0,
  );
  return [
    `Sluttevaluering (utkast) — ${state.org.venueName}`,
    "Fire uker og 400 produkter er for lite til avansert AI. Første versjon er loggføring og læring.",
    `Så langt: ${sold} solgt, ${discarded} kassert, omsetning ${formatKr(revenueOre(state))}.`,
    "Data fra flere pilotsteder kan senere brukes til reelle salgsprognoser.",
  ].join("\n");
}
