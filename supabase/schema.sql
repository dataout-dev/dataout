-- =========================================================
-- DataOut: subscriptions
-- Paste into Supabase Dashboard -> SQL Editor -> run once.
-- Safe to re-run: every statement is idempotent.
--
-- What's free vs. premium is NOT in the database — it's a static config file
-- in the app itself (src/data/premiumConfig.js), edited and deployed like any
-- other code change. This schema only tracks subscription state per user.
-- =========================================================
-- denormalized, for eyeballing in the table editor only
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  user_email text,                       
  razorpay_subscription_id text unique,
  razorpay_customer_id text,
  plan_id text,
  status text not null default 'none'
    check (status in ('none','created','authenticated','active','pending','halted','cancelled','completed','expired')),
  current_start timestamptz,
  current_end timestamptz,
  -- true once the user has clicked Cancel, before the billing period actually
  -- ends. status stays 'active' (and premium access stays unlocked) until the
  -- webhook confirms the real cancellation at cycle end — this flag is just
  -- what drives the "ends on <date>" UI in the meantime.
  cancel_requested boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions add column if not exists cancel_requested boolean not null default false;

alter table public.subscriptions enable row level security;

-- RLS policies only take effect on top of a baseline table-level grant —
-- creating a table via raw SQL does NOT grant this automatically the way
-- Supabase's Table Editor UI does. Without this line, every query from the
-- client fails with "permission denied for table subscriptions" (42501)
-- before the RLS policy below is even evaluated.
grant select on public.subscriptions to authenticated;

-- service_role bypasses RLS *policies*, but RLS bypass is not the same as a
-- table-level grant — without this, every write from the Edge Functions
-- (create-razorpay-subscription, razorpay-webhook) fails silently with
-- "permission denied for table subscriptions" (42501), since neither function
-- checks the write's error result. This was the cause of subscriptions never
-- appearing in this table despite successful Razorpay payments.
grant select, insert, update on public.subscriptions to service_role;

drop policy if exists "subscriptions_select_own" on public.subscriptions;
create policy "subscriptions_select_own"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Deliberately no insert/update/delete policy for authenticated/anon.
-- Once RLS is enabled, any operation without a matching policy is denied for
-- those roles. Only the service-role key (used inside Edge Functions) can write
-- this table, since service_role bypasses RLS entirely.
