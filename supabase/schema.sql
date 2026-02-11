-- Minimal Supabase schema for SoraStudio Cloud
-- Note: Auth tables are managed by Supabase automatically.

-- 1) User profile table synced with auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are readable by owner"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "profiles are updatable by owner"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 2) Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

