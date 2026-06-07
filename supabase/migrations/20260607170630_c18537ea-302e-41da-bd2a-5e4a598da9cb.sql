ALTER TABLE public.finance_entries
  ADD COLUMN pre_company_expense boolean NOT NULL DEFAULT false;
CREATE INDEX finance_entries_pre_company_idx
  ON public.finance_entries(book_id) WHERE pre_company_expense = true;