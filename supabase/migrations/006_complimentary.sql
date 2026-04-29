-- ============================================================
-- 006: Complimentary (free) accounts
-- ============================================================

-- Add is_complimentary flag to counties
alter table public.counties
  add column if not exists is_complimentary boolean not null default false;

-- Extend plan check constraint to include 'complimentary' and 'pilot'
-- (drop the original constraint first; idempotent via IF EXISTS)
alter table public.counties drop constraint if exists counties_plan_check;
alter table public.counties
  add constraint counties_plan_check
  check (plan in ('monthly', 'annual', 'pilot', 'complimentary'));
