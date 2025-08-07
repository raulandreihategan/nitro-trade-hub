-- Create services data model for editable products/services
-- 1) Core services table (text id to match existing routes)
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  category TEXT NOT NULL,
  game TEXT NOT NULL,
  rating NUMERIC NOT NULL DEFAULT 5.0,
  base_price NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Related tables
CREATE TABLE IF NOT EXISTS public.service_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.service_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.service_faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.service_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL, -- stable identifier used in cart
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  highlighted BOOLEAN NOT NULL DEFAULT false,
  best_value BOOLEAN NOT NULL DEFAULT false,
  delivery_time TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT service_option_unique UNIQUE(service_id, option_id)
);

-- RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_options ENABLE ROW LEVEL SECURITY;

-- Read policies (publicly readable)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services' AND policyname = 'Services are readable by everyone'
  ) THEN
    CREATE POLICY "Services are readable by everyone" ON public.services FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_images' AND policyname = 'Service images are readable by everyone'
  ) THEN
    CREATE POLICY "Service images are readable by everyone" ON public.service_images FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_features' AND policyname = 'Service features are readable by everyone'
  ) THEN
    CREATE POLICY "Service features are readable by everyone" ON public.service_features FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_faqs' AND policyname = 'Service FAQs are readable by everyone'
  ) THEN
    CREATE POLICY "Service FAQs are readable by everyone" ON public.service_faqs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_options' AND policyname = 'Service options are readable by everyone'
  ) THEN
    CREATE POLICY "Service options are readable by everyone" ON public.service_options FOR SELECT USING (true);
  END IF;
END $$;

-- Timestamp trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'set_services_updated_at'
  ) THEN
    CREATE TRIGGER set_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- Optional helper indexes
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);
CREATE INDEX IF NOT EXISTS idx_services_game ON public.services(game);
CREATE INDEX IF NOT EXISTS idx_service_images_service ON public.service_images(service_id);
CREATE INDEX IF NOT EXISTS idx_service_features_service ON public.service_features(service_id);
CREATE INDEX IF NOT EXISTS idx_service_faqs_service ON public.service_faqs(service_id);
CREATE INDEX IF NOT EXISTS idx_service_options_service ON public.service_options(service_id);
