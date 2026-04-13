-- Add subscription fields to profiles for paid-only access

alter table public.profiles
  add column if not exists subscription_status text not null default 'inactive'
    check (subscription_status in ('inactive', 'active', 'trialing', 'past_due', 'canceled', 'unpaid')),
  add column if not exists subscription_plan text
    check (subscription_plan in ('pro', 'business')),
  add column if not exists stripe_customer_id text unique,
  add column if not exists stripe_subscription_id text unique,
  add column if not exists subscription_current_period_end timestamptz;

create index if not exists profiles_subscription_status_idx
  on public.profiles (subscription_status);

-- New users start as inactive (must pay to access the app)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, subscription_status)
  values (new.id, new.raw_user_meta_data->>'display_name', 'inactive');
  return new;
end;
$$ language plpgsql security definer;
