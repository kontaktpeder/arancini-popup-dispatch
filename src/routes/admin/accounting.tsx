import { Fragment, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, Plus, Trash2, Upload, Paperclip, Download, Info, Languages,
  ChevronRight, FolderOpen, AlertCircle, Receipt,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

/* ── Group by category ─────────────────────────────────────────── */
interface CategoryGroup {
  category: string;
  items: FinanceEntry[];
  total: number;
}

function buildCategoryGroups(
  entries: FinanceEntry[],
  entryType: FinanceEntryType,
  preFilter: "all" | "pre" | "ordinary",
  uncategorized: string,
): CategoryGroup[] {
  const filtered = entries.filter((e) => {
    if (e.entry_type !== entryType) return false;
    if (preFilter === "pre") return e.pre_company_expense;
    if (preFilter === "ordinary") return !e.pre_company_expense;
    return true;
  });
  const map = new Map<string, CategoryGroup>();
  filtered.forEach((e) => {
    const key = (e.category && e.category.trim()) || uncategorized;
    if (!map.has(key)) map.set(key, { category: key, items: [], total: 0 });
    const g = map.get(key)!;
    g.items.push(e);
    g.total += e.net_amount;
  });
  return Array.from(map.values()).sort((a, b) =>
    a.category.localeCompare(b.category, "nb"),
  );
}

function AccountingPage() {
  const { t } = useAccountingT();
  const { data: user } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  const { data: books, isLoading: booksLoading } = useFinanceBooks("org");
  const createBook = useCreateFinanceBook();

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
    return <div className="text-sm text-muted-foreground">{t.creatingDefault}</div>;
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

  const [preFilter, setPreFilter] = useState<"all" | "pre" | "ordinary">("all");
  const [actionFilter, setActionFilter] = useState<
    "all" | "unpaid" | "pending_invoice" | "missing_attachment"
  >("all");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // KPIs from all entries (unfiltered)
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
    return { income, expense, result: income - expense, unpaid, pendingInvoice, missingAttachment };
  }, [entries]);

  const actionCounts = useMemo(() => {
    const active = entries.filter((e) => e.payment_status !== "cancelled");
    return {
      unpaid: active.filter((e) => e.payment_status === "unpaid").length,
      pendingInvoice: active.filter((e) => e.invoice_status === "pending").length,
      missingAttachment: active.filter((e) => !e.attachment_url).length,
    };
  }, [entries]);

  // Apply action filter on top of pre filter (groups still rely on pre)
  const filteredEntries = useMemo(() => {
    if (actionFilter === "all") return entries;
    if (actionFilter === "unpaid")
      return entries.filter((e) => e.payment_status === "unpaid");
    if (actionFilter === "pending_invoice")
      return entries.filter((e) => e.invoice_status === "pending");
    return entries.filter((e) => !e.attachment_url);
  }, [entries, actionFilter]);

  const expenseGroups = useMemo(
    () => buildCategoryGroups(filteredEntries, "expense", preFilter, t.uncategorized),
    [filteredEntries, preFilter, t.uncategorized],
  );
  const incomeGroups = useMemo(
    () => buildCategoryGroups(filteredEntries, "income", preFilter, t.uncategorized),
    [filteredEntries, preFilter, t.uncategorized],
  );

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

  const updateEntry = (entry: FinanceEntry, patch: Partial<FinanceEntry>) => {
    const fn = entry.entry_type === "expense" ? upsertExpense : upsertIncome;
    fn.mutate({ id: entry.id, ...patch });
  };

  const handleUpload = async (entry: FinanceEntry, file: File) => {
    try {
      const res = await uploadAttachment(file, "org", null, entry.voucher_number);
      updateEntry(entry, {
        attachment_url: res.url,
        attachment_name: res.name,
      });
      toast.success(t.attachmentUploaded);
    } catch (e: any) {
      toast.error(e?.message || t.uploadFailed);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <datalist id="finance-category-suggestions">
        <option value="Råvarer" />
        <option value="Emballasje" />
        <option value="Utstyr" />
        <option value="Transport" />
        <option value="Programvare" />
        <option value="Markedsføring" />
        <option value="Oppstartskostnad" />
        <option value="Privat utlegg før stiftelse" />
        <option value="Popup-salg" />
        <option value="Catering" />
        <option value="Event" />
        <option value="Investering" />
        <option value="Egenkapital" />
      </datalist>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> {t.back}
          </Link>
          <h1 className="font-display text-3xl tracking-tight mt-1">{t.title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{bookName}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
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

      {/* KPIs — one row on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <Kpi label={t.kpi.income} value={formatNok(kpis.income)} variant="positive" />
        <Kpi label={t.kpi.expense} value={formatNok(kpis.expense)} variant="negative" />
        <Kpi
          label={t.kpi.result}
          value={formatNok(kpis.result)}
          variant={kpis.result >= 0 ? "positive" : "negative"}
        />
        <Kpi label={t.kpi.unpaid} value={formatNok(kpis.unpaid)} />
        <Kpi label={t.kpi.pendingInvoice} value={formatNok(kpis.pendingInvoice)} />
        <Kpi label={t.kpi.missingAttachment} value={formatNok(kpis.missingAttachment)} />
      </div>

      {/* Action chips */}
      {(actionCounts.unpaid > 0 ||
        actionCounts.pendingInvoice > 0 ||
        actionCounts.missingAttachment > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <ActionChip
            active={actionFilter === "unpaid"}
            onClick={() =>
              setActionFilter(actionFilter === "unpaid" ? "all" : "unpaid")
            }
            icon={<AlertCircle className="h-3 w-3" />}
            label={`${actionCounts.unpaid} ${t.chip.unpaid}`}
          />
          <ActionChip
            active={actionFilter === "pending_invoice"}
            onClick={() =>
              setActionFilter(
                actionFilter === "pending_invoice" ? "all" : "pending_invoice",
              )
            }
            icon={<Receipt className="h-3 w-3" />}
            label={`${actionCounts.pendingInvoice} ${t.chip.pendingInvoice}`}
          />
          <ActionChip
            active={actionFilter === "missing_attachment"}
            onClick={() =>
              setActionFilter(
                actionFilter === "missing_attachment" ? "all" : "missing_attachment",
              )
            }
            icon={<Paperclip className="h-3 w-3" />}
            label={`${actionCounts.missingAttachment} ${t.chip.missingAttachment}`}
          />
          {actionFilter !== "all" && (
            <button
              onClick={() => setActionFilter("all")}
              className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
            >
              {t.showAll}
            </button>
          )}
        </div>
      )}

      {/* Pre-incorporation filter + help */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium">{t.show}</span>
          <Select value={preFilter} onValueChange={(v) => setPreFilter(v as typeof preFilter)}>
            <SelectTrigger className="h-8 w-[240px] text-xs"><SelectValue /></SelectTrigger>
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
      <SectionCard
        title={t.expenses}
        action={
          <Button size="sm" variant="outline" onClick={() => handleAdd("expense")}>
            <Plus className="h-4 w-4 mr-1" /> {t.newExpense}
          </Button>
        }
      >
        {expenseGroups.length === 0 ? (
          <EmptyRow>{t.noRows}</EmptyRow>
        ) : (
          <div className="space-y-1">
            {expenseGroups.map((g) => (
              <CategoryAccordion
                key={`expense-${g.category}`}
                group={g}
                isOpen={openCategory === `expense-${g.category}`}
                onToggle={() =>
                  setOpenCategory(
                    openCategory === `expense-${g.category}` ? null : `expense-${g.category}`,
                  )
                }
                entryType="expense"
                expandedRow={expandedRow}
                onExpandRow={setExpandedRow}
                onChange={updateEntry}
                onDelete={(id) => del.mutate(id)}
                onUpload={handleUpload}
                isUploading={isUploading}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Incomes */}
      <SectionCard
        title={t.incomes}
        action={
          <Button size="sm" variant="outline" onClick={() => handleAdd("income")}>
            <Plus className="h-4 w-4 mr-1" /> {t.newIncome}
          </Button>
        }
      >
        {incomeGroups.length === 0 ? (
          <EmptyRow>{t.noRows}</EmptyRow>
        ) : (
          <div className="space-y-1">
            {incomeGroups.map((g) => (
              <CategoryAccordion
                key={`income-${g.category}`}
                group={g}
                isOpen={openCategory === `income-${g.category}`}
                onToggle={() =>
                  setOpenCategory(
                    openCategory === `income-${g.category}` ? null : `income-${g.category}`,
                  )
                }
                entryType="income"
                expandedRow={expandedRow}
                onExpandRow={setExpandedRow}
                onChange={updateEntry}
                onDelete={(id) => del.mutate(id)}
                onUpload={handleUpload}
                isUploading={isUploading}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {/* Totals footer */}
      <Card className="sticky bottom-2 shadow-md border-border/60 bg-card/95 backdrop-blur">
        <CardContent className="p-4 grid grid-cols-3 gap-4 text-sm">
          <TotalLine label={t.totalIncome} value={formatNok(kpis.income)} accent="positive" />
          <TotalLine label={t.totalExpense} value={formatNok(kpis.expense)} accent="negative" />
          <TotalLine
            label={t.kpi.result}
            value={formatNok(kpis.result)}
            accent={kpis.result >= 0 ? "positive" : "negative"}
            bold
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Presentational helpers ─────────────────────────────────── */

function Kpi({
  label, value, variant = "neutral",
}: {
  label: string;
  value: string;
  variant?: "neutral" | "positive" | "negative";
}) {
  const color =
    variant === "positive" ? "text-emerald-600"
    : variant === "negative" ? "text-destructive"
    : "text-foreground";
  return (
    <div className="rounded-lg border border-border/60 bg-card p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-base lg:text-lg tabular-nums ${color}`}>{value}</div>
    </div>
  );
}

function ActionChip({
  active, onClick, icon, label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card border-border text-foreground hover:bg-muted"
      }`}
    >
      {icon} {label}
    </button>
  );
}

function SectionCard({
  title, action, children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm border-border/60">
      <CardHeader className="pb-3 pt-4 px-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base md:text-lg">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="px-2 md:px-3 pb-3">{children}</CardContent>
    </Card>
  );
}

function EmptyRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-sm text-muted-foreground py-6">{children}</div>
  );
}

function TotalLine({
  label, value, accent = "neutral", bold,
}: {
  label: string;
  value: string;
  accent?: "neutral" | "positive" | "negative";
  bold?: boolean;
}) {
  const color =
    accent === "positive" ? "text-emerald-600"
    : accent === "negative" ? "text-destructive"
    : "text-foreground";
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={`tabular-nums ${color} ${bold ? "font-display text-xl" : "font-semibold text-base"}`}>
        {value}
      </span>
    </div>
  );
}

/* ── Category accordion ─────────────────────────────────────── */

function CategoryAccordion({
  group, isOpen, onToggle, entryType,
  expandedRow, onExpandRow,
  onChange, onDelete, onUpload, isUploading,
}: {
  group: CategoryGroup;
  isOpen: boolean;
  onToggle: () => void;
  entryType: FinanceEntryType;
  expandedRow: string | null;
  onExpandRow: (id: string | null) => void;
  onChange: (entry: FinanceEntry, patch: Partial<FinanceEntry>) => void;
  onDelete: (id: string) => void;
  onUpload: (entry: FinanceEntry, file: File) => void;
  isUploading: boolean;
}) {
  const { t } = useAccountingT();
  const count = group.items.length;
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-2 min-w-0">
            <ChevronRight
              className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${
                isOpen ? "rotate-90" : ""
              }`}
            />
            <FolderOpen className="h-4 w-4 text-muted-foreground/70 shrink-0" />
            <span className="text-sm font-semibold truncate">{group.category}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {count} {count === 1 ? t.entriesSingular : t.entries}
            </span>
          </div>
          <span className="text-sm font-semibold tabular-nums shrink-0 pl-2">
            {formatNok(group.total)}
          </span>
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pl-2 pr-1 pb-2">
          <CategoryTable
            entries={group.items}
            entryType={entryType}
            expandedRow={expandedRow}
            onExpandRow={onExpandRow}
            onChange={onChange}
            onDelete={onDelete}
            onUpload={onUpload}
            isUploading={isUploading}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

/* ── Clean table + detail panel ─────────────────────────────── */

function CategoryTable({
  entries, entryType, expandedRow, onExpandRow,
  onChange, onDelete, onUpload, isUploading,
}: {
  entries: FinanceEntry[];
  entryType: FinanceEntryType;
  expandedRow: string | null;
  onExpandRow: (id: string | null) => void;
  onChange: (entry: FinanceEntry, patch: Partial<FinanceEntry>) => void;
  onDelete: (id: string) => void;
  onUpload: (entry: FinanceEntry, file: File) => void;
  isUploading: boolean;
}) {
  const { t } = useAccountingT();
  const showVoucher = entryType === "expense";
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            {showVoucher && <th className="w-[80px] py-2 px-2 font-medium">{t.col.voucher}</th>}
            <th className="w-[100px] py-2 px-2 font-medium">{t.col.date}</th>
            <th className="py-2 px-2 font-medium">{t.col.counterparty}</th>
            <th className="py-2 px-2 font-medium">{t.col.description}</th>
            <th className="w-[110px] py-2 px-2 font-medium text-right">{t.col.amount}</th>
            <th className="w-[90px] py-2 px-2 font-medium">{t.col.paid}</th>
            <th className="w-[90px] py-2 px-2 font-medium">{t.col.invoice}</th>
            <th className="w-[28px] py-2 px-0" />
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const isExpanded = expandedRow === e.id;
            return (
              <Fragment key={e.id}>
                <tr
                  className="group border-b border-border/30 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => onExpandRow(isExpanded ? null : e.id)}
                >
                  {showVoucher && (
                    <td className="py-2 px-2 text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                      {e.voucher_number ?? "—"}
                    </td>
                  )}
                  <td className="py-2 px-2 text-xs tabular-nums whitespace-nowrap">
                    {formatDate(e.date_incurred)}
                  </td>
                  <td className="py-2 px-2 truncate" title={e.counterparty || undefined}>
                    <span className="text-xs font-medium">
                      {e.counterparty || (
                        <span className="text-muted-foreground/50 italic">—</span>
                      )}
                    </span>
                  </td>
                  <td
                    className="py-2 px-2 truncate text-xs text-muted-foreground"
                    title={e.description || undefined}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{e.description || "—"}</span>
                      {e.pre_company_expense && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1 font-normal shrink-0">
                          {t.badgePre}
                        </Badge>
                      )}
                      {e.attachment_url && (
                        <Paperclip className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-2 text-right text-xs tabular-nums font-medium whitespace-nowrap">
                    {formatNok(e.net_amount)}
                  </td>
                  <td className="py-2 px-2">
                    <PaymentBadge status={e.payment_status} />
                  </td>
                  <td className="py-2 px-2">
                    <InvoiceBadge status={e.invoice_status} />
                  </td>
                  <td className="py-2 px-0 text-right">
                    <ChevronRight
                      className={`h-3.5 w-3.5 text-muted-foreground/50 transition-transform inline-block ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="bg-muted/20">
                    <td colSpan={showVoucher ? 8 : 7} className="px-3 py-4">
                      <DetailPanel
                        entry={e}
                        onChange={(patch) => onChange(e, patch)}
                        onDelete={() => onDelete(e.id)}
                        onUpload={(file) => onUpload(e, file)}
                        isUploading={isUploading}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y.slice(2)}`;
}

function PaymentBadge({ status }: { status: FinancePaymentStatus }) {
  const { t } = useAccountingT();
  const cls =
    status === "paid"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : status === "partial"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
    : status === "cancelled"
      ? "bg-muted text-muted-foreground line-through"
      : "text-muted-foreground";
  const label =
    status === "paid" ? t.payment.paid
    : status === "partial" ? t.payment.partial
    : status === "cancelled" ? t.payment.cancelled
    : t.payment.unpaid;
  return (
    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
}

function InvoiceBadge({ status }: { status: FinanceInvoiceStatus }) {
  const { t } = useAccountingT();
  const cls =
    status === "received"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
    : status === "not_required"
      ? "bg-muted text-muted-foreground"
      : "text-amber-600 dark:text-amber-400";
  const label =
    status === "received" ? t.invoice.received
    : status === "not_required" ? t.invoice.not_required
    : t.invoice.pending;
  return (
    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${cls}`}>
      {label}
    </span>
  );
}

/* ── Detail panel under expanded row ───────────────────────── */

function DetailPanel({
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      {/* Left: identity */}
      <div className="space-y-3">
        <Field label={t.col.counterparty}>
          <Input
            className="h-8 text-xs"
            placeholder={t.placeholder.counterparty}
            defaultValue={entry.counterparty ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (entry.counterparty ?? ""))
                onChange({ counterparty: v || null });
            }}
          />
        </Field>
        <Field label={t.col.description}>
          <Input
            className="h-8 text-xs"
            placeholder={t.placeholder.description}
            defaultValue={entry.description}
            onBlur={(e) => {
              if (e.target.value !== entry.description)
                onChange({ description: e.target.value });
            }}
          />
        </Field>
        <Field label={t.col.category}>
          <Input
            className="h-8 text-xs"
            placeholder={t.placeholder.category}
            list="finance-category-suggestions"
            defaultValue={entry.category ?? ""}
            onBlur={(e) => {
              const v = e.target.value.trim();
              if (v !== (entry.category ?? ""))
                onChange({ category: v || null });
            }}
          />
        </Field>
        <Field label={t.col.date}>
          <Input
            type="date"
            className="h-8 text-xs"
            value={entry.date_incurred}
            onChange={(e) => onChange({ date_incurred: e.target.value })}
          />
        </Field>
      </div>

      {/* Middle: attachment + notes */}
      <div className="space-y-3">
        <Field label={t.col.attachment}>
          {entry.attachment_url ? (
            <div className="flex items-center gap-2">
              <a
                href={entry.attachment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline truncate"
                title={entry.attachment_name ?? ""}
              >
                <Paperclip className="h-3 w-3 shrink-0" />
                <span className="truncate">{entry.attachment_name ?? t.view}</span>
              </a>
              <label className="ml-auto inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer">
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
            </div>
          ) : (
            <label className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground cursor-pointer rounded border border-dashed border-border/60 px-2 py-1.5 w-full justify-center">
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
        </Field>
        <Field label={t.notes}>
          <Textarea
            className="min-h-[80px] text-xs"
            placeholder={t.notes}
            defaultValue={entry.notes ?? ""}
            onBlur={(e) => {
              const v = e.target.value;
              if (v !== (entry.notes ?? ""))
                onChange({ notes: v || null });
            }}
          />
        </Field>
      </div>

      {/* Right: amount + statuses */}
      <div className="space-y-3">
        <Field label={t.col.amount}>
          <Input
            className="h-8 text-xs text-right tabular-nums"
            inputMode="decimal"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            onBlur={() => {
              const ore = parseKrToOre(amountInput);
              if (ore !== entry.net_amount)
                onChange({ net_amount: ore, gross_amount: ore });
            }}
          />
        </Field>
        <Field label={t.col.paid}>
          <Select
            value={entry.payment_status}
            onValueChange={(v) =>
              onChange({ payment_status: v as FinancePaymentStatus })
            }
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="unpaid">{t.payment.unpaid}</SelectItem>
              <SelectItem value="paid">{t.payment.paid}</SelectItem>
              <SelectItem value="partial">{t.payment.partial}</SelectItem>
              <SelectItem value="cancelled">{t.payment.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t.col.invoice}>
          <Select
            value={entry.invoice_status}
            onValueChange={(v) =>
              onChange({ invoice_status: v as FinanceInvoiceStatus })
            }
          >
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">{t.invoice.pending}</SelectItem>
              <SelectItem value="received">{t.invoice.received}</SelectItem>
              <SelectItem value="not_required">{t.invoice.not_required}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label={t.badgePre}>
          <div className="flex items-center justify-between gap-2 rounded border border-border/60 px-2 py-1.5">
            <span className="text-[11px] text-muted-foreground">
              {entry.pre_company_expense ? t.review.yes : t.review.no}
            </span>
            <Switch
              checked={entry.pre_company_expense}
              onCheckedChange={(v) => onChange({ pre_company_expense: v })}
              aria-label={t.aria.pre}
            />
          </div>
        </Field>
        <div className="flex justify-end pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-muted-foreground hover:text-destructive"
            onClick={() => {
              if (confirm(t.deleteRow)) onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" /> {t.deleteRow.replace("?", "")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}
