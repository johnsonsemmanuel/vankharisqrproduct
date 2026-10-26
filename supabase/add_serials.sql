-- Add product_serials table for per-unit serialization
create table if not exists public.product_serials (
  id uuid primary key default gen_random_uuid(),
  serial_code text unique not null,
  batch_code text not null,
  product_slug text not null,
  product_name text not null,
  used boolean not null default false,
  used_at timestamptz,
  used_by_ip_hash text,
  scan_count integer not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_serials_code on public.product_serials (serial_code);
create index if not exists idx_serials_batch on public.product_serials (batch_code);
create index if not exists idx_serials_used on public.product_serials (used);

alter table public.product_serials enable row level security;

create policy "Allow public read access to serials" on public.product_serials for select using (true);
create policy "Allow service_role full access to serials" on public.product_serials for all using (auth.role() = 'service_role');
