-- DevPath: um documento JSON por usuário, visível e editável só pelo dono.
create table if not exists public.devpath_state (
  user_id    uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.devpath_state enable row level security;

create policy "dono lê" on public.devpath_state
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "dono cria" on public.devpath_state
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "dono atualiza" on public.devpath_state
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "dono apaga" on public.devpath_state
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Página pública de serviços (/s/<slug>): qualquer um lê se estiver publicada; só o dono altera.
create table if not exists public.devpath_public (
  slug       text primary key check (slug ~ '^[a-z0-9-]{3,40}$'),
  user_id    uuid not null unique default auth.uid() references auth.users (id) on delete cascade,
  data       jsonb not null default '{}'::jsonb,
  published  boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.devpath_public enable row level security;

create policy "pagina publicada e publica" on public.devpath_public
  for select to anon, authenticated
  using (published or (select auth.uid()) = user_id);

create policy "dono cria pagina" on public.devpath_public
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "dono atualiza pagina" on public.devpath_public
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "dono apaga pagina" on public.devpath_public
  for delete to authenticated using ((select auth.uid()) = user_id);
