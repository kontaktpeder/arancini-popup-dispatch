import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReceiptDraft {
  id: string;
  book_id: string;
  uploaded_by: string;
  file_url: string | null;
  file_path: string | null;
  file_name: string | null;
  mime_type: string | null;
  extracted_text: string | null;
  ai_suggestion: AiSuggestion | null;
  status: "draft" | "reviewed" | "converted" | "rejected";
  converted_entry_id: string | null;
  error: string | null;
  created_at: string;
  updated_at: string;
}

export interface AiSuggestion {
  entry_type?: "expense" | "income";
  date_incurred?: string;
  counterparty?: string;
  description?: string;
  category?: string;
  gross_amount?: number;
  vat_rate?: number | null;
  vat_amount?: number | null;
  payment_status?: "paid" | "unpaid" | "partial";
  invoice_status?: "received" | "pending" | "not_required";
  pre_company_expense?: boolean;
  confidence?: Record<string, number>;
  field_notes?: Record<string, string>;
}

const TABLE = "finance_receipt_drafts";

export function useReceiptDrafts(bookId?: string) {
  return useQuery({
    queryKey: ["receipt-drafts", bookId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(TABLE as any)
        .select("*")
        .eq("book_id", bookId!)
        .neq("status", "converted")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as ReceiptDraft[];
    },
    enabled: !!bookId,
  });
}

export function useCreateReceiptDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      book_id: string;
      uploaded_by: string;
      file_url: string;
      file_path: string;
      file_name: string;
      mime_type: string;
    }) => {
      const { data, error } = await supabase
        .from(TABLE as any)
        .insert(payload)
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as ReceiptDraft;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["receipt-drafts", vars.book_id] });
    },
  });
}

export function useUpdateReceiptDraft(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: string } & Partial<ReceiptDraft>) => {
      const { id, ...rest } = payload;
      const { data, error } = await supabase
        .from(TABLE as any)
        .update(rest)
        .eq("id", id)
        .select("*")
        .single();
      if (error) throw error;
      return data as unknown as ReceiptDraft;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipt-drafts", bookId] });
    },
  });
}

export function useDeleteReceiptDraft(bookId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(TABLE as any)
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipt-drafts", bookId] });
    },
  });
}
