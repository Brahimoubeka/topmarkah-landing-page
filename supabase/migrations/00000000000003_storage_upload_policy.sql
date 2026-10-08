-- Allow authenticated admin users to upload to product storage buckets
-- (The initial schema only added a broad policy; this ensures INSERT specifically works)

-- Allow admins to INSERT (upload) into storage objects for product and landing buckets
CREATE POLICY IF NOT EXISTS "Admins can upload to products bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'products'
    AND EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Admins can update products bucket objects"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'products'
    AND EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
  );

CREATE POLICY IF NOT EXISTS "Admins can delete from products bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'products'
    AND EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid())
  );
