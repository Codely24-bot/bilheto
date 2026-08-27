-- Fix: "permission denied for table users"
-- The anon role cannot access auth.users, but PostgreSQL evaluates ALL policies
-- on a table during INSERT (including SELECT policies). The SELECT policies on
-- orders/order_items/tickets reference auth.users, causing the error.
--
-- Solution: Create a security definer function to read user email safely,
-- then rewrite all policies to use it instead of querying auth.users directly.

-- 1. Helper function: runs as owner, bypasses RLS on auth.users
create or replace function public.current_user_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select email from auth.users where id = auth.uid();
$$;

revoke all on function public.current_user_email() from public, anon, authenticated;
grant execute on function public.current_user_email() to anon, authenticated;

-- 2. Rewrite orders SELECT policy (drop old + create new)
drop policy if exists "Buyers read own orders" on orders;
create policy "Buyers read own orders" on orders
  for select to authenticated
  using (
    (select auth.uid()) = user_id
    or lower(buyer_email) = lower((select public.current_user_email()))
  );

-- 3. Rewrite order_items SELECT policy
drop policy if exists "Buyers read own order items" on order_items;
create policy "Buyers read own order items" on order_items
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = order_id
        and (
          (select auth.uid()) = o.user_id
          or lower(o.buyer_email) = lower((select public.current_user_email()))
        )
    )
  );

-- 4. Rewrite tickets SELECT policy
drop policy if exists "Buyers read own tickets" on tickets;
create policy "Buyers read own tickets" on tickets
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = order_id
        and (
          (select auth.uid()) = o.user_id
          or lower(o.buyer_email) = lower((select public.current_user_email()))
        )
    )
  );

-- 5. Rewrite the attendees/payments/coupon_uses policies from hardening migration
--    These also reference auth.users indirectly through the same pattern
drop policy if exists "Buyers read own attendees" on attendees;
create policy "Buyers read own attendees" on attendees
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = attendees.order_id
        and (
          (select auth.uid()) = o.user_id
          or lower(o.buyer_email) = lower((select public.current_user_email()))
        )
    )
  );

drop policy if exists "Buyers read own payments" on payments;
create policy "Buyers read own payments" on payments
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = payments.order_id
        and (
          (select auth.uid()) = o.user_id
          or lower(o.buyer_email) = lower((select public.current_user_email()))
        )
    )
  );

drop policy if exists "Buyers read own coupon uses" on coupon_uses;
create policy "Buyers read own coupon uses" on coupon_uses
  for select to authenticated
  using (
    exists (
      select 1 from orders o
      where o.id = coupon_uses.order_id
        and (
          (select auth.uid()) = o.user_id
          or lower(o.buyer_email) = lower((select public.current_user_email()))
        )
    )
  );
