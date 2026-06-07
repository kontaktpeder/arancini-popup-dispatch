
CREATE POLICY "auth read finance-bilag" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'finance-bilag');
CREATE POLICY "auth upload finance-bilag" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'finance-bilag');
CREATE POLICY "auth update finance-bilag" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'finance-bilag') WITH CHECK (bucket_id = 'finance-bilag');
CREATE POLICY "auth delete finance-bilag" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'finance-bilag');
