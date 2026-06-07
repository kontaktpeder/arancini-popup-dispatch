import { formatNok } from "./KpiRow";
import type { CategoryShareRow } from "@/lib/finance-core/grouping";

interface Props {
  rows: CategoryShareRow[];
  emptyText?: string;
}

export function ReportsCategories({ rows, emptyText = "Ingen data." }: Props) {
  if (rows.length === 0) {
    return <div className="p-6 text-sm text-muted-foreground">{emptyText}</div>;
  }
  return (
    <table className="w-full text-sm">
      <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
        <tr>
          <th className="px-4 py-2">Kategori</th>
          <th className="px-4 py-2 text-right">Beløp</th>
          <th className="px-4 py-2 text-right">Andel</th>
          <th className="px-4 py-2">Fordeling</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {rows.map((r) => (
          <tr key={r.category}>
            <td className="px-4 py-2 font-medium">{r.category}</td>
            <td className="px-4 py-2 text-right tabular-nums">{formatNok(r.amount)}</td>
            <td className="px-4 py-2 text-right tabular-nums text-muted-foreground">
              {Math.round(r.share * 100)}%
            </td>
            <td className="px-4 py-2">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${Math.max(2, Math.round(r.share * 100))}%` }}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
