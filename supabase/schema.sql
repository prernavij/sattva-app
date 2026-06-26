-- Sattva — Supabase / Postgres schema
-- Run this in the Supabase SQL editor after creating your project

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists profiles (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null default 'Friend',
  age         int,
  sex         text check (sex in ('male', 'female')),
  height_cm   numeric,
  weight_lbs  numeric,
  activity_level text check (activity_level in ('sedentary','light','moderate','active','very_active')),
  goal        text check (goal in ('lose','maintain','build')),
  track       jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Daily goals (calculated from profile)
create table if not exists daily_goals (
  id              uuid primary key default uuid_generate_v4(),
  profile_id      uuid references profiles(id) on delete cascade,
  cal_goal        int,
  protein_goal    int,
  water_goal_l    numeric,
  sleep_goal_h    numeric,
  workout_goal_week int,
  created_at      timestamptz default now()
);

-- Food logs
create table if not exists food_logs (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade,
  logged_at   timestamptz default now(),
  food_name   text not null,
  meal_type   text check (meal_type in ('breakfast','lunch','snack','dinner')),
  kcal        int,
  protein_g   numeric,
  notes       text
);

-- Water logs
create table if not exists water_logs (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade,
  logged_at   timestamptz default now(),
  amount_ml   int not null,
  source_unit text
);

-- Sleep logs
create table if not exists sleep_logs (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade,
  date        date default current_date,
  bedtime     time,
  wake_time   time,
  duration_h  numeric,
  quality     text check (quality in ('deep','good','okay','poor'))
);

-- Activity logs
create table if not exists activity_logs (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid references profiles(id) on delete cascade,
  logged_at     timestamptz default now(),
  activity_type text not null,
  duration_min  int,
  intensity     text check (intensity in ('easy','moderate','hard')),
  kcal_burned   int,
  notes         text
);

-- Body logs
create table if not exists body_logs (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references profiles(id) on delete cascade,
  logged_at   timestamptz default now(),
  weight_lbs  numeric,
  waist_in    numeric,
  chest_in    numeric,
  hips_in     numeric,
  arms_in     numeric
);

-- Notification settings
create table if not exists notification_settings (
  profile_id        uuid primary key references profiles(id) on delete cascade,
  master_on         boolean default false,
  breakfast_on      boolean default true,
  breakfast_time    time default '08:00',
  lunch_on          boolean default true,
  lunch_time        time default '13:00',
  snack_on          boolean default false,
  snack_time        time default '16:00',
  dinner_on         boolean default true,
  dinner_time       time default '19:30',
  water_on          boolean default true,
  bedtime_on        boolean default true,
  bedtime_time      time default '22:30',
  activity_nudge_on boolean default true
);

-- Indexes
create index if not exists food_logs_profile_date on food_logs(profile_id, logged_at);
create index if not exists water_logs_profile_date on water_logs(profile_id, logged_at);
create index if not exists sleep_logs_profile_date on sleep_logs(profile_id, date);
create index if not exists activity_logs_profile_date on activity_logs(profile_id, logged_at);
create index if not exists body_logs_profile_date on body_logs(profile_id, logged_at);

-- RLS (Row Level Security) — enable after adding auth
-- alter table profiles enable row level security;
-- alter table food_logs enable row level security;
-- (etc.)
