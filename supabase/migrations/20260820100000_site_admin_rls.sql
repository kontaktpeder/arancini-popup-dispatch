-- Site admin authorization for sensitive RLS policies.
-- Existing auth.users are bootstrapped as admins so current operators keep access.
-- New signups are NOT admins unless added to site_admins or given app_metadata.role = 'admin'.

CREATE TABLE IF NOT EXISTS public.site_admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_admins TO authenticated;
GRANT ALL ON public.site_admins TO service_role;

ALTER TABLE public.site_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read own admin row" ON public.site_admins;
CREATE POLICY "Admins can read own admin row"
  ON public.site_admins FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

INSERT INTO public.site_admins (user_id)
SELECT id FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.is_site_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
    OR COALESCE((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin', false)
    OR EXISTS (
      SELECT 1 FROM public.site_admins sa WHERE sa.user_id = auth.uid()
    );
$$;

REVOKE ALL ON FUNCTION public.is_site_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_site_admin() TO anon, authenticated, service_role;

-- CMS: restore write policies for admins only (previously dropped entirely)
DROP POLICY IF EXISTS "Authenticated insert cms pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Authenticated update cms pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins insert cms pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Admins update cms pages" ON public.cms_pages;

CREATE POLICY "Admins insert cms pages"
  ON public.cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (public.is_site_admin());

CREATE POLICY "Admins update cms pages"
  ON public.cms_pages FOR UPDATE
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

-- Popup settings
DROP POLICY IF EXISTS "Authenticated can update popup settings" ON public.site_popup_settings;
DROP POLICY IF EXISTS "Admins can update popup settings" ON public.site_popup_settings;
CREATE POLICY "Admins can update popup settings"
  ON public.site_popup_settings FOR UPDATE
  TO authenticated
  USING (public.is_site_admin())
  WITH CHECK (public.is_site_admin());

-- Inquiries
DROP POLICY IF EXISTS "Authenticated can read inquiries" ON public.collaboration_inquiries;
DROP POLICY IF EXISTS "Admins can read inquiries" ON public.collaboration_inquiries;
CREATE POLICY "Admins can read inquiries"
  ON public.collaboration_inquiries FOR SELECT
  TO authenticated
  USING (public.is_site_admin());

-- Newsletter
DROP POLICY IF EXISTS "Authenticated can read subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can read subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Admins can read subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.is_site_admin());

-- Finance books
DROP POLICY IF EXISTS "Authenticated read books" ON public.finance_books;
DROP POLICY IF EXISTS "Authenticated insert books" ON public.finance_books;
DROP POLICY IF EXISTS "Authenticated update books" ON public.finance_books;
DROP POLICY IF EXISTS "Authenticated delete books" ON public.finance_books;
DROP POLICY IF EXISTS "Admins read books" ON public.finance_books;
DROP POLICY IF EXISTS "Admins insert books" ON public.finance_books;
DROP POLICY IF EXISTS "Admins update books" ON public.finance_books;
DROP POLICY IF EXISTS "Admins delete books" ON public.finance_books;

CREATE POLICY "Admins read books" ON public.finance_books
  FOR SELECT TO authenticated USING (public.is_site_admin());
CREATE POLICY "Admins insert books" ON public.finance_books
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin() AND auth.uid() = created_by);
CREATE POLICY "Admins update books" ON public.finance_books
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Admins delete books" ON public.finance_books
  FOR DELETE TO authenticated USING (public.is_site_admin());

-- Finance entries
DROP POLICY IF EXISTS "Authenticated read entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Authenticated insert entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Authenticated update entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Authenticated delete entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Admins read entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Admins insert entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Admins update entries" ON public.finance_entries;
DROP POLICY IF EXISTS "Admins delete entries" ON public.finance_entries;

CREATE POLICY "Admins read entries" ON public.finance_entries
  FOR SELECT TO authenticated USING (public.is_site_admin());
CREATE POLICY "Admins insert entries" ON public.finance_entries
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin() AND auth.uid() = created_by);
CREATE POLICY "Admins update entries" ON public.finance_entries
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Admins delete entries" ON public.finance_entries
  FOR DELETE TO authenticated USING (public.is_site_admin());

-- Receipt drafts
DROP POLICY IF EXISTS "Authenticated read drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Authenticated insert drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Authenticated update drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Authenticated delete drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Admins read drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Admins insert drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Admins update drafts" ON public.finance_receipt_drafts;
DROP POLICY IF EXISTS "Admins delete drafts" ON public.finance_receipt_drafts;

CREATE POLICY "Admins read drafts" ON public.finance_receipt_drafts
  FOR SELECT TO authenticated USING (public.is_site_admin());
CREATE POLICY "Admins insert drafts" ON public.finance_receipt_drafts
  FOR INSERT TO authenticated WITH CHECK (public.is_site_admin() AND auth.uid() = uploaded_by);
CREATE POLICY "Admins update drafts" ON public.finance_receipt_drafts
  FOR UPDATE TO authenticated USING (public.is_site_admin()) WITH CHECK (public.is_site_admin());
CREATE POLICY "Admins delete drafts" ON public.finance_receipt_drafts
  FOR DELETE TO authenticated USING (public.is_site_admin());

-- Storage: finance bilag
DROP POLICY IF EXISTS "auth read finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "auth upload finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "auth update finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "auth delete finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "admins read finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "admins upload finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "admins update finance-bilag" ON storage.objects;
DROP POLICY IF EXISTS "admins delete finance-bilag" ON storage.objects;

CREATE POLICY "admins read finance-bilag" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'finance-bilag' AND public.is_site_admin());
CREATE POLICY "admins upload finance-bilag" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'finance-bilag' AND public.is_site_admin());
CREATE POLICY "admins update finance-bilag" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'finance-bilag' AND public.is_site_admin())
  WITH CHECK (bucket_id = 'finance-bilag' AND public.is_site_admin());
CREATE POLICY "admins delete finance-bilag" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'finance-bilag' AND public.is_site_admin());
