-- Admin order flow:
-- - authenticated buyers create orders and see only their own orders;
-- - admins can see every order in /admin/pedidos;
-- - tickets are generated only when an admin approves the order.

grant usage on schema public to anon, authenticated;
grant select on public.events, public.ticket_types, public.ticket_batches to anon, authenticated;
grant select, insert, update on public.orders, public.order_items, public.attendees to authenticated;
grant select on public.tickets to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "Admins read all orders" on public.orders;
create policy "Admins read all orders"
on public.orders
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
on public.orders
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins read all order_items" on public.order_items;
create policy "Admins read all order_items"
on public.order_items
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins read all attendees" on public.attendees;
create policy "Admins read all attendees"
on public.attendees
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins read all tickets" on public.tickets;
create policy "Admins read all tickets"
on public.tickets
for select
to authenticated
using (public.is_admin());

drop policy if exists "Users create attendees for own orders" on public.attendees;
create policy "Users create attendees for own orders"
on public.attendees
for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = attendees.order_id
      and orders.user_id = (select auth.uid())
  )
);

create or replace function public.confirm_order_paid(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item record;
  attendee_row record;
  i integer;
begin
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  update public.orders
  set payment_status = 'approved',
      status = 'paid'
  where id = p_order_id
    and payment_status <> 'approved';

  for item in
    select *
    from public.order_items
    where order_id = p_order_id
  loop
    perform 1
    from public.ticket_batches
    where id = item.ticket_batch_id
    for update;

    update public.ticket_batches
    set quantity_sold = quantity_sold + item.quantity
    where id = item.ticket_batch_id
      and quantity_sold + item.quantity <= quantity;

    update public.ticket_reservations
    set status = 'confirmed'
    where order_id = p_order_id
      and ticket_batch_id = item.ticket_batch_id
      and status = 'active';

    for i in 1..item.quantity loop
      select *
      into attendee_row
      from public.attendees
      where order_id = p_order_id
      order by created_at, id
      limit 1;

      insert into public.tickets(order_id, event_id, ticket_batch_id, attendee_id, code)
      select
        p_order_id,
        orders.event_id,
        item.ticket_batch_id,
        attendee_row.id,
        upper(substr(encode(gen_random_bytes(5), 'hex'), 1, 5) || '-' || substr(encode(gen_random_bytes(5), 'hex'), 1, 5))
      from public.orders
      where orders.id = p_order_id;
    end loop;
  end loop;
end;
$$;

revoke all on function public.confirm_order_paid(uuid) from public, anon, authenticated;
grant execute on function public.confirm_order_paid(uuid) to authenticated;

grant execute on function public.perform_checkin(text, jsonb) to authenticated;
