-- AI Study Buddy Supabase schema
-- Run this in the Supabase SQL Editor.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  username text unique,
  email text,
  grade_level text default 'junior_high',
  role text default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.student_profiles
add column if not exists username text;

create unique index if not exists student_profiles_username_idx
on public.student_profiles(username)
where username is not null;

drop trigger if exists student_profiles_set_updated_at on public.student_profiles;
create trigger student_profiles_set_updated_at
before update on public.student_profiles
for each row execute function public.set_updated_at();

create table if not exists public.learning_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.student_profiles(id) on delete cascade,
  title text,
  topic text,
  passage text,
  summary text,
  conversation jsonb,
  reading_check_count integer default 0,
  passage_language text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

alter table public.learning_sessions
add column if not exists title text;

alter table public.learning_sessions
add column if not exists summary text;

alter table public.learning_sessions
add column if not exists conversation jsonb;

alter table public.learning_sessions
add column if not exists reading_check_count integer default 0;

alter table public.learning_sessions
add column if not exists passage_language text;

alter table public.learning_sessions
add column if not exists completed_at timestamptz;

create table if not exists public.learning_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.learning_sessions(id) on delete cascade,
  student_id uuid references public.student_profiles(id) on delete cascade,
  question_type text,
  student_answer text,
  ai_feedback text,
  detected_weakness text,
  created_at timestamptz default now()
);

create table if not exists public.learning_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid unique references public.student_profiles(id) on delete cascade,
  common_weakness text,
  recently_practiced_skill text,
  support_level text default 'medium',
  updated_at timestamptz default now()
);

create or replace function public.handle_new_student_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.student_profiles (id, display_name, username, email, grade_level, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1), 'Student'),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    'junior_high',
    'student'
  )
  on conflict (id) do nothing;

  insert into public.learning_profiles (student_id, support_level, recently_practiced_skill)
  values (new.id, 'medium', 'Getting started')
  on conflict (student_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_student_user();

create index if not exists learning_sessions_student_id_idx
on public.learning_sessions(student_id);

create index if not exists learning_responses_student_id_idx
on public.learning_responses(student_id);

create index if not exists learning_responses_session_id_idx
on public.learning_responses(session_id);

create index if not exists learning_profiles_student_id_idx
on public.learning_profiles(student_id);

alter table public.student_profiles enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.learning_responses enable row level security;
alter table public.learning_profiles enable row level security;

drop policy if exists "Students can select their own profile" on public.student_profiles;
create policy "Students can select their own profile"
on public.student_profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Students can insert their own profile" on public.student_profiles;
create policy "Students can insert their own profile"
on public.student_profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Students can update their own profile" on public.student_profiles;
create policy "Students can update their own profile"
on public.student_profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Students can insert their own learning sessions" on public.learning_sessions;
create policy "Students can insert their own learning sessions"
on public.learning_sessions
for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "Students can select their own learning sessions" on public.learning_sessions;
create policy "Students can select their own learning sessions"
on public.learning_sessions
for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Students can update their own learning sessions" on public.learning_sessions;
create policy "Students can update their own learning sessions"
on public.learning_sessions
for update
to authenticated
using (auth.uid() = student_id)
with check (auth.uid() = student_id);

drop policy if exists "Students can insert their own learning responses" on public.learning_responses;
create policy "Students can insert their own learning responses"
on public.learning_responses
for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "Students can select their own learning responses" on public.learning_responses;
create policy "Students can select their own learning responses"
on public.learning_responses
for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Students can insert their own learning profile" on public.learning_profiles;
create policy "Students can insert their own learning profile"
on public.learning_profiles
for insert
to authenticated
with check (auth.uid() = student_id);

drop policy if exists "Students can select their own learning profile" on public.learning_profiles;
create policy "Students can select their own learning profile"
on public.learning_profiles
for select
to authenticated
using (auth.uid() = student_id);

drop policy if exists "Students can update their own learning profile" on public.learning_profiles;
create policy "Students can update their own learning profile"
on public.learning_profiles
for update
to authenticated
using (auth.uid() = student_id)
with check (auth.uid() = student_id);
