-- ============================================================
-- Phase 4: RLSポリシー修正 + customer upsert RPC関数
-- ============================================================

-- ====== 1. Customer Upsert RPC関数 ======
-- SECURITY DEFINER でRLSをバイパスし、anon/authenticated どちらからも
-- 安全にcustomerの検索・作成・紐付けを行う
CREATE OR REPLACE FUNCTION public.upsert_customer(
  p_email TEXT,
  p_name TEXT,
  p_auth_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_existing_auth UUID;
BEGIN
  -- メールバリデーション
  IF p_email IS NULL OR p_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;

  -- 既存顧客を検索
  SELECT id, auth_user_id INTO v_id, v_existing_auth
  FROM public.customers
  WHERE email = p_email;

  IF v_id IS NOT NULL THEN
    -- 既存顧客: auth_user_idが未設定なら紐付け
    IF p_auth_user_id IS NOT NULL AND v_existing_auth IS NULL THEN
      UPDATE public.customers
      SET auth_user_id = p_auth_user_id, name = p_name, updated_at = now()
      WHERE id = v_id;
    END IF;
    RETURN v_id;
  ELSE
    -- 新規顧客
    INSERT INTO public.customers (email, name, auth_user_id)
    VALUES (p_email, p_name, p_auth_user_id)
    RETURNING id INTO v_id;
    RETURN v_id;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.upsert_customer TO anon, authenticated;

-- ====== 2. authenticated ユーザー用 INSERT ポリシー ======
-- ログイン済みユーザーが銀行振込で注文する場合に必要

-- orders: 認証済みユーザーの注文作成を許可
CREATE POLICY "Authenticated can create orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);

-- order_items: 認証済みユーザーの注文明細作成を許可
CREATE POLICY "Authenticated can create order_items" ON public.order_items
  FOR INSERT TO authenticated WITH CHECK (true);
