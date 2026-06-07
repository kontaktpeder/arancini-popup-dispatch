CREATE TABLE public.finance_receipt_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.finance_books(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL,
  file_url text,
  file_path text,
  file_name text,
  mime_type text,
  extracted_text text,
  ai_suggestion jsonb,
  status text NOT NULL DEFAULT 'draft',
  converted_entry_id uuid REFERENCES public.finance_entries(id) ON DELETE SET NULL,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_receipt_drafts TO authenticated;
GRANT ALL ON public.finance_receipt_drafts TO service_role;

ALTER TABLE public.finance_receipt_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read drafts" ON public.finance_receipt_drafts
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert drafts" ON public.finance_receipt_drafts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Authenticated update drafts" ON public.finance_receipt_drafts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete drafts" ON public.finance_receipt_drafts
  FOR DELETE TO authenticated USING (true);

CREATE TRIGGER finance_receipt_drafts_set_updated_at
  BEFORE UPDATE ON public.finance_receipt_drafts
  FOR EACH ROW EXECUTE FUNCTION public.finance_set_updated_at();

CREATE INDEX idx_finance_receipt_drafts_book_status
  ON public.finance_receipt_drafts(book_id, status);