-- Highlife Family Chapel International — database schema
-- Idempotent: safe to re-run (scripts/migrate.mjs executes this file).

create extension if not exists pgcrypto;

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists admins (
  id            bigserial primary key,
  email         text not null unique,
  name          text not null,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create table if not exists programs (
  id           bigserial primary key,
  title        text not null,
  slug         text not null unique,
  summary      text not null default '',
  body         text not null default '',
  category     text not null default 'ministry'
               check (category in ('ministry', 'service', 'group', 'outreach')),
  icon         text,
  meeting_day  text,
  meeting_time text,
  venue        text,
  cover_url    text,
  featured     boolean not null default false,
  published    boolean not null default true,
  sort_order   integer not null default 100,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists events (
  id         bigserial primary key,
  title      text not null,
  slug       text not null unique,
  summary    text not null default '',
  body       text not null default '',
  starts_at  timestamptz not null,
  ends_at    timestamptz,
  all_day    boolean not null default false,
  venue      text,
  cover_url  text,
  featured   boolean not null default false,
  published  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Content items (news, sermons, devotionals). A post can be attached to an
-- event or a program, which is how "content events" are grouped.
create table if not exists posts (
  id           bigserial primary key,
  title        text not null,
  slug         text not null unique,
  excerpt      text not null default '',
  body         text not null default '',
  kind         text not null default 'article'
               check (kind in ('article', 'announcement', 'sermon', 'devotional')),
  series       text,
  speaker      text,
  video_url    text,
  event_id     bigint references events(id) on delete set null,
  program_id   bigint references programs(id) on delete set null,
  cover_url    text,
  published    boolean not null default true,
  published_at timestamptz not null default now(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Added after the first release; harmless on a fresh database.
alter table posts add column if not exists series    text;
alter table posts add column if not exists speaker   text;
alter table posts add column if not exists video_url text;

create table if not exists media (
  id         bigserial primary key,
  url        text not null,
  alt        text not null default '',
  caption    text not null default '',
  album      text not null default 'general',
  sort_order integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id         bigserial primary key,
  name       text not null,
  email      text not null,
  phone      text not null default '',
  body       text not null,
  status     text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on events (starts_at);
create index if not exists events_published_idx on events (published);
create index if not exists programs_published_idx on programs (published, sort_order);
create index if not exists posts_published_idx on posts (published, published_at desc);
create index if not exists posts_event_idx on posts (event_id);
create index if not exists messages_status_idx on messages (status, created_at desc);

drop trigger if exists programs_updated on programs;
create trigger programs_updated before update on programs for each row execute function set_updated_at();
drop trigger if exists events_updated on events;
create trigger events_updated before update on events for each row execute function set_updated_at();
drop trigger if exists posts_updated on posts;
create trigger posts_updated before update on posts for each row execute function set_updated_at();
drop trigger if exists messages_updated on messages;
create trigger messages_updated before update on messages for each row execute function set_updated_at();
drop trigger if exists settings_updated on settings;
create trigger settings_updated before update on settings for each row execute function set_updated_at();
