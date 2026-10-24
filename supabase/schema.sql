-- ==============================================================================
-- Kharis Foods - Official Supabase Database Schema
-- Traceable Packaging, Universal GS1 GTINs, Production Batches & Consumer Analytics
-- ==============================================================================

-- 1. Products Table (Master Product Catalog with GS1 EAN-13 GTINs)
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  sku text unique,
  name text not null,
  gtin text unique,                   -- Universal GS1 EAN-13 / GTIN-13
  category text not null,
  tagline text,
  description text,
  images text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Production Batches Table (Packaging Substrates & Traceable Print Quantities)
create table if not exists public.batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text unique not null,    -- e.g. KF-2026-W42-A1B2
  product_slug text references public.products(slug) on delete cascade,
  product_name text not null,
  print_quantity integer not null default 1000,
  packaging_material text not null,   -- e.g. Shiny Silver Foil, Woven Poly Sack, Rubber
  qr_color text not null default '#000000',
  qr_color_name text default 'Standard Black',
  production_date date not null default current_date,
  expiry_date date,
  facility text default 'Main Plant',
  notes text,
  scan_count integer not null default 0,
  last_scanned_at timestamptz,
  status text not null default 'active' check (status in ('active', 'depleted', 'recalled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Consumer Scan Events Table (Real-time Analytics & Traceability Audits)
create table if not exists public.scan_events (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  product_name text not null,
  batch_code text,
  device_type text,                   -- mobile, tablet, desktop
  browser text,
  os text,
  country text default 'GH',
  city text,
  ip_hash text,
  scanned_at timestamptz default now()
);

-- 4. Customer Feedback & Recipe Experience Reviews
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  product_name text not null,
  batch_code text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- Indexes for Sub-Millisecond Verification Queries
-- ==============================================================================
create index if not exists idx_batches_code on public.batches (upper(batch_code));
create index if not exists idx_batches_slug on public.batches (product_slug);
create index if not exists idx_scan_events_slug on public.scan_events (product_slug);
create index if not exists idx_scan_events_batch on public.scan_events (batch_code);
create index if not exists idx_scan_events_time on public.scan_events (scanned_at desc);
create index if not exists idx_feedback_slug on public.feedback (product_slug);

-- ==============================================================================
-- Initial Seeding (Master Products with Universal GS1 Barcodes)
-- ==============================================================================
insert into public.products (slug, sku, name, gtin, category, tagline, description, images)
values
  (
    'maize-grits',
    'KF-MG-01',
    'Maize Grits',
    '0602500000018',
    'Grains & Tubers',
    'Energy-Rich & Naturally Gluten-Free',
    'Maize Grits provide energy-rich carbohydrates and can be enjoyed with milk, groundnuts, honey, or fresh fruits for added nutrition and taste.',
    array['/images/maize-grits.jpg']
  ),
  (
    'whole-grain-corn-flour',
    'KF-WGCF-02',
    'Whole Grain Corn Flour',
    '0602500000025',
    'Flours & Meals',
    'Premium Whole-Grain Nutrition',
    'Whole Grain Corn Flour is produced from carefully selected whole maize grains and contains the bran, germ, and endosperm, providing natural fiber, vitamins, and minerals.',
    array['/images/maize-flour.jpeg']
  )
on conflict (slug) do update set
  gtin = excluded.gtin,
  sku = excluded.sku,
  updated_at = now();

-- ==============================================================================
-- Row-Level Security (RLS) Configuration
-- ==============================================================================
alter table public.products enable row level security;
alter table public.batches enable row level security;
alter table public.scan_events enable row level security;
alter table public.feedback enable row level security;

-- Public can view products and verify batches
create policy "Allow public read access to products" on public.products for select using (true);
create policy "Allow public read access to batches" on public.batches for select using (true);
create policy "Allow public insert to scan_events" on public.scan_events for insert with check (true);
create policy "Allow public insert to feedback" on public.feedback for insert with check (true);

-- Admin / Service Role has full read/write access to all tables
create policy "Allow service_role full access to products" on public.products for all using (auth.role() = 'service_role');
create policy "Allow service_role full access to batches" on public.batches for all using (auth.role() = 'service_role');
create policy "Allow service_role full access to scan_events" on public.scan_events for all using (auth.role() = 'service_role');
create policy "Allow service_role full access to feedback" on public.feedback for all using (auth.role() = 'service_role');
