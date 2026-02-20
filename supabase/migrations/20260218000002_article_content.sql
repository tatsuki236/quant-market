-- 有料記事ペイウォール機能: free_content / paid_content カラム追加
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS free_content TEXT,
  ADD COLUMN IF NOT EXISTS paid_content TEXT;

-- market の CHECK 制約に「その他」を追加（既存制約があれば削除して再作成）
DO $$
BEGIN
  -- 既存の market CHECK 制約を探して削除
  IF EXISTS (
    SELECT 1 FROM information_schema.constraint_column_usage
    WHERE table_name = 'products' AND column_name = 'market'
      AND constraint_name IN (
        SELECT constraint_name FROM information_schema.table_constraints
        WHERE table_name = 'products' AND constraint_type = 'CHECK'
      )
  ) THEN
    EXECUTE (
      SELECT 'ALTER TABLE public.products DROP CONSTRAINT ' || constraint_name
      FROM information_schema.constraint_column_usage ccu
      JOIN information_schema.table_constraints tc USING (constraint_name, table_schema)
      WHERE ccu.table_name = 'products' AND ccu.column_name = 'market'
        AND tc.constraint_type = 'CHECK'
      LIMIT 1
    );
  END IF;
END $$;

ALTER TABLE public.products
  ADD CONSTRAINT products_market_check
  CHECK (market IN ('FX', '株式', '仮想通貨', 'その他'));

-- 購入確認用 RPC: 認証ユーザーが指定商品を購入済みか判定
CREATE OR REPLACE FUNCTION public.has_purchased_product(p_product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM order_items oi
    JOIN orders o ON o.order_id = oi.order_id
    JOIN customers c ON c.id = o.customer_id
    WHERE oi.product_id = p_product_id
      AND c.auth_user_id = auth.uid()
      AND o.payment_status = 'completed'
  );
END;
$$;
