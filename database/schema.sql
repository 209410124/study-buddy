-- AI Study Buddy Supabase schema
-- Run this in the Supabase SQL Editor or adapt it into a migration.

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

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique,
  grade_level text,
  native_language text,
  reading_level text,
  learning_goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_updated_at();

create table if not exists public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  topic text,
  passage_text text not null,
  passage_level text,
  support_level text not null default 'medium'
    check (support_level in ('low', 'medium', 'high')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger reading_sessions_set_updated_at
before update on public.reading_sessions
for each row execute function public.set_updated_at();

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  reading_session_id uuid not null references public.reading_sessions(id) on delete cascade,
  question_text text not null,
  answer_text text not null,
  is_correct boolean,
  score numeric(5,2) check (score is null or (score >= 0 and score <= 100)),
  ai_feedback text,
  feedback_type text default 'reading_comprehension',
  detected_weaknesses text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger responses_set_updated_at
before update on public.responses
for each row execute function public.set_updated_at();

create table if not exists public.learning_profiles (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students(id) on delete cascade,
  current_reading_level text,
  adaptive_support_level text not null default 'medium'
    check (adaptive_support_level in ('low', 'medium', 'high')),
  strengths text[] not null default '{}',
  current_needs text[] not null default '{}',
  detected_weaknesses text[] not null default '{}',
  recommended_focus text,
  last_session_id uuid references public.reading_sessions(id) on delete set null,
  profile_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger learning_profiles_set_updated_at
before update on public.learning_profiles
for each row execute function public.set_updated_at();

create index if not exists reading_sessions_student_id_idx
on public.reading_sessions(student_id);

create index if not exists responses_student_id_idx
on public.responses(student_id);

create index if not exists responses_reading_session_id_idx
on public.responses(reading_session_id);

create index if not exists learning_profiles_student_id_idx
on public.learning_profiles(student_id);

-- Sample data
insert into public.students (
  id,
  full_name,
  email,
  grade_level,
  native_language,
  reading_level,
  learning_goals
) values (
  '11111111-1111-1111-1111-111111111111',
  'Maya Chen',
  'maya.chen@example.com',
  'Grade 7',
  'Mandarin',
  'B1',
  'Improve inference questions and academic vocabulary.'
);

insert into public.reading_sessions (
  id,
  student_id,
  title,
  topic,
  passage_text,
  passage_level,
  support_level,
  completed_at
) values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Rainforests and Climate',
  'Science',
  'Rainforests store carbon, support biodiversity, and influence rainfall patterns across large regions.',
  'B1',
  'medium',
  now()
);

insert into public.responses (
  student_id,
  reading_session_id,
  question_text,
  answer_text,
  is_correct,
  score,
  ai_feedback,
  detected_weaknesses
) values (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Why are rainforests important for climate?',
  'They help store carbon and affect rain.',
  true,
  88.00,
  'Good answer. Add one more detail about biodiversity to make it stronger.',
  array['needs_more_supporting_detail']
);

insert into public.learning_profiles (
  student_id,
  current_reading_level,
  adaptive_support_level,
  strengths,
  current_needs,
  detected_weaknesses,
  recommended_focus,
  last_session_id,
  profile_summary
) values (
  '11111111-1111-1111-1111-111111111111',
  'B1',
  'medium',
  array['identifies main ideas', 'answers literal questions'],
  array['use textual evidence', 'explain cause and effect'],
  array['needs_more_supporting_detail', 'inference_questions'],
  'Practice short evidence-based answers with one quote or detail from the passage.',
  '22222222-2222-2222-2222-222222222222',
  'Maya understands the main idea but needs support adding evidence and explaining inferences.'
);
