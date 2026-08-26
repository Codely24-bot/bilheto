-- Harden public API access, complete RLS policies, and add FK indexes.

create or replace function available_quantity(batch_id uuid)
returns integer
language sql
stable
set search_path = public
as $$
  select greatest(0, tb.quantity - tb.quantity_sold - coalesce(sum(tr.quantity) filter (where tr.status = 'active' and tr.expires_at > now()), 0))::integer
  from ticket_batches tb
  left join ticket_reservations tr on tr.ticket_batch_id = tb.id
  where tb.id = batch_id
  group by tb.id;
$$;

revoke all on function reserve_tickets(uuid, uuid, integer) from public, anon, authenticated;
revoke all on function confirm_order_paid(uuid) from public, anon, authenticated;
revoke all on function perform_checkin(text, jsonb) from public, anon, authenticated;
grant execute on function reserve_tickets(uuid, uuid, integer) to service_role;
grant execute on function confirm_order_paid(uuid) to service_role;
grant execute on function perform_checkin(text, jsonb) to service_role;

grant select on coupons to anon, authenticated;
grant select on profiles, attendees, payments, coupon_uses, checkins, event_staff to authenticated;
grant insert, update on profiles to authenticated;
grant insert on checkins to authenticated;

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.email
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.profiles.full_name, excluded.full_name);

  return new;
end;
$$;

revoke all on function handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create policy "Users can read own profile" on profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create own profile" on profiles
  for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update own profile" on profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Public can read active coupons" on coupons
  for select to anon, authenticated
  using (
    active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

create policy "Buyers read own attendees" on attendees
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = attendees.order_id
        and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))
    )
  );

create policy "Buyers read own payments" on payments
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = payments.order_id
        and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))
    )
  );

create policy "Buyers read own coupon uses" on coupon_uses
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = coupon_uses.order_id
        and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))
    )
  );

create policy "Staff read assigned event staff rows" on event_staff
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Staff read assigned event checkins" on checkins
  for select to authenticated
  using (
    exists (
      select 1 from event_staff s
      where s.event_id = checkins.event_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "Staff create assigned event checkins" on checkins
  for insert to authenticated
  with check (
    checked_in_by = (select auth.uid())
    and exists (
      select 1 from event_staff s
      where s.event_id = checkins.event_id
        and s.user_id = (select auth.uid())
    )
  );

create policy "No direct audit log access" on audit_logs
  for select to authenticated
  using (false);

create policy "No direct reservation access" on ticket_reservations
  for select to authenticated
  using (false);

create index if not exists idx_profiles_email on profiles (lower(email));
create index if not exists idx_events_organizer_id on events (organizer_id);
create index if not exists idx_ticket_types_event_id on ticket_types (event_id);
create index if not exists idx_ticket_batches_ticket_type_id on ticket_batches (ticket_type_id);
create index if not exists idx_coupons_event_id on coupons (event_id);
create index if not exists idx_orders_user_id on orders (user_id);
create index if not exists idx_orders_event_id on orders (event_id);
create index if not exists idx_orders_coupon_id on orders (coupon_id);
create index if not exists idx_order_items_order_id on order_items (order_id);
create index if not exists idx_order_items_ticket_batch_id on order_items (ticket_batch_id);
create index if not exists idx_attendees_order_id on attendees (order_id);
create index if not exists idx_tickets_order_id on tickets (order_id);
create index if not exists idx_tickets_event_id on tickets (event_id);
create index if not exists idx_tickets_ticket_batch_id on tickets (ticket_batch_id);
create index if not exists idx_tickets_attendee_id on tickets (attendee_id);
create index if not exists idx_payments_order_id on payments (order_id);
create unique index if not exists idx_payments_provider_payment_id on payments (provider_payment_id) where provider_payment_id is not null;
create index if not exists idx_ticket_reservations_order_id on ticket_reservations (order_id);
create index if not exists idx_coupon_uses_order_id on coupon_uses (order_id);
create index if not exists idx_coupon_uses_coupon_id on coupon_uses (coupon_id);
create index if not exists idx_checkins_event_id on checkins (event_id);
create index if not exists idx_checkins_checked_in_by on checkins (checked_in_by);
create index if not exists idx_event_staff_user_id on event_staff (user_id);
