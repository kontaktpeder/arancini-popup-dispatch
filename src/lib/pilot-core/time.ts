/** Europe/Oslo date helpers for Pilot Core. */

const TZ = "Europe/Oslo";

export function nowIso(): string {
  return new Date().toISOString();
}

export function todayOslo(at = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(at);
}

export function formatOsloDate(isoOrDay: string): string {
  const d = isoOrDay.length <= 10 ? new Date(`${isoOrDay}T12:00:00+02:00`) : new Date(isoOrDay);
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(d);
}

export function formatOsloDateTime(iso: string): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatOsloTime(iso: string): string {
  return new Intl.DateTimeFormat("nb-NO", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function addHoursIso(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 60 * 60 * 1000).toISOString();
}

export function hoursUntil(deadlineIso: string, from = new Date()): number {
  return (new Date(deadlineIso).getTime() - from.getTime()) / (60 * 60 * 1000);
}

/** Monday of the ISO week containing `day` (YYYY-MM-DD), in Oslo. */
export function weekStartOslo(day = todayOslo()): string {
  const d = new Date(`${day}T12:00:00+02:00`);
  const utc = new Date(d.toLocaleString("en-US", { timeZone: TZ }));
  const dow = utc.getDay(); // 0 Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  utc.setDate(utc.getDate() + offset);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(utc);
}

export function weekEndOslo(weekStart: string): string {
  const d = new Date(`${weekStart}T12:00:00+02:00`);
  d.setDate(d.getDate() + 6);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(d);
}

export function isoWeekNumber(day = todayOslo()): number {
  const d = new Date(`${day}T12:00:00+02:00`);
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const diff = target.getTime() - firstThursday.getTime();
  return 1 + Math.round(diff / (7 * 24 * 3600 * 1000));
}

export function formatKr(ore: number): string {
  const kr = ore / 100;
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: kr % 1 === 0 ? 0 : 0,
  }).format(kr);
}

export function formatPct(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(value * 100)} %`;
}
