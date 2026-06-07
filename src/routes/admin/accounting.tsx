import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowLeft, ExternalLink, Plus, Send, Upload, RefreshCw,
  Receipt, AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import {
  useAccountingStatus,
  useSendTestIncome,
  useSendManualEntry,
  useSendKlinkSettlement,
  useUploadAttachment,
  financeCoreOrgUrl,
  type ManualEntryData,
  type KlinkSettlementData,
} from "@/lib/finance-core/hooks";

export const Route = createFileRoute("/admin/accounting")({
  head: () => ({
    meta: [
      { title: "Regnskap — Gold of Sicily" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountingPage,
});

function formatNok(n: number | null | undefined) {
  const v = typeof n === "number" ? n : 0;
  return new Intl.NumberFormat("nb-NO", {
    style: "currency", currency: "NOK", maximumFractionDigits: 0,
  }).format(v);
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "pos" | "neg" | "warn" }) {
  const color = tone === "pos" ? "text-emerald-600"
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

function AccountingPage() {
  const status = useAccountingStatus();
  const totals = status.data?.totals;
  const entries = status.data?.entries ?? [];
  const summary = status.data?.summary;

  const testMut = useSendTestIncome();

  async function handleTest() {
    try {
      const r = await testMut.mutateAsync();
      toast.success(r.alreadyExists ? "Allerede bokført i Finance Core (idempotens OK)" : "Testinntekt sendt til Finance Core");
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-1">
            <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Tilbake til admin
            </Link>
          </div>
          <h1 className="font-display text-3xl tracking-tight">Regnskap</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sender data til <strong>Finance Core</strong>. Full regnskapsvisning, bilag og rapporter ligger der.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => status.refetch()} disabled={status.isFetching}>
            <RefreshCw className={`h-4 w-4 ${status.isFetching ? "animate-spin" : ""}`} />
            Oppdater
          </Button>
          <Button asChild>
            <a href={financeCoreOrgUrl()} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4" /> Åpne i Finance Core
            </a>
          </Button>
        </div>
      </div>

      {status.error && (
        <Card className="border-destructive/40">
          <CardContent className="flex items-start gap-2 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
            <div>
              <div className="font-medium">Kunne ikke hente status fra Finance Core</div>
              <div className="text-muted-foreground">{(status.error as Error).message}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Kpi label="Inntekter (i år)" value={formatNok(totals?.income ?? summary?.income ?? 0)} tone="pos" />
        <Kpi label="Utgifter (i år)" value={formatNok(totals?.expense ?? summary?.expense ?? 0)} tone="neg" />
        <Kpi
          label="Resultat"
          value={formatNok(totals?.result ?? summary?.result ?? 0)}
          tone={(totals?.result ?? 0) >= 0 ? "pos" : "neg"}
        />
        <Kpi label="Ubetalte poster" value={String(totals?.unpaidCount ?? 0)} tone={(totals?.unpaidCount ?? 0) > 0 ? "warn" : undefined} />
        <Kpi label="Mangler bilag" value={String(totals?.missingAttachmentCount ?? 0)} tone={(totals?.missingAttachmentCount ?? 0) > 0 ? "warn" : undefined} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Handlinger</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleTest} disabled={testMut.isPending}>
            <Send className="h-4 w-4" /> Send testinntekt (100 kr)
          </Button>
          <ManualEntryDialog type="income" />
          <ManualEntryDialog type="expense" />
          <KlinkSettlementDialog />
          <AttachmentDialog />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Siste poster fra Finance Core</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          {status.isLoading ? (
            <div className="p-6 text-sm text-muted-foreground">Laster…</div>
          ) : entries.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">Ingen poster ennå.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2">Dato</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Beskrivelse</th>
                  <th className="px-4 py-2">Kategori</th>
                  <th className="px-4 py-2 text-right">Beløp</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Kilde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.slice(0, 50).map((e) => (
                  <tr key={e.id} className="hover:bg-muted/30">
                    <td className="px-4 py-2 tabular-nums">{e.entry_date}</td>
                    <td className="px-4 py-2">
                      <Badge variant={e.entry_type === "income" ? "default" : "secondary"}>
                        {e.entry_type === "income" ? "Inntekt" : "Utgift"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2">
                      <div className="font-medium">{e.description}</div>
                      {e.counterparty && <div className="text-xs text-muted-foreground">{e.counterparty}</div>}
                    </td>
                    <td className="px-4 py-2 text-muted-foreground">{e.category ?? "—"}</td>
                    <td className={`px-4 py-2 text-right tabular-nums ${e.entry_type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatNok(Number(e.amount_gross))}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{e.payment_status}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{e.source_app ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Manual entry dialog ───────────────────────────────────── */
function ManualEntryDialog({ type }: { type: "income" | "expense" }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<ManualEntryData>({
    entry_type: type,
    entry_date: new Date().toISOString().slice(0, 10),
    description: "",
    amount_gross: 0,
    category: "",
    counterparty: "",
    notes: "",
  });
  const mut = useSendManualEntry();

  async function submit() {
    if (!form.description || !form.amount_gross) {
      toast.error("Beskrivelse og beløp er påkrevd");
      return;
    }
    try {
      await mut.mutateAsync({ ...form, entry_type: type });
      toast.success(`${type === "income" ? "Inntekt" : "Utgift"} sendt til Finance Core`);
      setOpen(false);
      setForm({ ...form, description: "", amount_gross: 0, counterparty: "", notes: "" });
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4" /> {type === "income" ? "Manuell inntekt" : "Manuell utgift"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "income" ? "Ny inntekt" : "Ny utgift"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Beskrivelse</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Beløp (kr)</Label>
              <Input type="number" min={0} step="0.01" value={form.amount_gross || ""} onChange={(e) => setForm({ ...form, amount_gross: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Dato</Label>
              <Input type="date" value={form.entry_date} onChange={(e) => setForm({ ...form, entry_date: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kategori</Label>
              <Input value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="f.eks. Råvarer" />
            </div>
            <div>
              <Label>Motpart</Label>
              <Input value={form.counterparty ?? ""} onChange={(e) => setForm({ ...form, counterparty: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Notater</Label>
            <Textarea rows={2} value={form.notes ?? ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button onClick={submit} disabled={mut.isPending}>Send til Finance Core</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Klink settlement dialog ───────────────────────────────── */
function KlinkSettlementDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<KlinkSettlementData>({
    eventSlug: "",
    eventName: "",
    settlementDate: new Date().toISOString().slice(0, 10),
    totalRevenueNok: 0,
    ourSharePercent: 70,
    reportUrl: "",
  });
  const mut = useSendKlinkSettlement();
  const ourShare = Math.round((form.totalRevenueNok || 0) * (form.ourSharePercent / 100));

  async function submit() {
    if (!form.eventSlug || !form.eventName || !form.totalRevenueNok) {
      toast.error("Slug, eventnavn og omsetning er påkrevd");
      return;
    }
    try {
      const r = await mut.mutateAsync({
        ...form,
        reportUrl: form.reportUrl?.trim() ? form.reportUrl : undefined,
      });
      toast.success(r.alreadyExists ? "Allerede bokført (idempotens OK)" : `Klink-oppgjør sendt (${formatNok(ourShare)})`);
      setOpen(false);
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Receipt className="h-4 w-4" /> Klink-oppgjør
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Klink popup-oppgjør</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Event slug</Label>
              <Input value={form.eventSlug} onChange={(e) => setForm({ ...form, eventSlug: e.target.value })} placeholder="klink-oslo-2026-06" />
            </div>
            <div>
              <Label>Eventnavn</Label>
              <Input value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} placeholder="Klink Oslo" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Dato</Label>
              <Input type="date" value={form.settlementDate} onChange={(e) => setForm({ ...form, settlementDate: e.target.value })} />
            </div>
            <div>
              <Label>Total omsetning (kr)</Label>
              <Input type="number" min={0} value={form.totalRevenueNok || ""} onChange={(e) => setForm({ ...form, totalRevenueNok: Number(e.target.value) })} />
            </div>
            <div>
              <Label>Vår andel %</Label>
              <Input type="number" min={0} max={100} value={form.ourSharePercent} onChange={(e) => setForm({ ...form, ourSharePercent: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <Label>Rapport-URL (full https://, valgfri)</Label>
            <Input value={form.reportUrl ?? ""} onChange={(e) => setForm({ ...form, reportUrl: e.target.value })} placeholder="https://goldofsicily.no/..." />
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            Vår andel: <strong>{formatNok(ourShare)}</strong>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button onClick={submit} disabled={mut.isPending}>Send til Finance Core</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Attachment dialog ─────────────────────────────────────── */
function AttachmentDialog() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [entryId, setEntryId] = useState("");
  const mut = useUploadAttachment();

  async function submit() {
    if (!file) {
      toast.error("Velg en fil");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    if (entryId.trim()) form.append("entry_id", entryId.trim());
    try {
      await mut.mutateAsync(form);
      toast.success("Bilag lastet opp til Finance Core");
      setOpen(false);
      setFile(null);
      setEntryId("");
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="h-4 w-4" /> Last opp bilag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Last opp bilag</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Fil (PDF eller bilde)</Label>
            <Input type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </div>
          <div>
            <Label>Entry ID (valgfri)</Label>
            <Input value={entryId} onChange={(e) => setEntryId(e.target.value)} placeholder="uuid på post i Finance Core" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button onClick={submit} disabled={mut.isPending || !file}>Last opp</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
