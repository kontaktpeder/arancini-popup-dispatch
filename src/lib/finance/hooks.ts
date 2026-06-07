import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type {
  FinanceBook,
  FinanceEntry,
  FinanceEntryType,
  FinanceEntryStatus,
  FinanceInvoiceStatus,
} from "./types";

const BOOKS = "finance_books";
const ENTRIES = "finance_entries";

export function useFinanceBooks(ownerType: "org" = "org") {
  return useQuery({
    queryKey: ["finance-books", ownerType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(BOOKS as any)
        .select("*")
        .eq("owner_type", ownerType)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as FinanceBook[];
    },
  });
}

export function useFinanceEntries(bookId?: string) {
  return useQuery({
    queryKey: ["finance-entries", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(ENTRIES as any)
        .select("*")
        .eq("book_id", bookId!)
        .order("date_incurred", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as unknown as FinanceEntry[];
    },
    enabled: !!bookId,
  });
}

export function useCreateFinanceBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name: string;
      type?: "budget" | "actual";
      created_by: string;
      owner_type?: "org";
    }) => {
      const { data, error } = await supabase
        .from(BOOKS as any)
        .insert({
          owner_type: payload.owner_type ?? "org",
          owner_id: null,
          name: payload.name,
          type: payload.type ?? "actual",
          created_by: payload.created_by,
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as FinanceBook;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-books"] });
    },
  });
}

function buildEntryInsert(
  bookId: string,
  entryType: FinanceEntryType,
  payload: Partial<FinanceEntry> & { created_by: string },
) {
  return {
    book_id: bookId,
    entry_type: entryType,
    source_type: payload.source_type ?? "manual",
    created_by: payload.created_by,
    description: payload.description ?? "",
    gross_amount: payload.gross_amount ?? 0,
    net_amount: payload.net_amount ?? payload.gross_amount ?? 0,
    fee_amount: payload.fee_amount ?? null,
    date_incurred:
      payload.date_incurred ?? new Date().toISOString().slice(0, 10),
    status: (payload.status ?? "confirmed") as FinanceEntryStatus,
    category: payload.category ?? null,
    subcategory: payload.subcategory ?? null,
    counterparty: payload.counterparty ?? null,
    notes: payload.notes ?? null,
    internal_only: payload.internal_only ?? false,
    payment_status: payload.payment_status ?? "unpaid",
    paid_amount: payload.paid_amount ?? null,
    invoice_status: (payload.invoice_status ?? "pending") as FinanceInvoiceStatus,
    attachment_url: payload.attachment_url ?? null,
    attachment_name: payload.attachment_name ?? null,
  };
}

export function useUpsertEntry(
  bookId: string,
  entryType: FinanceEntryType,
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Partial<FinanceEntry> & { id?: string; created_by?: string },
    ) => {
      if (payload.id) {
        const {
          id,
          created_by: _cb,
          created_at: _ca,
          updated_at: _ua,
          voucher_number: _vn,
          ...rest
        } = payload;
        const { data, error } = await supabase
          .from(ENTRIES as any)
          .update({ ...rest, book_id: bookId, entry_type: entryType })
          .eq("id", id)
          .select("*")
          .single();
        if (error) throw error;
        return data as unknown as FinanceEntry;
      }
      const { data, error } = await supabase
        .from(ENTRIES as any)
        .insert(buildEntryInsert(bookId, entryType, { ...payload, created_by: payload.created_by! }))
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as FinanceEntry;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-entries", bookId] });
    },
  });
}

export function useDeleteFinanceEntry(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from(ENTRIES as any)
        .delete()
        .eq("id", entryId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["finance-entries", bookId] });
    },
  });
}
