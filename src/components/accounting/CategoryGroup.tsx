import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EntryRow } from "./EntryRow";
import { EntryDetailPanel } from "./EntryDetailPanel";
import { formatNok } from "./KpiRow";
import type { CategoryGroupData } from "@/lib/finance-core/grouping";
import type { EntryType } from "@/lib/finance-core/types";

interface Props {
  group: CategoryGroupData;
  type: EntryType;
  defaultOpen?: boolean;
}

export function CategoryGroup({ group, type, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen || group.count > 0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-muted/40"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          <span className="font-medium">{group.category}</span>
          <Badge variant="secondary" className="ml-1">{group.count}</Badge>
          {group.unpaidTotal > 0 && (
            <Badge variant="outline" className="border-amber-500 text-amber-600">
              Ubetalt: {formatNok(group.unpaidTotal)}
            </Badge>
          )}
          {group.missingAttachmentCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-600">
              <Paperclip className="h-3 w-3" /> Mangler bilag: {group.missingAttachmentCount}
            </span>
          )}
        </div>
        <div className={`font-semibold tabular-nums ${type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
          {formatNok(group.total)}
        </div>
      </button>

      {open && (
        <div className="border-t">
          {group.entries.length === 0 ? (
            <div className="px-4 py-6 text-sm text-muted-foreground">Ingen poster i denne kategorien ennå.</div>
          ) : (
            <div className="divide-y divide-border">
              {group.entries.map((e) => (
                <div key={e.id}>
                  <EntryRow
                    entry={e}
                    selected={selectedId === e.id}
                    onToggle={() => setSelectedId((cur) => (cur === e.id ? null : e.id))}
                  />
                  {selectedId === e.id && (
                    <div className="bg-muted/30 p-4">
                      <EntryDetailPanel entry={e} onClose={() => setSelectedId(null)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MissingCategoryHint() {
  return (
    <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50/40 p-3 text-xs text-amber-700">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5" />
      <span>Poster uten kategori havner i «Annet».</span>
    </div>
  );
}
