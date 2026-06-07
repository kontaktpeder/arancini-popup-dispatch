
-- Finance module phase 1
CREATE TABLE public.finance_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_type text NOT NULL DEFAULT 'org' CHECK (owner_type IN ('org')),
  owner_id uuid NULL,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'actual' CHECK (type IN ('budget','actual')),
  currency text NOT NULL DEFAULT 'NOK',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('draft','active','closed')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_books TO authenticated;
GRANT ALL ON public.finance_books TO service_role;
ALTER TABLE public.finance_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read books" ON public.finance_books
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert books" ON public.finance_books
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated update books" ON public.finance_books
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete books" ON public.finance_books
  FOR DELETE TO authenticated USING (true);

CREATE TABLE public.finance_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.finance_books(id) ON DELETE CASCADE,
  entry_type text NOT NULL CHECK (entry_type IN ('income','expense')),
  source_type text NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual','adjustment')),
  category text NULL,
  subcategory text NULL,
  description text NOT NULL DEFAULT '',
  counterparty text NULL,
  quantity numeric NULL,
  unit_amount bigint NULL,
  gross_amount bigint NOT NULL DEFAULT 0,
  fee_amount bigint NULL,
  net_amount bigint NOT NULL DEFAULT 0,
  vat_rate numeric NULL,
  vat_amount bigint NULL,
  date_incurred date NOT NULL DEFAULT CURRENT_DATE,
  date_paid date NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('planned','confirmed','paid','cancelled')),
  sort_order integer NULL,
  notes text NULL,
  voucher_number text NULL,
  attachment_url text NULL,
  attachment_name text NULL,
  internal_only boolean NOT NULL DEFAULT false,
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','partial','cancelled')),
  paid_amount bigint NULL,
  invoice_status text NOT NULL DEFAULT 'pending' CHECK (invoice_status IN ('pending','received','not_required')),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX finance_entries_book_idx ON public.finance_entries(book_id);
CREATE INDEX finance_entries_book_voucher_idx ON public.finance_entries(book_id, voucher_number);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_entries TO authenticated;
GRANT ALL ON public.finance_entries TO service_role;
ALTER TABLE public.finance_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated read entries" ON public.finance_entries
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert entries" ON public.finance_entries
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated update entries" ON public.finance_entries
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated delete entries" ON public.finance_entries
  FOR DELETE TO authenticated USING (true);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.finance_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER finance_books_updated_at BEFORE UPDATE ON public.finance_books
  FOR EACH ROW EXECUTE FUNCTION public.finance_set_updated_at();
CREATE TRIGGER finance_entries_updated_at BEFORE UPDATE ON public.finance_entries
  FOR EACH ROW EXECUTE FUNCTION public.finance_set_updated_at();

-- Voucher number allocator: YYYY-NNNN per book per year, allocated on insert.
CREATE OR REPLACE FUNCTION public.allocate_voucher_number()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
DECLARE
  v_year text;
  v_next int;
BEGIN
  IF NEW.voucher_number IS NOT NULL AND NEW.voucher_number <> '' THEN
    RETURN NEW;
  END IF;
  v_year := to_char(COALESCE(NEW.date_incurred, CURRENT_DATE), 'YYYY');
  SELECT COALESCE(MAX(
    NULLIF(regexp_replace(voucher_number, '^' || v_year || '-', ''), '')::int
  ), 0) + 1
  INTO v_next
  FROM public.finance_entries
  WHERE book_id = NEW.book_id
    AND voucher_number ~ ('^' || v_year || '-\d+$');
  NEW.voucher_number := v_year || '-' || lpad(v_next::text, 4, '0');
  RETURN NEW;
END; $$;

CREATE TRIGGER finance_entries_voucher BEFORE INSERT ON public.finance_entries
  FOR EACH ROW EXECUTE FUNCTION public.allocate_voucher_number();
