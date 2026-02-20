-- ============================================================
-- reviews テーブル・RLS・トリガー・RPC
-- ============================================================

-- 1. products テーブルに集計カラム追加
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS rating_average NUMERIC(2,1) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS rating_count   INTEGER      DEFAULT 0;

-- 2. reviews テーブル作成
CREATE TABLE IF NOT EXISTS public.reviews (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  customer_id  UUID        NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  auth_user_id UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating       SMALLINT    NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, customer_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_auth_user_id ON public.reviews(auth_user_id);

-- 3. RLS 有効化 + ポリシー
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 全員閲覧可
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT USING (true);

-- 購入者のみ投稿可（has_purchased_product RPCで判定）
CREATE POLICY "reviews_insert_purchaser" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = auth_user_id
    AND public.has_purchased_product(product_id)
  );

-- 自分のレビューのみ更新可
CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

-- 自分のレビューのみ削除可
CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE USING (auth.uid() = auth_user_id);

-- 4. トリガー関数: rating_average / rating_count 自動更新
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id UUID;
BEGIN
  -- DELETE の場合は OLD、それ以外は NEW
  IF TG_OP = 'DELETE' THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  UPDATE public.products
  SET
    rating_count   = (SELECT COUNT(*) FROM public.reviews WHERE product_id = target_product_id),
    rating_average = (SELECT ROUND(AVG(rating)::NUMERIC, 1) FROM public.reviews WHERE product_id = target_product_id),
    updated_at     = now()
  WHERE id = target_product_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_product_rating();

-- 5. updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION public.update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_reviews_updated_at();

-- 6. RPC: レビュー一覧 + 投稿者名を安全にJOIN
CREATE OR REPLACE FUNCTION public.get_product_reviews(p_product_id UUID)
RETURNS TABLE (
  id           UUID,
  product_id   UUID,
  customer_id  UUID,
  auth_user_id UUID,
  rating       SMALLINT,
  comment      TEXT,
  created_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ,
  reviewer_name TEXT
) AS $$
BEGIN
  RETURN QUERY
    SELECT
      r.id,
      r.product_id,
      r.customer_id,
      r.auth_user_id,
      r.rating,
      r.comment,
      r.created_at,
      r.updated_at,
      c.name AS reviewer_name
    FROM public.reviews r
    JOIN public.customers c ON c.id = r.customer_id
    WHERE r.product_id = p_product_id
    ORDER BY r.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
