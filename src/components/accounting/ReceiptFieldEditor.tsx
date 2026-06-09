import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { categoriesFor, INVOICE_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/finance-core/categories";
import type { EntryType } from "@/lib/finance-core/types";

export interface ReceiptDraft {
  entry_type: EntryType;
  entry_date: string;
  counterparty: string;
  description: string;
  category: string;
  amount_gross: number;
  vat_rate: number;
  payment_status: string;
  invoice_status: string;
  before_company_founded: boolean;
  notes: string;
}

interface Props {
  draft: ReceiptDraft;
  onChange: (patch: Partial<ReceiptDraft>) => void;
}

export function ReceiptFieldEditor({ draft, onChange }: Props) {
  const cats = categoriesFor(draft.entry_type);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select
            value={draft.entry_type}
            onValueChange={(v) => onChange({ entry_type: v as EntryType, category: "Annet" })}
          >
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="expense">Utgift</SelectItem>
              <SelectItem value="income">Inntekt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Dato</Label>
          <Input
            type="date"
            className="h-11"
            value={draft.entry_date}
            onChange={(e) => onChange({ entry_date: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Motpart</Label>
        <Input
          className="h-11"
          value={draft.counterparty}
          onChange={(e) => onChange({ counterparty: e.target.value })}
        />
      </div>
      <div>
        <Label>Beskrivelse</Label>
        <Input
          className="h-11"
          value={draft.description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Kategori</Label>
          <Select value={draft.category} onValueChange={(v) => onChange({ category: v })}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {cats.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Beløp (kr)</Label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            className="h-11"
            value={draft.amount_gross || ""}
            onChange={(e) => onChange({ amount_gross: Number(e.target.value) })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>MVA</Label>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            max="1"
            className="h-11"
            value={draft.vat_rate}
            onChange={(e) => onChange({ vat_rate: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label>Betaling</Label>
          <Select value={draft.payment_status} onValueChange={(v) => onChange({ payment_status: v })}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(PAYMENT_STATUS_LABEL).map(([k, l]) => (
                <SelectItem key={k} value={k}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Faktura</Label>
          <Select value={draft.invoice_status} onValueChange={(v) => onChange({ invoice_status: v })}>
            <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(INVOICE_STATUS_LABEL).map(([k, l]) => (
                <SelectItem key={k} value={k}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={draft.before_company_founded}
          onCheckedChange={(v) => onChange({ before_company_founded: !!v })}
        />
        Før selskapsstiftelse
      </label>

      <div>
        <Label>Notater</Label>
        <Textarea
          rows={2}
          value={draft.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </div>
    </div>
  );
}
