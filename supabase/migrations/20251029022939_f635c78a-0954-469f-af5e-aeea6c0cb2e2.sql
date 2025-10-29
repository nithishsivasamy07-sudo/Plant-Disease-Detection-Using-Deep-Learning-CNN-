-- Create RLS policies for leaf-images storage bucket
CREATE POLICY "Users can upload leaf images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'leaf-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can view leaf images"
ON storage.objects FOR SELECT
USING (bucket_id = 'leaf-images');

CREATE POLICY "Users can update their leaf images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'leaf-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their leaf images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'leaf-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);