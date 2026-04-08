-- Counties table: one record per county union subscription
create table if not exists public.counties (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  supabase_user_id uuid references auth.users(id) on delete set null,
  county_union_name text not null,
  governing_body text not null,
  secretary_name text not null,
  email text not null unique,
  phone text not null,
  plan text not null check (plan in ('monthly', 'annual')),
  subscription_status text not null default 'pending_payment',
  stripe_customer_id text,
  stripe_subscription_id text
);

-- Enable RLS
alter table public.counties enable row level security;

-- Service role can do everything (for webhooks and server-side operations)
create policy "Service role full access" on public.counties
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- Users can read their own county record
create policy "Users can read own county" on public.counties
  for select
  using (auth.uid() = supabase_user_id);
