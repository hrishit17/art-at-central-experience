
-- 1. Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. Hero media
CREATE TABLE public.hero_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  is_active BOOLEAN NOT NULL DEFAULT false,
  file_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.hero_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active hero" ON public.hero_media
  FOR SELECT USING (true);
CREATE POLICY "Admins manage hero" ON public.hero_media
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Exhibitions
CREATE TABLE public.exhibitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  category TEXT DEFAULT 'Group Exhibition',
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view exhibitions" ON public.exhibitions
  FOR SELECT USING (true);
CREATE POLICY "Admins manage exhibitions" ON public.exhibitions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.exhibition_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_id UUID REFERENCES public.exhibitions(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.exhibition_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view exhibition images" ON public.exhibition_images
  FOR SELECT USING (true);
CREATE POLICY "Admins manage exhibition images" ON public.exhibition_images
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Journal posts
CREATE TABLE public.journal_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  author TEXT DEFAULT 'Art at Central',
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  publish_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON public.journal_posts
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage posts" ON public.journal_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 5. Artist of the month
CREATE TABLE public.artist_of_month (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  quote TEXT,
  portrait_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artist_of_month ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active artist" ON public.artist_of_month
  FOR SELECT USING (true);
CREATE POLICY "Admins manage artist" ON public.artist_of_month
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.artist_works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artist_of_month(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  year TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.artist_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view artist works" ON public.artist_works
  FOR SELECT USING (true);
CREATE POLICY "Admins manage artist works" ON public.artist_works
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Gallery rooms
CREATE TABLE public.gallery_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view gallery rooms" ON public.gallery_rooms
  FOR SELECT USING (true);
CREATE POLICY "Admins manage gallery rooms" ON public.gallery_rooms
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 7. Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_hero_media_updated_at BEFORE UPDATE ON public.hero_media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_exhibitions_updated_at BEFORE UPDATE ON public.exhibitions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_journal_posts_updated_at BEFORE UPDATE ON public.journal_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_artist_of_month_updated_at BEFORE UPDATE ON public.artist_of_month FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gallery_rooms_updated_at BEFORE UPDATE ON public.gallery_rooms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('hero-media', 'hero-media', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('exhibitions', 'exhibitions', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('journal', 'journal', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('artists', 'artists', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery-rooms', 'gallery-rooms', true);

-- Storage policies: public read, admin write
CREATE POLICY "Public read hero-media" ON storage.objects FOR SELECT USING (bucket_id = 'hero-media');
CREATE POLICY "Admin upload hero-media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update hero-media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete hero-media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'hero-media' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read exhibitions" ON storage.objects FOR SELECT USING (bucket_id = 'exhibitions');
CREATE POLICY "Admin upload exhibitions" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'exhibitions' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update exhibitions" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'exhibitions' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete exhibitions" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'exhibitions' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read journal" ON storage.objects FOR SELECT USING (bucket_id = 'journal');
CREATE POLICY "Admin upload journal" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'journal' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update journal" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'journal' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete journal" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'journal' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read artists" ON storage.objects FOR SELECT USING (bucket_id = 'artists');
CREATE POLICY "Admin upload artists" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'artists' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update artists" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'artists' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete artists" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'artists' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read gallery-rooms" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-rooms');
CREATE POLICY "Admin upload gallery-rooms" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery-rooms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin update gallery-rooms" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery-rooms' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admin delete gallery-rooms" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery-rooms' AND public.has_role(auth.uid(), 'admin'));
