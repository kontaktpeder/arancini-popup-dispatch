import { useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AttachmentSection } from "./AttachmentSection";
import { formatNok } from "./KpiRow";
import { categoriesFor, PAYMENT_STATUS_LABEL, INVOICE_STATUS_LABEL } from "@/lib/finance-core/categories";
import { useDeleteEntry, usePatchEntry } from "@/lib/finance-core/hooks";
import type {
  FinanceCoreEntry,
  FinanceCoreEntryPatch,
  PaymentStatus,
  InvoiceStatus,
} from "@/lib/finance-core/types";

interface Props {
  entry: FinanceCoreEntry;
  onClose: () => void;
}

export function EntryDetailPanel({ entry, onClose }: Props) {
  const [form, setForm] = useState<FinanceCoreEntryPatch>({
    entry_date: entry.entry_date,
    description: entry.description,
    counterparty: entry.counterparty ?? "",
    category: entry.category ?? "",
    amount_gross: Number(entry.amount_gross) || 0,
    vat_rate: entry.vat_rate ?? 0,
    payment_status: entry.payment_status,
    invoice_status: entry.invoice_status,
    notes: entry.notes ?? "",
    external_url: entry.external_url ?? "",
  });
  const [unsupported, setUnsupported] = useState(false);
  const patch = usePatchEntry();
  const del = useDeleteEntry();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const categories = categoriesFor(entry.entry_type);

  async function save() {
    try {
      const clean: FinanceCoreEntryPatch = { ...form };
      // Strip empty strings to null/undefined for nullable fields
      (["counterparty", "notes", "external_url"] as const).forEach((k) => {
        if (typeof clean[k] === "string" && !(clean[k] as string).trim()) {
          (clean as any)[k] = null;
        }
      });
      const r = await patch.mutateAsync({ id: entry.id, patch: clean });
      if (!r.supported) {
        setUnsupported(true);
        toast.error("Redigering krever Finance Core-oppdatering.");
        return;
      }
      toast.success("Lagret i Finance Core");
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  function set<K extends keyof FinanceCoreEntryPatch>(k: K, v: FinanceCoreEntryPatch[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Detaljer
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {unsupported && (
          <div className="flex items-start gap-2 rounded-md border border-amber-500/30 bg-amber-50/40 p-3 text-xs text-amber-700">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
            Redigering krever Finance Core-oppdatering. Endringene ble ikke lagret.
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Dato</Label>
            <Input type="date" value={form.entry_date ?? ""} onChange={(e) => set("entry_date", e.target.value)} />
          </div>
          <div>
            <Label>Beløp (kr)</Label>
            <Input
              type="number"
              step="0.01"
              value={form.amount_gross ?? 0}
              onChange={(e) => set("amount_gross", Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <Label>Beskrivelse</Label>
          <Input value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Motpart</Label>
            <Input value={(form.counterparty as string) ?? ""} onChange={(e) => set("counterparty", e.target.value)} />
          </div>
          <div>
            <Label>Kategori</Label>
            <Select value={(form.category as string) || "Annet"} onValueChange={(v) => set("category", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Betalingsstatus</Label>
            <Select value={form.payment_status} onValueChange={(v) => set("payment_status", v as PaymentStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(PAYMENT_STATUS_LABEL).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Fakturastatus</Label>
            <Select value={form.invoice_status} onValueChange={(v) => set("invoice_status", v as InvoiceStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(INVOICE_STATUS_LABEL).map(([k, l]) => (
                  <SelectItem key={k} value={k}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>MVA-sats (0–1)</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={form.vat_rate ?? 0}
              onChange={(e) => set("vat_rate", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Ekstern URL</Label>
            <Input
              value={(form.external_url as string) ?? ""}
              onChange={(e) => set("external_url", e.target.value)}
              placeholder="https://…"
            />
          </div>
        </div>

        <div>
          <Label>Notater</Label>
          <Textarea rows={2} value={(form.notes as string) ?? ""} onChange={(e) => set("notes", e.target.value)} />
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          <Button onClick={save} disabled={patch.isPending}>
            <Save className="h-4 w-4" /> Lagre
          </Button>
          <Button variant="ghost" onClick={onClose}>Lukk</Button>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t pt-3 text-xs text-muted-foreground">
          <div><span className="font-medium">Kilde-app:</span> {entry.source_app ?? "—"}</div>
          <div><span className="font-medium">Kilde-type:</span> {entry.source_type ?? "—"}</div>
          <div><span className="font-medium">Source ref:</span> <span className="break-all">{entry.source_ref ?? "—"}</span></div>
          <div><span className="font-medium">Opprettet:</span> {entry.created_at?.slice(0, 10) ?? "—"}</div>
          {(entry.ai_confidence != null || entry.ai_model) && (
            <div className="col-span-2 rounded border bg-background p-2">
              <div className="font-medium text-foreground">AI-data</div>
              {entry.ai_model && <div>Modell: {entry.ai_model}</div>}
              {entry.ai_confidence != null && <div>Konfidens: {Math.round((entry.ai_confidence ?? 0) * 100)}%</div>}
              {entry.ai_notes && <div className="mt-1">{entry.ai_notes}</div>}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 rounded-lg border bg-background p-4">
        <AttachmentSection entryId={entry.id} />
      </div>
    </div>
  );
}
