-- Finish actionable performance advisor items after hardening.

drop policy if exists "Buyers read own tickets" on tickets;
drop policy if exists "Staff can read assigned event tickets" on tickets;

create policy "Buyers and staff read allowed tickets" on tickets
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = tickets.order_id
        and ((select auth.uid()) = o.user_id or lower(o.buyer_email) = lower((select email from auth.users where id = auth.uid())))
    )
    or exists (
      select 1 from event_staff s
      where s.event_id = tickets.event_id
        and s.user_id = (select auth.uid())
    )
  );

create index if not exists idx_audit_logs_actor_id on audit_logs (actor_id);
