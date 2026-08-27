-- ======================================================
-- ORDERS: Compra somente para usuários autenticados
-- ======================================================

DROP POLICY IF EXISTS "Guests create orders without user_id" ON public.orders;
DROP POLICY IF EXISTS "Buyers read own orders" ON public.orders;
DROP POLICY IF EXISTS "Authenticated users create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users create own orders" ON public.orders;
DROP POLICY IF EXISTS "Users read own orders" ON public.orders;

CREATE POLICY "Users create own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users read own orders"
ON public.orders
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = user_id);

-- ======================================================
-- ORDER ITEMS: Itens somente do próprio pedido
-- ======================================================

DROP POLICY IF EXISTS "Guests create order items for guest orders" ON public.order_items;
DROP POLICY IF EXISTS "Users create order items for own orders" ON public.order_items;
DROP POLICY IF EXISTS "Buyers read own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users read own order items" ON public.order_items;

CREATE POLICY "Users create order items for own orders"
ON public.order_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
  )
);

CREATE POLICY "Users read own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders
    WHERE orders.id = order_items.order_id
      AND orders.user_id = (SELECT auth.uid())
  )
);

-- ======================================================
-- Revogar INSERT do anon nas tabelas de pedidos
-- ======================================================
REVOKE INSERT ON public.orders FROM anon;
REVOKE INSERT ON public.order_items FROM anon;
