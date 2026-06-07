import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Upload, Paperclip, Download, Info } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

import {
  useFinanceBooks, useFinanceEntries, useCreateFinanceBook,
  useUpsertEntry, useDeleteFinanceEntry,
} from "@/lib/finance/hooks";
import { useFinanceAttachmentUpload } from "@/lib/finance/useFinanceAttachmentUpload";
import { formatNok, parseKrToOre } from "@/lib/finance/format";
import { entriesToCsv, downloadCsv } from "@/lib/finance/csv";
import { useReceiptDrafts } from "@/lib/finance/receipt-drafts.hooks";
import {
  ReceiptUploadButton, ReceiptDraftList, ReceiptReviewDialog,
} from "@/components/accounting/ReceiptReview";
import type {
  FinanceEntry, FinanceEntryType,
  FinancePaymentStatus, FinanceInvoiceStatus,
} from "@/lib/finance/types";

export const Route = createFileRoute("/admin/accounting")({
  head: () => ({
    meta: [
      { title: "Regnskap — Gold of Sicily" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountingPage,
});

function AccountingPage() {
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: books, isLoading: booksLoading } = useFinanceBooks("org");
  const createBook = useCreateFinanceBook();

  // Auto-create default book once on first load.
  useEffect(() => {
    if (booksLoading || !user) return;
    if (books && books.length === 0 && !createBook.isPending) {
      createBook.mutate({
        name: `Regnskap ${new Date().getFullYear()}`,
        created_by: user.id,
      });
    }
  }, [booksLoading, books, user, createBook]);

  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const activeBookId = selectedBookId ?? books?.[0]?.id ?? null;
  const activeBook = books?.find((b) => b.id === activeBookId) ?? null;

  const { data: entries, isLoading: entriesLoading } = useFinanceEntries(
    activeBookId || undefined,
  );

  if (booksLoading || (activeBookId && entriesLoading)) {
    return <div className="text-sm text-muted-foreground">Laster regnskap…</div>;
  }

  if (!activeBook) {
    return (
      <div className="text-sm text-muted-foreground">
        Oppretter standard regnskap…
      </div>
    );
  }

  return (
    <BookView
      bookId={activeBook.id}
      bookName={activeBook.name}
      entries={entries || []}
      userId={user?.id || ""}
      allBooks={books || []}
      onSelectBook={setSelectedBookId}
    />
  );
}

function BookView({
  bookId, bookName, entries, userId, allBooks, onSelectBook,
}: {
  bookId: string;
  bookName: string;
  entries: FinanceEntry[];
  userId: string;
  allBooks: { id: string; name: string }[];
  onSelectBook: (id: string) => void;
}) {
  const upsertExpense = useUpsertEntry(bookId, "expense");
  const upsertIncome = useUpsertEntry(bookId, "income");
  const del = useDeleteFinanceEntry(bookId);
  const { uploadAttachment, isUploading } = useFinanceAttachmentUpload();

  const kpis = useMemo(() => {
    let income = 0, expense = 0;
    const active = entries.filter((e) => e.payment_status !== "cancelled");
    active.forEach((e) => {
      if (e.entry_type === "income") income += e.net_amount;
      else expense += e.net_amount;
    });
    const unpaid = active
      .filter((e) => e.entry_type === "expense" && e.payment_status === "unpaid")
      .reduce((s, e) => s + e.net_amount, 0);
    const pendingInvoice = active
      .filter((e) => e.invoice_status === "pending")
      .reduce((s, e) => s + e.net_amount, 0);
    const missingAttachment = active
      .filter((e) => !e.attachment_url)
      .reduce((s, e) => s + e.net_amount, 0);
    return {
      income, expense, result: income - expense,
      unpaid, pendingInvoice, missingAttachment,
      count: entries.length,
    };
  }, [entries]);

  const [filter, setFilter] = useState<"all" | "pre" | "ordinary">("all");
  const applyFilter = (list: FinanceEntry[]) =>
    filter === "pre" ? list.filter((e) => e.pre_company_expense)
    : filter === "ordinary" ? list.filter((e) => !e.pre_company_expense)
    : list;

  const expenses = applyFilter(entries.filter((e) => e.entry_type === "expense"));
  const incomes = applyFilter(entries.filter((e) => e.entry_type === "income"));

  const handleAdd = (type: FinanceEntryType) => {
    if (!userId) return;
    const today = new Date().toISOString().slice(0, 10);
    const fn = type === "expense" ? upsertExpense : upsertIncome;
    fn.mutate({
      created_by: userId,
      description: "",
      gross_amount: 0,
      net_amount: 0,
      date_incurred: today,
    });
  };

  const handleExport = () => {
    const csv = entriesToCsv(entries);
    downloadCsv(`${bookName.replace(/\s+/g, "_")}.csv`, csv);
  };

  return (
    <div className="space-y-8">
      <datalist id="finance-category-suggestions">
        <option value="Oppstartskostnad" />
        <option value="Privat utlegg før stiftelse" />
      </datalist>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Tilbake
          </Link>
          <h1 className="font-display text-3xl tracking-tight mt-1">Regnskap</h1>
        </div>
        <div className="flex items-center gap-2">
          {allBooks.length > 1 && (
            <Select value={bookId} onValueChange={onSelectBook}>
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {allBooks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label="Inntekter" value={formatNok(kpis.income)} />
        <Kpi label="Utgifter" value={formatNok(kpis.expense)} />
        <Kpi label="Resultat" value={formatNok(kpis.result)} accent={kpis.result >= 0 ? "pos" : "neg"} />
        <Kpi label="Ubetalt" value={formatNok(kpis.unpaid)} />
        <Kpi label="Mangler faktura" value={formatNok(kpis.pendingInvoice)} />
        <Kpi label="Mangler bilag" value={formatNok(kpis.missingAttachment)} />
      </div>

      {/* Filter + help text */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium">Vis:</span>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="h-8 w-[220px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle poster</SelectItem>
              <SelectItem value="pre">Kun før selskapsstiftelse</SelectItem>
              <SelectItem value="ordinary">Kun ordinære poster</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Poster merket «Før selskapsstiftelse» ble registrert før selskapet ble etablert. Registreringen
            brukes for å dokumentere oppstartskostnader og historikk. Om kostnaden senere kan overføres til
            selskapet må vurderes separat.
          </span>
        </p>
      </div>

      {/* Expenses */}
      <Section
        title="Utgifter"
        onAdd={() => handleAdd("expense")}
      >
        <EntryTable
          entries={expenses}
          onChange={(id, patch) => upsertExpense.mutate({ id, ...patch })}
          onDelete={(id) => del.mutate(id)}
          onUpload={async (entry, file) => {
            try {
              const res = await uploadAttachment(file, "org", null, entry.voucher_number);
              upsertExpense.mutate({
                id: entry.id,
                attachment_url: res.url,
                attachment_name: res.name,
              });
              toast.success("Bilag lastet opp");
            } catch (e: any) { toast.error(e.message || "Opplasting feilet"); }
          }}
          isUploading={isUploading}
        />
      </Section>

      {/* Incomes */}
      <Section title="Inntekter" onAdd={() => handleAdd("income")}>
        <EntryTable
          entries={incomes}
          onChange={(id, patch) => upsertIncome.mutate({ id, ...patch })}
          onDelete={(id) => del.mutate(id)}
          onUpload={async (entry, file) => {
            try {
              const res = await uploadAttachment(file, "org", null, entry.voucher_number);
              upsertIncome.mutate({
                id: entry.id,
                attachment_url: res.url,
                attachment_name: res.name,
              });
              toast.success("Bilag lastet opp");
            } catch (e: any) { toast.error(e.message || "Opplasting feilet"); }
          }}
          isUploading={isUploading}
        />
      </Section>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: "pos" | "neg" }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-lg tabular-nums ${accent === "pos" ? "text-emerald-600" : accent === "neg" ? "text-destructive" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function Section({ title, onAdd, children }: { title: string; onAdd: () => void; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-tight">{title}</h2>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Ny rad
        </Button>
      </div>
      {children}
    </section>
  );
}

function EntryTable({
  entries, onChange, onDelete, onUpload, isUploading,
}: {
  entries: FinanceEntry[];
  onChange: (id: string, patch: Partial<FinanceEntry>) => void;
  onDelete: (id: string) => void;
  onUpload: (entry: FinanceEntry, file: File) => void;
  isUploading: boolean;
}) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
        Ingen rader ennå.
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border/60 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90px]">Bilag</TableHead>
            <TableHead className="w-[120px]">Dato</TableHead>
            <TableHead>Beskrivelse</TableHead>
            <TableHead className="w-[140px]">Kategori</TableHead>
            <TableHead className="w-[140px]">Motpart</TableHead>
            <TableHead className="w-[120px] text-right">Beløp (kr)</TableHead>
            <TableHead className="w-[120px]">Betalt</TableHead>
            <TableHead className="w-[120px]">Faktura</TableHead>
            <TableHead className="w-[120px]">Bilag</TableHead>
            <TableHead className="w-[90px]" title="Før selskapsstiftelse">Før stift.</TableHead>
            <TableHead className="w-[40px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((e) => (
            <EntryRow
              key={e.id}
              entry={e}
              onChange={(patch) => onChange(e.id, patch)}
              onDelete={() => onDelete(e.id)}
              onUpload={(file) => onUpload(e, file)}
              isUploading={isUploading}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EntryRow({
  entry, onChange, onDelete, onUpload, isUploading,
}: {
  entry: FinanceEntry;
  onChange: (patch: Partial<FinanceEntry>) => void;
  onDelete: () => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const [amountInput, setAmountInput] = useState(
    String((entry.net_amount ?? 0) / 100),
  );
  useEffect(() => {
    setAmountInput(String((entry.net_amount ?? 0) / 100));
  }, [entry.net_amount]);

  return (
    <TableRow>
      <TableCell className="text-xs text-muted-foreground">
        {entry.voucher_number || "—"}
      </TableCell>
      <TableCell>
        <Input
          type="date"
          className="h-8 text-xs"
          value={entry.date_incurred}
          onChange={(e) => onChange({ date_incurred: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Input
            className="h-8 text-xs"
            placeholder="Beskrivelse"
            defaultValue={entry.description}
            onBlur={(e) => {
              if (e.target.value !== entry.description) onChange({ description: e.target.value });
            }}
          />
          {entry.pre_company_expense && (
            <Badge variant="secondary" className="text-[10px] font-normal h-5 px-1.5">
              Før selskapsstiftelse
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Input
          className="h-8 text-xs"
          placeholder="Kategori"
          list="finance-category-suggestions"
          defaultValue={entry.category ?? ""}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v !== (entry.category ?? "")) onChange({ category: v || null });
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          className="h-8 text-xs"
          placeholder="Leverandør / kunde"
          defaultValue={entry.counterparty ?? ""}
          onBlur={(e) => {
            const v = e.target.value.trim();
            if (v !== (entry.counterparty ?? "")) onChange({ counterparty: v || null });
          }}
        />
      </TableCell>
      <TableCell>
        <Input
          className="h-8 text-xs text-right tabular-nums"
          inputMode="decimal"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
          onBlur={() => {
            const ore = parseKrToOre(amountInput);
            if (ore !== entry.net_amount) {
              onChange({ net_amount: ore, gross_amount: ore });
            }
          }}
        />
      </TableCell>
      <TableCell>
        <Select
          value={entry.payment_status}
          onValueChange={(v) => onChange({ payment_status: v as FinancePaymentStatus })}
        >
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="unpaid">Ubetalt</SelectItem>
            <SelectItem value="paid">Betalt</SelectItem>
            <SelectItem value="partial">Delvis</SelectItem>
            <SelectItem value="cancelled">Kansellert</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Select
          value={entry.invoice_status}
          onValueChange={(v) => onChange({ invoice_status: v as FinanceInvoiceStatus })}
        >
          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Mangler</SelectItem>
            <SelectItem value="received">Mottatt</SelectItem>
            <SelectItem value="not_required">Ikke nødvendig</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        {entry.attachment_url ? (
          <a
            href={entry.attachment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            title={entry.attachment_name ?? "Bilag"}
          >
            <Paperclip className="h-3 w-3" /> Vis
          </a>
        ) : (
          <label className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload className="h-3 w-3" />
            {isUploading ? "Laster…" : "Last opp"}
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </TableCell>
      <TableCell>
        <Switch
          checked={entry.pre_company_expense}
          onCheckedChange={(v) => onChange({ pre_company_expense: v })}
          aria-label="Før selskapsstiftelse"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (confirm("Slett denne raden?")) onDelete();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
