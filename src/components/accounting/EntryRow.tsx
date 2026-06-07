import { Paperclip } from "lucide-react";
import { formatNok } from "./KpiRow";
import { PAYMENT_STATUS_LABEL } from "@/lib/finance-core/categories";
import type { FinanceCoreEntry } from "@/lib/finance-core/types";

interface Props {
  entry: FinanceCoreEntry;
  selected: boolean;
  onToggle: () => void;
}

export function EntryRow({ entry: e, selected, onToggle }: Props) {
  const hasAttachment = e.has_attachment || (e.attachment_count ?? 0) > 0;
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`grid w-full grid-cols-[90px_1fr_120px_110px_24px] items-center gap-3 px-4 py-3 text-left text-sm hover:bg-muted/40 ${
        selected ? "bg-muted/60" : ""
      }`}
    >
      <span className="tabular-nums text-muted-foreground">{e.entry_date}</span>
      <span className="min-w-0">
        <div className="truncate font-medium">{e.description}</div>
        {e.counterparty && <div className="truncate text-xs text-muted-foreground">{e.counterparty}</div>}
      </span>
      <span className={`tabular-nums text-right font-medium ${e.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
        {e.entry_type === "income" ? "+" : "−"}{formatNok(Number(e.amount_gross))}
      </span>
      <span className="text-xs text-muted-foreground">{PAYMENT_STATUS_LABEL[e.payment_status] ?? e.payment_status}</span>
      <span className="text-muted-foreground">
        {hasAttachment ? <Paperclip className="h-3.5 w-3.5" /> : null}
      </span>
    </button>
  );
}
