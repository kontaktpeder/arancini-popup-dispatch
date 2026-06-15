import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ExternalLink, RefreshCw, Send, AlertCircle, Plus, Receipt, Upload,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

import { KpiRow, formatNok } from "./KpiRow";
import { CategoryGroup } from "./CategoryGroup";
import { EntryRow } from "./EntryRow";
import { EntryDetailPanel } from "./EntryDetailPanel";
import { ReportsMonths } from "./ReportsMonths";
import { ReportsCategories } from "./ReportsCategories";
import { MobileReceiptScanButton } from "./MobileReceiptScanButton";
import { PopupInvoiceDialog } from "./PopupInvoiceDialog";

import {
  useAccountingStatus,
  useSendKlinkSettlement,
  useSendManualEntry,
  useSendTestIncome,
  useUploadAttachment,
  financeCoreOrgUrl,
  type KlinkSettlementData,
  type ManualEntryData,
} from "@/lib/finance-core/hooks";
import {
  categorySharesFromEntries,
  groupByCategory,
  monthsFromEntries,
  monthsFromSummary,
} from "@/lib/finance-core/grouping";

export function AccountingTabs() {
  const status = useAccountingStatus();
  const year = new Date().getFullYear();

  const entries = status.data?.entries ?? [];
  const totals = status.data?.totals;
  const summary = status.data?.summary;

  const expenseGroups = useMemo(() => groupByCategory(entries, "expense"), [entries]);
  const incomeGroups = useMemo(() => groupByCategory(entries, "income"), [entries]);
  const months = useMemo(() => {
    const fromSummary = monthsFromSummary(summary);
    return fromSummary.length > 0 ? fromSummary : monthsFromEntries(entries);
  }, [summary, entries]);
  const expenseShares = useMemo(() => categorySharesFromEntries(entries, "expense"), [entries]);
  const incomeShares = useMemo(() => categorySharesFromEntries(entries, "income"), [entries]);

  const recent = entries.slice(0, 10);
  const [selectedRecentId, setSelectedRecentId] = useState<string | null>(null);

  return (
    <div className="space-y-6 pb-12">
      <Header refreshing={status.isFetching} onRefresh={() => status.refetch()} />

      {/* Mobile-first scan CTA */}
      <div className="md:hidden">
        <MobileReceiptScanButton />
      </div>


      {status.error && (
        <Card className="border-destructive/40">
          <CardContent className="flex items-start gap-2 p-4 text-sm">
            <AlertCircle className="mt-0.5 h-4 w-4 text-destructive" />
            <div>
              <div className="font-medium">Kunne ikke hente data fra Finance Core</div>
              <div className="text-muted-foreground">{(status.error as Error).message}</div>
            </div>
          </CardContent>
        </Card>
      )}

      <KpiRow
        income={totals?.income ?? summary?.income ?? 0}
        expense={totals?.expense ?? summary?.expense ?? 0}
        result={totals?.result ?? summary?.result ?? 0}
        unpaidCount={totals?.unpaidCount ?? 0}
        missingAttachmentCount={totals?.missingAttachmentCount ?? 0}
      />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="overview">Oversikt</TabsTrigger>
          <TabsTrigger value="expenses">Utgifter</TabsTrigger>
          <TabsTrigger value="income">Inntekter</TabsTrigger>
          <TabsTrigger value="reports">Rapporter</TabsTrigger>
          <TabsTrigger value="ai">AI-skanning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Siste 10 poster</CardTitle>
              <span className="text-xs text-muted-foreground">Klikk en post for detaljer</span>
            </CardHeader>
            <CardContent className="p-0">
              {status.isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Laster…</div>
              ) : recent.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">Ingen poster ennå.</div>
              ) : (
                <div className="divide-y divide-border">
                  {recent.map((e) => (
                    <div key={e.id}>
                      <EntryRow
                        entry={e}
                        selected={selectedRecentId === e.id}
                        onToggle={() => setSelectedRecentId((c) => (c === e.id ? null : e.id))}
                      />
                      {selectedRecentId === e.id && (
                        <div className="bg-muted/30 p-4">
                          <EntryDetailPanel entry={e} onClose={() => setSelectedRecentId(null)} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-3">
          {expenseGroups.map((g) => (
            <CategoryGroup key={g.category} group={g} type="expense" />
          ))}
        </TabsContent>

        <TabsContent value="income" className="space-y-3">
          {incomeGroups.map((g) => (
            <CategoryGroup key={g.category} group={g} type="income" />
          ))}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Måned for måned ({year})</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <ReportsMonths rows={months} />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Utgifter per kategori</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <ReportsCategories rows={expenseShares} emptyText="Ingen utgifter ennå." />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inntekter per kategori</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto p-0">
                <ReportsCategories rows={incomeShares} emptyText="Ingen inntekter ennå." />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">AI-skanning av kvitteringer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Last opp en kvittering eller faktura. AI-en foreslår felter automatisk —
                du godkjenner før posten bokføres i Finance Core.
              </p>
              <MobileReceiptScanButton />

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Header({ refreshing, onRefresh }: { refreshing: boolean; onRefresh: () => void }) {
  const testMut = useSendTestIncome();
  async function handleTest() {
    try {
      const r = await testMut.mutateAsync();
      toast.success(r.alreadyExists ? "Allerede bokført (idempotens OK)" : "Testinntekt sendt");
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="mb-1">
          <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Tilbake til admin
          </Link>
        </div>
        <h1 className="font-display text-3xl tracking-tight">Regnskap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Arbeidsflate for økonomien. Data lagres i Finance Core.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <ManualEntryDialog type="income" />
        <ManualEntryDialog type="expense" />
        <KlinkSettlementDialog />
        <PopupInvoiceDialog />
        <AttachmentDialog />
        <MobileReceiptScanButton variant="compact" />
        <Button variant="outline" size="sm" onClick={handleTest} disabled={testMut.isPending}>
          <Send className="h-4 w-4" /> Test
        </Button>
        <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Oppdater
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a href={financeCoreOrgUrl()} target="_blank" rel="noreferrer">
            <ExternalLink className="h-4 w-4" /> Åpne i Finance Core
          </a>
        </Button>
      </div>
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
      toast.success(`${type === "income" ? "Inntekt" : "Utgift"} opprettet`);
      setOpen(false);
      setForm({ ...form, description: "", amount_gross: 0, counterparty: "", notes: "" });
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4" /> {type === "income" ? "Inntekt" : "Utgift"}
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
          <Button onClick={submit} disabled={mut.isPending}>Opprett</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Klink settlement ─────────────────────────────────────── */
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

  const { data: popupInvoices } = useQuery({
    queryKey: ["popup-fc-invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("popup_fc_invoices")
        .select("reference_key, finance_core_invoice_id, invoice_number, status")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const hasActivePopupInvoice = !!popupInvoices?.some(
    (i) => i.status === "sent" || i.status === "paid" || i.status === "draft",
  );
  const hasBookedPopupInvoice = !!popupInvoices?.some(
    (i) => i.status === "sent" || i.status === "paid",
  );

  async function submit() {
    if (!form.eventSlug || !form.eventName || !form.totalRevenueNok) {
      toast.error("Slug, eventnavn og omsetning er påkrevd");
      return;
    }
    try {
      const r = await mut.mutateAsync({ ...form, reportUrl: form.reportUrl?.trim() ? form.reportUrl : undefined });
      toast.success(r.alreadyExists ? "Allerede bokført (idempotens OK)" : `Oppgjør sendt (${formatNok(ourShare)})`);
      setOpen(false);
    } catch (e: any) {
      toast.error(`Feil: ${e?.message ?? e}`);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Receipt className="h-4 w-4" /> Klink-oppgjør
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Klink popup-oppgjør</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {hasActivePopupInvoice && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Faktura finnes – regnskap føres via Finance Core-faktura. Ikke bruk Klink-oppgjør
                i tillegg med mindre du vet at inntekten ikke er bokført dobbelt.
              </AlertDescription>
            </Alert>
          )}
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
            <Label>Rapport-URL (valgfri)</Label>
            <Input value={form.reportUrl ?? ""} onChange={(e) => setForm({ ...form, reportUrl: e.target.value })} placeholder="https://goldofsicily.no/..." />
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            Vår andel: <strong>{formatNok(ourShare)}</strong>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Avbryt</Button>
          <Button
            onClick={submit}
            disabled={mut.isPending || hasBookedPopupInvoice}
            variant={hasBookedPopupInvoice ? "outline" : "default"}
          >
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ── Standalone attachment upload ─────────────────────────── */
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
      toast.success("Bilag lastet opp");
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
        <Button variant="outline" size="sm">
          <Upload className="h-4 w-4" /> Bilag
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Last opp bilag</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Fil</Label>
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
