-- ============================================================
-- Phase 3: 購入者Auth対応
-- ============================================================

-- customers.auth_user_id にFK追加（auth.users参照）
-- NULLの場合はゲスト購入
ALTER TABLE public.customers
  ADD CONSTRAINT fk_customers_auth_user_id
  FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 認証済みユーザーが自分の顧客情報を閲覧可能
CREATE POLICY "Customers can read own profile" ON public.customers
  FOR SELECT TO authenticated
  USING (auth.uid() = auth_user_id);

-- 認証済みユーザーが自分の顧客情報を更新可能
CREATE POLICY "Customers can update own profile" ON public.customers
  FOR UPDATE TO authenticated
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- 認証済みユーザーが自分の注文を閲覧可能
CREATE POLICY "Customers can read own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
    )
  );

-- 認証済みユーザーが自分のorder_itemsを閲覧可能
CREATE POLICY "Customers can read own order_items" ON public.order_items
  FOR SELECT TO authenticated
  USING (
    order_id IN (
      SELECT order_id FROM public.orders
      WHERE customer_id IN (
        SELECT id FROM public.customers WHERE auth_user_id = auth.uid()
      )
    )
  );
