CREATE TABLE public.popup_fc_invoices (
  reference_key text PRIMARY KEY,
  finance_core_invoice_id uuid NOT NULL,
  invoice_number text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_popup_fc_invoices_fc_id ON public.popup_fc_invoices (finance_core_invoice_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.popup_fc_invoices TO authenticated;
GRANT ALL ON public.popup_fc_invoices TO service_role;

ALTER TABLE public.popup_fc_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated manage popup_fc_invoices"
  ON public.popup_fc_invoices FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.touch_popup_fc_invoices_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_popup_fc_invoices_touch
  BEFORE UPDATE ON public.popup_fc_invoices
  FOR EACH ROW EXECUTE FUNCTION public.touch_popup_fc_invoices_updated_at();