create table if not exists bookings (
  id               text primary key,
  name             text not null,
  phone            text not null,
  email            text,
  vehicle_type     text not null,
  vehicle_model    text,
  vehicle_category text not null,
  package_id       text,
  alacarte         text[] not null default '{}',
  services         text[] not null default '{}',
  address          text not null,
  booking_date     date not null,
  booking_time     text not null,
  notes            text,
  amount           integer not null,
  payment_method   text not null default 'onsite',
  paid             boolean not null default false,
  paid_at          timestamptz,
  created_at       timestamptz not null default now()
);

create table if not exists enquiries (
  id         text primary key,
  name       text not null,
  phone      text not null,
  email      text,
  message    text not null,
  created_at timestamptz not null default now()
);

-- Safe migration for databases created with the earlier schema.
alter table bookings add column if not exists vehicle_model text;
alter table bookings add column if not exists payment_method text not null default 'onsite';

create index if not exists bookings_created_at_idx on bookings (created_at desc);
create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
