-- ============================================================
-- 005: Rename county_events → trips, event_players → trip_players
--      Add squads and squad_players tables
-- ============================================================

-- ── 1. Rename existing tables ────────────────────────────────

alter table if exists public.county_events rename to trips;
alter table if exists public.event_players rename to trip_players;

-- ── 2. Squads ────────────────────────────────────────────────
-- A squad is a named group of players for the season.
-- No date required. Available to both county_union and golf_club accounts.

create table if not exists public.squads (
  id          uuid        primary key default gen_random_uuid(),
  county_id   uuid        not null references public.counties(id) on delete cascade,
  name        text        not null,
  description text,
  created_at  timestamptz not null default now()
);

alter table public.squads enable row level security;

create policy "Service role full access" on public.squads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "County users manage own squads" on public.squads
  for all
  using (
    exists (
      select 1 from public.counties c
      where c.id = squads.county_id
        and c.supabase_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.counties c
      where c.id = squads.county_id
        and c.supabase_user_id = auth.uid()
    )
  );

-- ── 3. Squad players ─────────────────────────────────────────

create table if not exists public.squad_players (
  id         uuid        primary key default gen_random_uuid(),
  squad_id   uuid        not null references public.squads(id) on delete cascade,
  player_id  uuid        not null references public.players(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(squad_id, player_id)
);

alter table public.squad_players enable row level security;

create policy "Service role full access" on public.squad_players
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "County users manage own squad players" on public.squad_players
  for all
  using (
    exists (
      select 1 from public.squads s
      join public.counties c on c.id = s.county_id
      where s.id = squad_players.squad_id
        and c.supabase_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.squads s
      join public.counties c on c.id = s.county_id
      where s.id = squad_players.squad_id
        and c.supabase_user_id = auth.uid()
    )
  );
