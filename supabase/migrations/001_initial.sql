-- Demo requests table
create table if not exists demo_requests (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  county_union text not null,
  email text not null,
  phone text,
  created_at timestamptz not null default now()
);

-- Subscribers table
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  stripe_customer_id text not null unique,
  stripe_subscription_id text not null unique,
  email text not null,
  name text,
  plan text not null check (plan in ('monthly', 'annual')),
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Row Level Security
alter table demo_requests enable row level security;
alter table subscribers enable row level security;

-- Only service role can access these tables (no public access)
create policy "Service role only" on demo_requests
  for all using (false);

create policy "Service role only" on subscribers
  for all using (false);
