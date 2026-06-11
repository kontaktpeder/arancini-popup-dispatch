CREATE TABLE public.site_popup_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  popup_status TEXT NOT NULL DEFAULT 'coming_soon'
    CHECK (popup_status IN ('announced', 'coming_soon')),
  venue TEXT,
  date_label TEXT,
  date_label_en TEXT,
  date_short TEXT,
  date_short_en TEXT,
  time_label TEXT,
  address_short TEXT,
  address_full TEXT,
  maps_google TEXT,
  maps_apple TEXT,
  countdown_target TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_popup_settings TO anon, authenticated;
GRANT UPDATE ON public.site_popup_settings TO authenticated;
GRANT ALL ON public.site_popup_settings TO service_role;

ALTER TABLE public.site_popup_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read popup settings"
ON public.site_popup_settings FOR SELECT
TO anon, authenticated USING (true);

CREATE POLICY "Authenticated can update popup settings"
ON public.site_popup_settings FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

INSERT INTO public.site_popup_settings (popup_status) VALUES ('coming_soon');

CREATE TABLE public.collaboration_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('bryllup', 'firmaevent', 'festival', 'bursdag', 'popup_samarbeid', 'annet')),
  guest_count TEXT,
  message TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'no'
);

GRANT INSERT ON public.collaboration_inquiries TO anon, authenticated;
GRANT SELECT ON public.collaboration_inquiries TO authenticated;
GRANT ALL ON public.collaboration_inquiries TO service_role;

ALTER TABLE public.collaboration_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit inquiry"
ON public.collaboration_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated can read inquiries"
ON public.collaboration_inquiries FOR SELECT
TO authenticated USING (true);