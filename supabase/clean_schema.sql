-- ==============================================================================
-- Kharis Foods - Clean Production Schema
-- Industry-Standard Traceability, Serialization & GS1 Compliance
-- ==============================================================================

-- 1. Companies/Brands (for multi-tenant ready)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  gs1_company_prefix TEXT,
  country TEXT DEFAULT 'GH',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products (Master Catalog with GS1 GTINs)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id),
  slug TEXT UNIQUE NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  gtin TEXT UNIQUE, -- GS1 EAN-13 GTIN-13
  category TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Production Batches/Lots (Full Traceability)
CREATE TABLE IF NOT EXISTS public.batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_code TEXT UNIQUE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  print_quantity INTEGER NOT NULL DEFAULT 0 CHECK (print_quantity >= 0),
  packaging_material TEXT NOT NULL,
  qr_color TEXT DEFAULT '#000000',
  qr_color_name TEXT DEFAULT 'Standard Black',
  production_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE,
  best_before_date DATE,
  facility TEXT,
  line_number TEXT,
  operator_id TEXT,
  notes TEXT,
  scan_count INTEGER NOT NULL DEFAULT 0,
  last_scanned_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'depleted', 'recalled', 'quarantined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Per-Unit Serial Numbers (Anti-Counterfeiting)
CREATE TABLE IF NOT EXISTS public.product_serials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_code TEXT UNIQUE NOT NULL,
  batch_id UUID REFERENCES public.batches(id),
  batch_code TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  used_at TIMESTAMPTZ,
  used_by_ip_hash TEXT,
  used_device_info JSONB,
  scan_count INTEGER NOT NULL DEFAULT 0,
  verification_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_serial_per_batch UNIQUE(batch_id, serial_code)
);

-- 5. Scan Events (Comprehensive Tracking)
CREATE TABLE IF NOT EXISTS public.scan_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_id UUID REFERENCES public.product_serials(id),
  batch_id UUID REFERENCES public.batches(id),
  product_id UUID REFERENCES public.products(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  batch_code TEXT,
  serial_code TEXT,
  scan_type TEXT DEFAULT 'qr' CHECK (scan_type IN ('qr', 'barcode', 'nfc')),
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_hash TEXT,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  referrer TEXT,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Customer Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  batch_id UUID REFERENCES public.batches(id),
  batch_code TEXT,
  serial_id UUID REFERENCES public.product_serials(id),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  source TEXT DEFAULT 'direct' CHECK (source IN ('qr', 'barcode', 'direct')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Audit Log (Compliance)
CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  user_id TEXT,
  details JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_gtin ON public.products(gtin);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_batches_code ON public.batches(UPPER(batch_code));
CREATE INDEX IF NOT EXISTS idx_batches_product ON public.batches(product_id);
CREATE INDEX IF NOT EXISTS idx_serials_code ON public.product_serials(serial_code);
CREATE INDEX IF NOT EXISTS idx_serials_batch ON public.product_serials(batch_id);
CREATE INDEX IF NOT EXISTS idx_serials_used ON public.product_serials(used);
CREATE INDEX IF NOT EXISTS idx_scan_events_serial ON public.scan_events(serial_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_batch ON public.scan_events(batch_id);
CREATE INDEX IF NOT EXISTS idx_scan_events_time ON public.scan_events(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_product ON public.feedback(product_id);

-- Updated At Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_serials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Public policies
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read batches" ON public.batches FOR SELECT USING (true);
CREATE POLICY "Allow public read serials" ON public.product_serials FOR SELECT USING (true);
CREATE POLICY "Allow public insert scan_events" ON public.scan_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert feedback" ON public.feedback FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update serials on verify" ON public.product_serials FOR UPDATE USING (true) WITH CHECK (true);

-- Service role full access
CREATE POLICY "Service role full access companies" ON public.companies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access products" ON public.products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access batches" ON public.batches FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access serials" ON public.product_serials FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access scan_events" ON public.scan_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access feedback" ON public.feedback FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access audit" ON public.audit_log FOR ALL USING (auth.role() = 'service_role');

-- Seed company and products
INSERT INTO public.companies (name, gs1_company_prefix, country) VALUES ('Vankharis Limited', '060250', 'GH') ON CONFLICT DO NOTHING;

INSERT INTO public.products (company_id, slug, sku, name, gtin, category) 
SELECT c.id, 'maize-grits', 'KF-MG-01', 'Maize Grits', '0602500000018', 'Grains & Tubers'
FROM public.companies c WHERE c.name = 'Vankharis Limited'
ON CONFLICT (slug) DO UPDATE SET gtin = EXCLUDED.gtin, sku = EXCLUDED.sku, updated_at = NOW();

INSERT INTO public.products (company_id, slug, sku, name, gtin, category) 
SELECT c.id, 'whole-grain-corn-flour', 'KF-WGCF-02', 'Whole Grain Corn Flour', '0602500000025', 'Flours & Meals'
FROM public.companies c WHERE c.name = 'Vankharis Limited'
ON CONFLICT (slug) DO UPDATE SET gtin = EXCLUDED.gtin, sku = EXCLUDED.sku, updated_at = NOW();
