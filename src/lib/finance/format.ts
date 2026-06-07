/** Format amount stored as øre into NOK currency string. */
export function formatNok(ore: number | null | undefined): string {
  const v = (ore ?? 0) / 100;
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
  }).format(v);
}

/** Parse user input "1 234,50" or "1234.50" (kroner) into øre. */
export function parseKrToOre(v: string): number {
  const normalized = v.replace(/\s/g, "").replace(",", ".");
  const n = Number(normalized);
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}
