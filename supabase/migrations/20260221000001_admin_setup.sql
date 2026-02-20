-- =============================================
-- 管理者ダッシュボード: DBマイグレーション
-- =============================================

-- 1. sellers に is_admin カラム追加
ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- 2. is_admin() ヘルパー関数
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.sellers WHERE auth_user_id = auth.uid()),
    false
  );
$$;

-- 3. RLS ポリシー追加

-- Admin can read all products（未公開含む）
CREATE POLICY "admin_read_all_products"
  ON public.products FOR SELECT
  USING (public.is_admin());

-- Admin can update all products（承認/非承認）
CREATE POLICY "admin_update_all_products"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin can read all sellers
CREATE POLICY "admin_read_all_sellers"
  ON public.sellers FOR SELECT
  USING (public.is_admin());

-- Admin can update all sellers（承認/無効化）
CREATE POLICY "admin_update_all_sellers"
  ON public.sellers FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Admin can read all orders（統計用）
CREATE POLICY "admin_read_all_orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

-- 4. 既存アカウントを管理者に設定
UPDATE public.sellers
SET is_admin = true
WHERE auth_user_id = 'd0c05684-b183-4571-ae23-541e0e283b9b';
