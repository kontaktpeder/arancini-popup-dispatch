import { formatNok } from "./KpiRow";
import type { MonthRow } from "@/lib/finance-core/grouping";

const MONTH_NAMES_NB = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember",
];

function monthLabel(m: string): string {
  const [, mm] = m.split("-");
  const idx = Math.max(0, Math.min(11, Number(mm) - 1));
  return MONTH_NAMES_NB[idx];
}

interface Props {
  rows: MonthRow[];
}

export function ReportsMonths({ rows }: Props) {
  if (rows.length === 0) {
    return <div className="p-6 text-sm text-muted-foreground">Ingen data for året.</div>;
  }
  const totals = rows.reduce(
    (acc, r) => ({ income: acc.income + r.income, expense: acc.expense + r.expense, result: acc.result + r.result }),
    { income: 0, expense: 0, result: 0 },
  );
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-2">Måned</th>
          <th className="px-4 py-2 text-right">Inntekter</th>
          <th className="px-4 py-2 text-right">Utgifter</th>
          <th className="px-4 py-2 text-right">Resultat</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.month}>
            <td className="px-4 py-2">{monthLabel(r.month)}</td>
            <td className="px-4 py-2 text-right tabular-nums text-emerald-600">{formatNok(r.income)}</td>
            <td className="px-4 py-2 text-right tabular-nums text-rose-600">{formatNok(r.expense)}</td>
            <td className={`px-4 py-2 text-right tabular-nums font-medium ${r.result >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {formatNok(r.result)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="border-t bg-muted/30 font-semibold">
        <tr>
          <td className="px-4 py-2">Sum</td>
          <td className="px-4 py-2 text-right tabular-nums text-emerald-600">{formatNok(totals.income)}</td>
          <td className="px-4 py-2 text-right tabular-nums text-rose-600">{formatNok(totals.expense)}</td>
          <td className={`px-4 py-2 text-right tabular-nums ${totals.result >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {formatNok(totals.result)}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}
