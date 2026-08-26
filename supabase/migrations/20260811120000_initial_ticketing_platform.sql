create extension if not exists pgcrypto;

create type event_status as enum ('draft','published','sold_out','cancelled');
create type batch_status as enum ('draft','scheduled','available','sold_out','closed');
create type payment_status as enum ('pending','approved','rejected','cancelled','refunded','chargeback');
create type order_status as enum ('open','paid','cancelled','expired');
create type ticket_status as enum ('valid','used','cancelled','refunded');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'buyer' check (role in ('buyer','staff','admin')),
  created_at timestamptz not null default now()
);

create table events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id),
  organizer_name text,
  title text not null,
  slug text not null unique,
  description text not null,
  category text not null,
  cover_url text,
  mobile_cover_url text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  venue_name text,
  address text,
  city text,
  state text,
  latitude numeric,
  longitude numeric,
  age_rating text,
  status event_status not null default 'draft',
  visibility text not null default 'public' check (visibility in ('public','private')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ticket_types (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table ticket_batches (
  id uuid primary key default gen_random_uuid(),
  ticket_type_id uuid not null references ticket_types(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null check (price >= 0),
  quantity integer not null check (quantity >= 0),
  quantity_sold integer not null default 0 check (quantity_sold >= 0),
  sales_start timestamptz not null,
  sales_end timestamptz not null,
  max_per_order integer not null default 6,
  status batch_status not null default 'draft',
  created_at timestamptz not null default now(),
  check (quantity_sold <= quantity)
);

create table coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value numeric(12,2) not null check (discount_value >= 0),
  max_uses integer,
  starts_at timestamptz,
  ends_at timestamptz,
  event_id uuid references events(id) on delete cascade,
  allowed_ticket_type_ids uuid[],
  used_count integer not null default 0,
  active boolean not null default true
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  event_id uuid not null references events(id),
  buyer_name text not null,
  buyer_email text not null,
  buyer_cpf text,
  buyer_phone text,
  subtotal numeric(12,2) not null default 0,
  discount numeric(12,2) not null default 0,
  fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  coupon_id uuid references coupons(id),
  payment_status payment_status not null default 'pending',
  status order_status not null default 'open',
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  ticket_batch_id uuid not null references ticket_batches(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null,
  total numeric(12,2) not null
);

create table attendees (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  name text not null,
  email text,
  cpf text
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  event_id uuid not null references events(id),
  ticket_batch_id uuid not null references ticket_batches(id),
  attendee_id uuid references attendees(id),
  code text not null unique,
  token text not null unique default encode(gen_random_bytes(32), 'hex'),
  status ticket_status not null default 'valid',
  checked_in boolean not null default false,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text not null default 'mercadopago',
  provider_payment_id text,
  provider_preference_id text,
  amount numeric(12,2) not null,
  status payment_status not null default 'pending',
  payment_method text,
  raw_status jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table ticket_reservations (
  id uuid primary key default gen_random_uuid(),
  ticket_batch_id uuid not null references ticket_batches(id) on delete cascade,
  order_id uuid references orders(id) on delete cascade,
  quantity integer not null check (quantity > 0),
  expires_at timestamptz not null,
  status text not null default 'active' check (status in ('active','confirmed','expired','cancelled')),
  created_at timestamptz not null default now()
);

create table coupon_uses (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references coupons(id),
  order_id uuid not null references orders(id),
  created_at timestamptz not null default now(),
  unique (coupon_id, order_id)
);

create table checkins (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references tickets(id),
  event_id uuid not null references events(id),
  checked_in_by uuid references profiles(id),
  checked_in_at timestamptz not null default now(),
  device_info jsonb
);

create unique index one_successful_checkin_per_ticket on checkins(ticket_id);
create index idx_events_slug on events(slug);
create index idx_orders_buyer_email on orders(lower(buyer_email));
create index idx_reservations_active on ticket_reservations(ticket_batch_id, expires_at) where status = 'active';

create table event_staff (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  role text not null default 'staff',
  unique(event_id, user_id)
);

create table audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create or replace function available_quantity(batch_id uuid)
returns integer
language sql
stable
as $$
  select greatest(0, tb.quantity - tb.quantity_sold - coalesce(sum(tr.quantity) filter (where tr.status = 'active' and tr.expires_at > now()), 0))::integer
  from ticket_batches tb
  left join ticket_reservations tr on tr.ticket_batch_id = tb.id
  where tb.id = batch_id
  group by tb.id;
$$;

create or replace function reserve_tickets(batch_id uuid, order_id uuid, requested integer)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation_id uuid;
  available integer;
begin
  perform 1 from ticket_batches where id = batch_id for update;
  select available_quantity(batch_id) into available;
  if available < requested then
    raise exception 'insufficient_stock';
  end if;
  insert into ticket_reservations(ticket_batch_id, order_id, quantity, expires_at)
  values (batch_id, order_id, requested, now() + interval '10 minutes')
  returning id into reservation_id;
  return reservation_id;
end;
$$;
revoke all on function reserve_tickets(uuid, uuid, integer) from public;

create or replace function confirm_order_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
  i integer;
begin
  update orders set payment_status = 'approved', status = 'paid' where id = p_order_id and payment_status <> 'approved';
  for item in select * from order_items where order_id = p_order_id loop
    perform 1 from ticket_batches where id = item.ticket_batch_id for update;
    update ticket_batches set quantity_sold = quantity_sold + item.quantity where id = item.ticket_batch_id and quantity_sold + item.quantity <= quantity;
    update ticket_reservations set status = 'confirmed' where order_id = p_order_id and ticket_batch_id = item.ticket_batch_id and status = 'active';
    for i in 1..item.quantity loop
      insert into tickets(order_id, event_id, ticket_batch_id, code)
      select p_order_id, o.event_id, item.ticket_batch_id, upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 5) || '-' || substr(encode(gen_random_bytes(5), 'hex'), 1, 5))
      from orders o where o.id = p_order_id;
    end loop;
  end loop;
end;
$$;
revoke all on function confirm_order_paid(uuid) from public;

create or replace function perform_checkin(ticket_token text, device jsonb default '{}'::jsonb)
returns tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  ticket_row tickets;
begin
  select * into ticket_row from tickets where token = ticket_token for update;
  if not found then raise exception 'ticket_not_found'; end if;
  if ticket_row.status <> 'valid' then raise exception 'ticket_not_valid'; end if;
  if ticket_row.checked_in then raise exception 'ticket_already_used'; end if;
  update tickets set checked_in = true, status = 'used' where id = ticket_row.id returning * into ticket_row;
  insert into checkins(ticket_id, event_id, checked_in_by, device_info) values (ticket_row.id, ticket_row.event_id, auth.uid(), device);
  return ticket_row;
end;
$$;
revoke all on function perform_checkin(text, jsonb) from public;
grant execute on function perform_checkin(text, jsonb) to authenticated;

alter table profiles enable row level security;
alter table events enable row level security;
alter table ticket_types enable row level security;
alter table ticket_batches enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table attendees enable row level security;
alter table tickets enable row level security;
alter table payments enable row level security;
alter table coupons enable row level security;
alter table coupon_uses enable row level security;
alter table ticket_reservations enable row level security;
alter table checkins enable row level security;
alter table event_staff enable row level security;
alter table audit_logs enable row level security;

grant usage on schema public to anon, authenticated;
grant select on events, ticket_types, ticket_batches to anon, authenticated;
grant select, insert, update on orders, order_items, attendees to authenticated;
grant select on tickets to authenticated;

create policy "Public can read published events" on events for select to anon, authenticated using (status = 'published' and visibility = 'public');
create policy "Public can read public ticket types" on ticket_types for select to anon, authenticated using (exists (select 1 from events e where e.id = event_id and e.status = 'published'));
create policy "Public can read public batches" on ticket_batches for select to anon, authenticated using (exists (select 1 from ticket_types tt join events e on e.id = tt.event_id where tt.id = ticket_type_id and e.status = 'published'));
create policy "Buyers read own orders" on orders for select to authenticated using ((select auth.uid()) = user_id or lower(buyer_email) = lower((select email from auth.users where id = auth.uid())));
create policy "Buyers create own orders" on orders for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Buyers read own order items" on order_items for select to authenticated using (exists (select 1 from orders o where o.id = order_id and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))));
create policy "Buyers read own tickets" on tickets for select to authenticated using (exists (select 1 from orders o where o.id = order_id and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))));
create policy "Staff can read assigned event tickets" on tickets for select to authenticated using (exists (select 1 from event_staff s where s.event_id = tickets.event_id and s.user_id = (select auth.uid())));
