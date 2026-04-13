-- Create storage bucket for leaf images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('leaf-images', 'leaf-images', true)
ON CONFLICT (id) DO NOTHING;