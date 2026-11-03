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
