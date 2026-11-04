-- Radar de Clientes: contador de uso por usuário/dia (controle de custo e abuso).
-- Só a Edge Function (service_role) grava; cada usuário pode ler o próprio uso.
create table if not exists public.radar_usage (
  user_id  uuid not null references auth.users (id) on delete cascade,
  day      date not null default current_date,
  searches integer not null default 0 check (searches >= 0),
  details  integer not null default 0 check (details >= 0),
  ai_calls integer not null default 0 check (ai_calls >= 0),
  primary key (user_id, day)
);

alter table public.radar_usage enable row level security;

create policy "usuario le o proprio uso" on public.radar_usage
  for select to authenticated using ((select auth.uid()) = user_id);

create index if not exists radar_usage_day_idx on public.radar_usage (day);

-- Consome 1 unidade se estiver dentro do limite diário (por usuário) e mensal (da plataforma toda).
create or replace function public.radar_try_consume(p_user uuid, p_kind text, p_daily_limit integer, p_monthly_limit integer)
returns table (allowed boolean, used_today integer, used_month integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_today integer;
  v_month integer;
begin
  if p_kind not in ('search', 'details', 'ai') then
    raise exception 'invalid kind';
  end if;
  perform pg_advisory_xact_lock(hashtext('radar_usage_' || p_kind));

  select coalesce(sum(case p_kind when 'search' then u.searches when 'details' then u.details else u.ai_calls end), 0)::integer
    into v_month
    from public.radar_usage u
   where u.day >= date_trunc('month', current_date)::date;

  select coalesce(max(case p_kind when 'search' then u.searches when 'details' then u.details else u.ai_calls end), 0)::integer
    into v_today
    from public.radar_usage u
   where u.user_id = p_user and u.day = current_date;

  if v_today >= p_daily_limit or v_month >= p_monthly_limit then
    return query select false, v_today, v_month;
    return;
  end if;

  insert into public.radar_usage as u (user_id, day, searches, details, ai_calls)
  values (p_user, current_date, (p_kind = 'search')::integer, (p_kind = 'details')::integer, (p_kind = 'ai')::integer)
  on conflict (user_id, day) do update
     set searches = u.searches + (p_kind = 'search')::integer,
         details  = u.details  + (p_kind = 'details')::integer,
         ai_calls = u.ai_calls + (p_kind = 'ai')::integer;

  return query select true, v_today + 1, v_month + 1;
end;
$$;

-- Devolve 1 unidade quando a chamada externa falhou (o usuário não paga pelo erro).
create or replace function public.radar_refund(p_user uuid, p_kind text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.radar_usage
     set searches = greatest(searches - (p_kind = 'search')::integer, 0),
         details  = greatest(details  - (p_kind = 'details')::integer, 0),
         ai_calls = greatest(ai_calls - (p_kind = 'ai')::integer, 0)
   where user_id = p_user and day = current_date;
$$;

revoke all on function public.radar_try_consume(uuid, text, integer, integer) from public, anon, authenticated;
revoke all on function public.radar_refund(uuid, text) from public, anon, authenticated;
grant execute on function public.radar_try_consume(uuid, text, integer, integer) to service_role;
grant execute on function public.radar_refund(uuid, text) to service_role;
