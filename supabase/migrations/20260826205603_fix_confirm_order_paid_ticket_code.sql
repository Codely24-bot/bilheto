alter table public.tickets
alter column token set default (
  md5(random()::text || clock_timestamp()::text)
  || md5(clock_timestamp()::text || random()::text)
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
  ticket_code text;
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

  if not found then
    return;
  end if;

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

    if not found then
      raise exception 'insufficient_stock';
    end if;

    update public.ticket_reservations
    set status = 'confirmed'
    where order_id = p_order_id
      and ticket_batch_id = item.ticket_batch_id
      and status = 'active';

    select *
    into attendee_row
    from public.attendees
    where order_id = p_order_id
    order by id
    limit 1;

    for i in 1..item.quantity loop
      loop
        ticket_code := upper(
          substr(md5(random()::text || clock_timestamp()::text || p_order_id::text || item.ticket_batch_id::text || i::text), 1, 5)
          || '-'
          || substr(md5(clock_timestamp()::text || random()::text || item.ticket_batch_id::text || p_order_id::text), 1, 5)
        );

        exit when not exists (
          select 1
          from public.tickets
          where code = ticket_code
        );
      end loop;

      insert into public.tickets(order_id, event_id, ticket_batch_id, attendee_id, code)
      select
        p_order_id,
        orders.event_id,
        item.ticket_batch_id,
        attendee_row.id,
        ticket_code
      from public.orders
      where orders.id = p_order_id;
    end loop;
  end loop;
end;
$$;

revoke all on function public.confirm_order_paid(uuid) from public, anon, authenticated;
grant execute on function public.confirm_order_paid(uuid) to authenticated;
