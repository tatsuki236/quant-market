-- =============================================
-- 全問題修正マイグレーション
-- =============================================

-- ============================================
-- 1. sellers に is_admin カラム追加（未適用だった admin_setup の内容）
-- ============================================
ALTER TABLE public.sellers
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false;

-- is_admin() ヘルパー関数
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

-- Admin RLS ポリシー（既存なら何もしない）
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_read_all_products' AND tablename = 'products') THEN
    CREATE POLICY "admin_read_all_products"
      ON public.products FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_update_all_products' AND tablename = 'products') THEN
    CREATE POLICY "admin_update_all_products"
      ON public.products FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_read_all_sellers' AND tablename = 'sellers') THEN
    CREATE POLICY "admin_read_all_sellers"
      ON public.sellers FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_update_all_sellers' AND tablename = 'sellers') THEN
    CREATE POLICY "admin_update_all_sellers"
      ON public.sellers FOR UPDATE
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'admin_read_all_orders' AND tablename = 'orders') THEN
    CREATE POLICY "admin_read_all_orders"
      ON public.orders FOR SELECT
      USING (public.is_admin());
  END IF;
END $$;

-- 既存の出品者アカウントを管理者に設定
UPDATE public.sellers
SET is_admin = true
WHERE auth_user_id = 'd0c05684-b183-4571-ae23-541e0e283b9b';

-- ============================================
-- 2. sellers テーブルの匿名読み取りポリシー追加
--    （商品一覧で出品者名を表示するため）
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'anon_read_sellers_display' AND tablename = 'sellers') THEN
    CREATE POLICY "anon_read_sellers_display"
      ON public.sellers FOR SELECT TO anon
      USING (true);
  END IF;
END $$;

-- authenticated ユーザーも他の出品者の display_name を読めるようにする
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'authenticated_read_all_sellers' AND tablename = 'sellers') THEN
    CREATE POLICY "authenticated_read_all_sellers"
      ON public.sellers FOR SELECT TO authenticated
      USING (true);
  END IF;
END $$;

-- ============================================
-- 3. 商品ステータス不整合の修正
--    審査中なら is_published = false にする
-- ============================================
UPDATE public.products
SET is_published = false
WHERE status = '審査中' AND is_published = true;

-- ============================================
-- 4. テスト顧客データの削除
-- ============================================
DELETE FROM public.customers WHERE email = 'test@test.com';
