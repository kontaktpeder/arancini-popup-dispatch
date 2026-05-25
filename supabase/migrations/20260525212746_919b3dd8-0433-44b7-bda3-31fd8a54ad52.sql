CREATE TABLE public.newsletter_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  lang TEXT NOT NULL DEFAULT 'no',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up
CREATE POLICY "Anyone can subscribe"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only authenticated (admin) users can read the list
CREATE POLICY "Authenticated can read subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (true);