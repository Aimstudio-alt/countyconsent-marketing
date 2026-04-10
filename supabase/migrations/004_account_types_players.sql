-- ============================================================
-- 004: Account types, club-county relationships, players,
--      county events and event audit trail
-- ============================================================

-- ── 1. Extend counties table ─────────────────────────────────

-- Account type: county_union (paying subscriber) or golf_club (member club)
alter table public.counties
  add column if not exists account_type text not null default 'county_union'
    check (account_type in ('county_union', 'golf_club'));

-- Golf clubs reference their parent county union
alter table public.counties
  add column if not exists parent_county_id uuid
    references public.counties(id) on delete set null;

-- ── 2. Players (junior members) ──────────────────────────────

create table if not exists public.players (
  id                uuid        primary key default gen_random_uuid(),
  county_id         uuid        not null references public.counties(id) on delete cascade,
  full_name         text        not null,
  date_of_birth     date,
  parent_name       text,
  parent_email      text,
  consent_status    text        not null default 'pending'
    check (consent_status in ('pending', 'consent_received', 'declined', 'expired')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.players enable row level security;

-- Service role (webhooks, server-side) can do everything
create policy "Service role full access" on public.players
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Authenticated users can manage players belonging to their county
create policy "County users manage own players" on public.players
  for all
  using (
    exists (
      select 1 from public.counties c
      where c.id = players.county_id
        and c.supabase_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.counties c
      where c.id = players.county_id
        and c.supabase_user_id = auth.uid()
    )
  );

-- ── 3. County events ─────────────────────────────────────────

create table if not exists public.county_events (
  id           uuid        primary key default gen_random_uuid(),
  county_id    uuid        not null references public.counties(id) on delete cascade,
  name         text        not null,
  event_date   date,
  description  text,
  created_at   timestamptz not null default now()
);

alter table public.county_events enable row level security;

create policy "Service role full access" on public.county_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "County users manage own events" on public.county_events
  for all
  using (
    exists (
      select 1 from public.counties c
      where c.id = county_events.county_id
        and c.supabase_user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.counties c
      where c.id = county_events.county_id
        and c.supabase_user_id = auth.uid()
    )
  );

-- ── 4. Event players (audit trail) ───────────────────────────

create table if not exists public.event_players (
  id                  uuid        primary key default gen_random_uuid(),
  event_id            uuid        not null references public.county_events(id) on delete cascade,
  player_id           uuid        not null references public.players(id) on delete cascade,
  -- The club the player belongs to (read-only audit reference)
  player_county_id    uuid        not null references public.counties(id),
  -- The county union that added this player (may differ for cross-county additions)
  added_by_county_id  uuid        not null references public.counties(id),
  is_cross_county     boolean     not null default false,
  created_at          timestamptz not null default now(),
  unique(event_id, player_id)
);

alter table public.event_players enable row level security;

create policy "Service role full access" on public.event_players
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Event owners can see all players on their events
create policy "County users view own event players" on public.event_players
  for select
  using (
    exists (
      select 1 from public.county_events ce
      join public.counties c on c.id = ce.county_id
      where ce.id = event_players.event_id
        and c.supabase_user_id = auth.uid()
    )
  );
