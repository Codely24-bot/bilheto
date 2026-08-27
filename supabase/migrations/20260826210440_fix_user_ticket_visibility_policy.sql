drop policy if exists "Buyers and staff read allowed tickets" on public.tickets;

create policy "Buyers and staff read allowed tickets"
on public.tickets
for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = tickets.order_id
      and (
        orders.user_id = (select auth.uid())
        or lower(orders.buyer_email) = lower((select public.current_user_email()))
      )
  )
  or exists (
    select 1
    from public.event_staff
    where event_staff.event_id = tickets.event_id
      and event_staff.user_id = (select auth.uid())
  )
);
