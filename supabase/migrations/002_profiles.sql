-- Profiles table to list users in the Admin Panel
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Keep timestamps fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- Policies (development-friendly):
-- 1) Each user can select/insert/update their own profile
create policy "Users can select own profile"
on public.profiles for select
using (auth.uid() = user_id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = user_id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = user_id);

-- 2) TEMP: Allow all authenticated users to select all profiles (so admin can read)
-- In production, restrict to admins via a secure RPC or service role
create policy "All authenticated can read profiles (dev)" 
on public.profiles for select
to authenticated
using (true);


