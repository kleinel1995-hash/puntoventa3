-- Ejecuta este SQL en Supabase > SQL Editor.
create table if not exists public.pos_app_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.pos_app_data enable row level security;

-- IMPORTANTE: esta política permite acceso de lectura/escritura a cualquiera
-- que tenga la clave anon. Úsala solo en un proyecto privado/de pruebas.
-- Para producción, implementa autenticación y políticas por usuario/negocio.
drop policy if exists "POS public read" on public.pos_app_data;
create policy "POS public read" on public.pos_app_data
for select to anon, authenticated using (true);

drop policy if exists "POS public insert" on public.pos_app_data;
create policy "POS public insert" on public.pos_app_data
for insert to anon, authenticated with check (true);

drop policy if exists "POS public update" on public.pos_app_data;
create policy "POS public update" on public.pos_app_data
for update to anon, authenticated using (true) with check (true);
