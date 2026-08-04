-- Run this once against your new Neon database before first deploy.
-- Easiest way: open the Neon dashboard -> SQL Editor -> paste this -> Run.

create table if not exists bookings (
  id             text primary key,
  name           text not null,
  phone          text not null,
  email          text,
  vehicle_type   text not null,
  vehicle_category text not null,      -- 'car' or 'heavy'
  package_id     text,                 -- 'standard' | 'premium' | null (heavy vehicles)
  alacarte       text[] not null default '{}',
  services       text[] not null default '{}',
  address        text not null,
  booking_date   date not null,
  booking_time   text not null,
  notes          text,
  amount         integer not null,
  paid           boolean not null default false,
  paid_at        timestamptz,
  created_at     timestamptz not null default now()
);

create table if not exists enquiries (
  id         text primary key,
  name       text not null,
  phone      text not null,
  email      text,
  message    text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on bookings (created_at desc);
create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
