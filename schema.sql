create table if not exists bookings (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  vehicle_type text not null,
  vehicle_model text,
  vehicle_category text not null,
  package_id text,
  alacarte text[] not null default '{}',
  services text[] not null default '{}',
  address text not null,
  place_id text,
  latitude double precision,
  longitude double precision,
  booking_date date not null,
  booking_time text not null,
  slot_id text,
  notes text,
  amount integer not null,
  payment_method text not null default 'onsite',
  booking_status text not null default 'received',
  distance_from_base_km numeric(6,1),
  travel_minutes_from_previous integer,
  travel_minutes_to_next integer,
  location_status text not null default 'within_area',
  paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists enquiries (
  id text primary key,
  name text not null,
  phone text not null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists blocked_slots (
  id text primary key,
  blocked_date date not null,
  slot_id text not null,
  reason text not null default 'Unavailable',
  created_at timestamptz not null default now(),
  unique (blocked_date, slot_id)
);

alter table bookings add column if not exists vehicle_model text;
alter table bookings add column if not exists payment_method text not null default 'onsite';
alter table bookings add column if not exists place_id text;
alter table bookings add column if not exists latitude double precision;
alter table bookings add column if not exists longitude double precision;
alter table bookings add column if not exists slot_id text;
alter table bookings add column if not exists booking_status text not null default 'received';
alter table bookings add column if not exists distance_from_base_km numeric(6,1);
alter table bookings add column if not exists travel_minutes_from_previous integer;
alter table bookings add column if not exists travel_minutes_to_next integer;
alter table bookings add column if not exists location_status text not null default 'within_area';

-- Convert old package IDs without changing past booking prices.
update bookings set package_id = 'complete' where package_id in ('standard', 'premium');

create index if not exists bookings_created_at_idx on bookings (created_at desc);
create index if not exists bookings_date_idx on bookings (booking_date, slot_id);
create index if not exists enquiries_created_at_idx on enquiries (created_at desc);
create unique index if not exists bookings_active_slot_unique
  on bookings (booking_date, slot_id)
  where slot_id is not null and coalesce(booking_status, 'received') <> 'cancelled';

-- Separate customer-entered house details from the navigable map point.
alter table bookings add column if not exists map_address text;
alter table bookings add column if not exists landmark text;

-- Preserve old bookings and make map_address required only at application level.
update bookings set map_address = address where map_address is null and address is not null;


-- Multi-vehicle, group offer and Vehicle Care Visit metadata.
alter table bookings add column if not exists vehicle_count integer not null default 1;
alter table bookings add column if not exists vehicles jsonb not null default '[]'::jsonb;
alter table bookings add column if not exists service_type text not null default 'complete';
alter table bookings add column if not exists group_offer boolean not null default false;
alter table bookings add column if not exists group_location_mode text;
alter table bookings add column if not exists care_details jsonb;
