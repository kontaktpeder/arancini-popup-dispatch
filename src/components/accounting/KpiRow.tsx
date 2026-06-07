import { Card, CardContent } from "@/components/ui/card";

export function formatNok(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 0,
  }).format(v);
}

interface KpiProps {
  label: string;
  value: string;
  tone?: "pos" | "neg" | "warn";
}

function Kpi({ label, value, tone }: KpiProps) {
  const color =
    tone === "pos" ? "text-emerald-600"
    : tone === "neg" ? "text-rose-600"
    : tone === "warn" ? "text-amber-600"
    : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className={`mt-1 text-2xl font-semibold tabular-nums ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

interface KpiRowProps {
  income: number;
  expense: number;
  result: number;
  unpaidCount: number;
  missingAttachmentCount: number;
}

export function KpiRow({ income, expense, result, unpaidCount, missingAttachmentCount }: KpiRowProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
      <Kpi label="Inntekter (i år)" value={formatNok(income)} tone="pos" />
      <Kpi label="Utgifter (i år)" value={formatNok(expense)} tone="neg" />
      <Kpi label="Resultat" value={formatNok(result)} tone={result >= 0 ? "pos" : "neg"} />
      <Kpi label="Ubetalte poster" value={String(unpaidCount)} tone={unpaidCount > 0 ? "warn" : undefined} />
      <Kpi label="Mangler bilag" value={String(missingAttachmentCount)} tone={missingAttachmentCount > 0 ? "warn" : undefined} />
    </div>
  );
}
