-- Allow guest checkout: orders + order_items RLS fixes
-- Problem: "Buyers create own orders" requires auth.uid() = user_id,
-- but guest checkouts send user_id = NULL, causing RLS violation.

-- 1. Grant anon insert on orders and order_items (guest checkout uses anon key)
grant insert on orders to anon;
grant insert on order_items to anon;

-- 2. Replace the orders INSERT policy to allow both authenticated and guest
drop policy if exists "Buyers create own orders" on orders;

create policy "Authenticated users create own orders" on orders
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Guests create orders without user_id" on orders
  for insert to anon
  with check (user_id is null);

-- 3. Add INSERT policy for order_items (missing in original schema)
--    Allows insert when the parent order belongs to the user or is a guest order
create policy "Users create order items for own orders" on order_items
  for insert to authenticated
  with check (
    exists (
      select 1 from orders o
      where o.id = order_id
        and (select auth.uid()) = o.user_id
    )
  );

create policy "Guests create order items for guest orders" on order_items
  for insert to anon
  with check (
    exists (
      select 1 from orders o
      where o.id = order_id
        and o.user_id is null
    )
  );
