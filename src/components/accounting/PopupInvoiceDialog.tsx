import { useState } from "react";
import { toast } from "sonner";
import { FileText, ExternalLink, Send, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatNok } from "./KpiRow";
import {
  useCreatePopupInvoice,
  useSendPopupInvoice,
  useOpenPopupInvoicePdf,
  financeCoreInvoiceUrl,
} from "@/lib/finance-core/hooks";
import { KLINK_DEFAULT_CUSTOMER, calcOurShareNok } from "@/lib/finance-core/invoice.mappers";
import type { FinanceCoreInvoice } from "@/lib/finance-core/types";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type LineRow = {
  eventName: string;
  eventDate: string;
  totalRevenueNok: number;
  ourSharePercent: number;
};

const DEFAULT_LINES: LineRow[] = [
  { eventName: "Klink", eventDate: todayISO(), totalRevenueNok: 0, ourSharePercent: 70 },
  { eventName: "Rampen", eventDate: todayISO(), totalRevenueNok: 0, ourSharePercent: 70 },
];

export function PopupInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [referenceKey, setReferenceKey] = useState("jajaja-klink-rampen-2026-06");
  const [lines, setLines] = useState<LineRow[]>(DEFAULT_LINES);
  const [invoice, setInvoice] = useState<FinanceCoreInvoice | null>(null);

  const createMut = useCreatePopupInvoice();
  const sendMut = useSendPopupInvoice();
  const pdfMut = useOpenPopupInvoicePdf();

  const subtotal = lines.reduce(
    (acc, l) => acc + calcOurShareNok(l.totalRevenueNok || 0, l.ourSharePercent || 0),
    0,
  );

  function updateLine(idx: number, patch: Partial<LineRow>) {
    setLines((ls) => ls.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  }
  function addLine() {
    setLines((ls) => [...ls, { eventName: "", eventDate: todayISO(), totalRevenueNok: 0, ourSharePercent: 70 }]);
  }
  function removeLine(idx: number) {
    setLines((ls) => ls.filter((_, i) => i !== idx));
  }

  async function handleCreate() {
    if (!referenceKey.trim()) {
      toast.error("Referansenøkkel er påkrevd");
      return;
    }
    if (lines.some((l) => !l.eventName || !l.totalRevenueNok)) {
      toast.error("Alle linjer trenger navn og omsetning");
      return;
    }
    try {
      const r = await createMut.mutateAsync({ referenceKey: referenceKey.trim(), lines });
      setInvoice(r.invoice);
      toast.success(r.alreadyExists ? "Faktura finnes allerede" : "Faktura opprettet (draft)");
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  async function handleSend() {
    if (!invoice) return;
    try {
      const r = await sendMut.mutateAsync(invoice.id);
      setInvoice(r.invoice);
      toast.success(`Faktura sendt – nr. ${r.invoice.invoice_number ?? "?"}`);
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  async function handlePdf() {
    if (!invoice) return;
    try {
      await pdfMut.mutateAsync(invoice.id);
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  function reset() {
    setInvoice(null);
    setLines(DEFAULT_LINES);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4" /> Popup-faktura
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Popup-faktura til JAJAJA AS</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Referansenøkkel (idempotens)</Label>
            <Input
              value={referenceKey}
              onChange={(e) => setReferenceKey(e.target.value)}
              disabled={!!invoice}
              placeholder="jajaja-klink-rampen-2026-06"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Brukes for å unngå duplikate fakturaer. Bruk samme nøkkel om du må gjenta.
            </p>
          </div>

          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
            <div className="mb-1 font-medium">Kunde</div>
            <div className="text-muted-foreground">
              {KLINK_DEFAULT_CUSTOMER.customer_name} · org. {KLINK_DEFAULT_CUSTOMER.customer_org_number}
            </div>
            <div className="text-muted-foreground">{KLINK_DEFAULT_CUSTOMER.customer_address}</div>
            <div className="text-muted-foreground">{KLINK_DEFAULT_CUSTOMER.customer_email}</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Linjer</Label>
              {!invoice && (
                <Button variant="ghost" size="sm" onClick={addLine}>
                  <Plus className="h-3 w-3" /> Legg til
                </Button>
              )}
            </div>
            {lines.map((line, idx) => {
              const share = calcOurShareNok(line.totalRevenueNok || 0, line.ourSharePercent || 0);
              return (
                <div key={idx} className="rounded-md border border-border p-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Event</Label>
                      <Input
                        value={line.eventName}
                        disabled={!!invoice}
                        onChange={(e) => updateLine(idx, { eventName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Dato</Label>
                      <Input
                        type="date"
                        value={line.eventDate}
                        disabled={!!invoice}
                        onChange={(e) => updateLine(idx, { eventDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Total oms. (kr)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={line.totalRevenueNok || ""}
                        disabled={!!invoice}
                        onChange={(e) => updateLine(idx, { totalRevenueNok: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Vår andel %</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={line.ourSharePercent}
                        disabled={!!invoice}
                        onChange={(e) => updateLine(idx, { ourSharePercent: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex items-end justify-between gap-2">
                      <div className="text-sm">
                        <div className="text-xs text-muted-foreground">Andel</div>
                        <div className="font-medium">{formatNok(share)}</div>
                      </div>
                      {!invoice && lines.length > 1 && (
                        <Button variant="ghost" size="sm" onClick={() => removeLine(idx)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-md bg-muted/50 p-3 text-sm">
            Sum (eks. mva, fra linjer): <strong>{formatNok(subtotal)}</strong>
          </div>

          {invoice && (
            <div className="rounded-md border border-border p-3 text-sm space-y-1">
              <div>
                Fakturanr.: <strong>{invoice.invoice_number ?? "Utkast"}</strong>
              </div>
              <div>
                Status: <strong>{invoice.status}</strong>
              </div>
              <div>
                Total: <strong>{formatNok(invoice.total ?? 0)}</strong>{" "}
                <span className="text-muted-foreground">
                  (netto {formatNok(invoice.subtotal ?? 0)} + mva {formatNok(invoice.vat_amount ?? 0)})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button asChild variant="ghost" size="sm">
                  <a href={financeCoreInvoiceUrl(invoice.id)} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" /> Åpne i Finance Core
                  </a>
                </Button>
                {invoice.status === "sent" && (
                  <Button variant="outline" size="sm" onClick={handlePdf} disabled={pdfMut.isPending}>
                    <FileText className="h-4 w-4" /> Åpne PDF
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Lukk
          </Button>
          {!invoice && (
            <Button onClick={handleCreate} disabled={createMut.isPending}>
              <Plus className="h-4 w-4" /> Lag faktura i Finance Core
            </Button>
          )}
          {invoice && invoice.status === "draft" && (
            <Button onClick={handleSend} disabled={sendMut.isPending}>
              <Send className="h-4 w-4" /> Send faktura
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
