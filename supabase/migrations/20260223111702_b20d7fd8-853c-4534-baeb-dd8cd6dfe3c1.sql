
-- Drop and recreate to ensure clean state
DROP TABLE IF EXISTS public.site_settings CASCADE;

CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enquiry_receiving_email TEXT NOT NULL DEFAULT 'info@artatcentral.com',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.site_settings (enquiry_receiving_email)
VALUES ('info@artatcentral.com');

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_hero_media_active ON public.hero_media (is_active);
CREATE INDEX IF NOT EXISTS idx_exhibitions_start_date ON public.exhibitions (start_date);
CREATE INDEX IF NOT EXISTS idx_exhibitions_status ON public.exhibitions (status);
CREATE INDEX IF NOT EXISTS idx_journal_posts_status ON public.journal_posts (status);
CREATE INDEX IF NOT EXISTS idx_journal_posts_publish_date ON public.journal_posts (publish_date);
CREATE INDEX IF NOT EXISTS idx_artist_of_month_active ON public.artist_of_month (is_active);
