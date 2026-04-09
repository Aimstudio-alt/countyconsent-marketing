-- Staff profiles table: tracks internal admin users and their roles
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.staff_profiles enable row level security;

create policy "Service role full access" on public.staff_profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Allow 'pilot' plan type in counties table (for manually created accounts)
alter table public.counties
  drop constraint if exists counties_plan_check;

alter table public.counties
  add constraint counties_plan_check check (plan in ('monthly', 'annual', 'pilot'));

-- ============================================================
-- Run this to set yourself as super_admin (replace the email):
-- ============================================================
-- insert into public.staff_profiles (user_id, role)
-- select id, 'super_admin' from auth.users where email = 'YOUR_EMAIL@example.com'
-- on conflict (user_id) do update set role = 'super_admin';
