import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Upload, Paperclip, Download, Info, Languages } from "lucide-react";

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
import {
  AccountingI18nProvider, useAccountingT,
} from "@/lib/finance/i18n";
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
  component: () => (
    <AccountingI18nProvider>
      <AccountingPage />
    </AccountingI18nProvider>
  ),
});

function AccountingPage() {
  const { t } = useAccountingT();
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
    return <div className="text-sm text-muted-foreground">{t.loading}</div>;
  }

  if (!activeBook) {
    return (
      <div className="text-sm text-muted-foreground">
        {t.creatingDefault}
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

function LanguageToggle() {
  const { lang, setLang } = useAccountingT();
  return (
    <div className="inline-flex items-center rounded-md border border-border/60 bg-card p-0.5 text-xs">
      <Languages className="h-3.5 w-3.5 mx-1 text-muted-foreground" />
      <button
        type="button"
        onClick={() => setLang("no")}
        className={`px-2 py-1 rounded ${lang === "no" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        NO
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2 py-1 rounded ${lang === "en" ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        EN
      </button>
    </div>
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
  const { t } = useAccountingT();
  const upsertExpense = useUpsertEntry(bookId, "expense");
  const upsertIncome = useUpsertEntry(bookId, "income");
  const del = useDeleteFinanceEntry(bookId);
  const { uploadAttachment, isUploading } = useFinanceAttachmentUpload();

  const { data: drafts } = useReceiptDrafts(bookId);
  const [reviewDraftId, setReviewDraftId] = useState<string | null>(null);
  const reviewDraft = (drafts || []).find((d) => d.id === reviewDraftId) ?? null;

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
        <option value="Start-up cost" />
        <option value="Private outlay pre-incorporation" />
      </datalist>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/admin" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> {t.back}
          </Link>
          <h1 className="font-display text-3xl tracking-tight mt-1">{t.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
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
          <ReceiptUploadButton
            bookId={bookId}
            userId={userId}
            onUploaded={(id) => setReviewDraftId(id)}
          />
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-1" /> {t.csv}
          </Button>
        </div>
      </div>

      <ReceiptDraftList
        drafts={drafts || []}
        bookId={bookId}
        onReview={(id) => setReviewDraftId(id)}
      />

      <ReceiptReviewDialog
        draft={reviewDraft}
        bookId={bookId}
        userId={userId}
        open={!!reviewDraftId}
        onOpenChange={(v) => { if (!v) setReviewDraftId(null); }}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label={t.kpi.income} value={formatNok(kpis.income)} />
        <Kpi label={t.kpi.expense} value={formatNok(kpis.expense)} />
        <Kpi label={t.kpi.result} value={formatNok(kpis.result)} accent={kpis.result >= 0 ? "pos" : "neg"} />
        <Kpi label={t.kpi.unpaid} value={formatNok(kpis.unpaid)} />
        <Kpi label={t.kpi.pendingInvoice} value={formatNok(kpis.pendingInvoice)} />
        <Kpi label={t.kpi.missingAttachment} value={formatNok(kpis.missingAttachment)} />
      </div>

      {/* Filter + help text */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium">{t.show}</span>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="h-8 w-[220px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.filter.all}</SelectItem>
              <SelectItem value="pre">{t.filter.pre}</SelectItem>
              <SelectItem value="ordinary">{t.filter.ordinary}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>{t.preHelp}</span>
        </p>
      </div>

      {/* Expenses */}
      <Section
        title={t.expenses}
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
              toast.success(t.attachmentUploaded);
            } catch (e: any) { toast.error(e.message || t.uploadFailed); }
          }}
          isUploading={isUploading}
        />
      </Section>

      {/* Incomes */}
      <Section title={t.incomes} onAdd={() => handleAdd("income")}>
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
              toast.success(t.attachmentUploaded);
            } catch (e: any) { toast.error(e.message || t.uploadFailed); }
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
  const { t } = useAccountingT();
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-tight">{title}</h2>
        <Button size="sm" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> {t.newRow}
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
  const { t } = useAccountingT();
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
        {t.noRows}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border/60 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[90px]">{t.col.voucher}</TableHead>
            <TableHead className="w-[120px]">{t.col.date}</TableHead>
            <TableHead>{t.col.description}</TableHead>
            <TableHead className="w-[140px]">{t.col.category}</TableHead>
            <TableHead className="w-[140px]">{t.col.counterparty}</TableHead>
            <TableHead className="w-[120px] text-right">{t.col.amount}</TableHead>
            <TableHead className="w-[120px]">{t.col.paid}</TableHead>
            <TableHead className="w-[120px]">{t.col.invoice}</TableHead>
            <TableHead className="w-[120px]">{t.col.attachment}</TableHead>
            <TableHead className="w-[90px]" title={t.badgePre}>{t.col.pre}</TableHead>
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
  const { t } = useAccountingT();
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
            placeholder={t.placeholder.description}
            defaultValue={entry.description}
            onBlur={(e) => {
              if (e.target.value !== entry.description) onChange({ description: e.target.value });
            }}
          />
          {entry.pre_company_expense && (
            <Badge variant="secondary" className="text-[10px] font-normal h-5 px-1.5">
              {t.badgePre}
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Input
          className="h-8 text-xs"
          placeholder={t.placeholder.category}
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
          placeholder={t.placeholder.counterparty}
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
            <SelectItem value="unpaid">{t.payment.unpaid}</SelectItem>
            <SelectItem value="paid">{t.payment.paid}</SelectItem>
            <SelectItem value="partial">{t.payment.partial}</SelectItem>
            <SelectItem value="cancelled">{t.payment.cancelled}</SelectItem>
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
            <SelectItem value="pending">{t.invoice.pending}</SelectItem>
            <SelectItem value="received">{t.invoice.received}</SelectItem>
            <SelectItem value="not_required">{t.invoice.not_required}</SelectItem>
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
            title={entry.attachment_name ?? t.col.attachment}
          >
            <Paperclip className="h-3 w-3" /> {t.view}
          </a>
        ) : (
          <label className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer">
            <Upload className="h-3 w-3" />
            {isUploading ? t.uploading : t.upload}
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
          aria-label={t.aria.pre}
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => {
            if (confirm(t.deleteRow)) onDelete();
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
