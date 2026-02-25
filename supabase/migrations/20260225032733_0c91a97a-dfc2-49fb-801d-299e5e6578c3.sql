
-- Fix ALL RLS policies: change from RESTRICTIVE to PERMISSIVE
-- This is the root cause of the frontend data disconnect

-- hero_media
DROP POLICY IF EXISTS "Public can view active hero" ON public.hero_media;
DROP POLICY IF EXISTS "Admins manage hero" ON public.hero_media;
CREATE POLICY "Public can view active hero" ON public.hero_media FOR SELECT USING (true);
CREATE POLICY "Admins manage hero" ON public.hero_media FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- exhibitions
DROP POLICY IF EXISTS "Public can view exhibitions" ON public.exhibitions;
DROP POLICY IF EXISTS "Admins manage exhibitions" ON public.exhibitions;
CREATE POLICY "Public can view exhibitions" ON public.exhibitions FOR SELECT USING (true);
CREATE POLICY "Admins manage exhibitions" ON public.exhibitions FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- exhibition_images
DROP POLICY IF EXISTS "Public can view exhibition images" ON public.exhibition_images;
DROP POLICY IF EXISTS "Admins manage exhibition images" ON public.exhibition_images;
CREATE POLICY "Public can view exhibition images" ON public.exhibition_images FOR SELECT USING (true);
CREATE POLICY "Admins manage exhibition images" ON public.exhibition_images FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- journal_posts
DROP POLICY IF EXISTS "Public can view published posts" ON public.journal_posts;
DROP POLICY IF EXISTS "Admins manage posts" ON public.journal_posts;
CREATE POLICY "Public can view published posts" ON public.journal_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage posts" ON public.journal_posts FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- artist_of_month
DROP POLICY IF EXISTS "Public can view active artist" ON public.artist_of_month;
DROP POLICY IF EXISTS "Admins manage artist" ON public.artist_of_month;
CREATE POLICY "Public can view active artist" ON public.artist_of_month FOR SELECT USING (true);
CREATE POLICY "Admins manage artist" ON public.artist_of_month FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- artist_works
DROP POLICY IF EXISTS "Public can view artist works" ON public.artist_works;
DROP POLICY IF EXISTS "Admins manage artist works" ON public.artist_works;
CREATE POLICY "Public can view artist works" ON public.artist_works FOR SELECT USING (true);
CREATE POLICY "Admins manage artist works" ON public.artist_works FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- gallery_rooms
DROP POLICY IF EXISTS "Public can view gallery rooms" ON public.gallery_rooms;
DROP POLICY IF EXISTS "Admins manage gallery rooms" ON public.gallery_rooms;
CREATE POLICY "Public can view gallery rooms" ON public.gallery_rooms FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery rooms" ON public.gallery_rooms FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- site_settings
DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update site settings" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- user_roles
DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime on content tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_media;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exhibitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.journal_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.artist_of_month;
ALTER PUBLICATION supabase_realtime ADD TABLE public.artist_works;
