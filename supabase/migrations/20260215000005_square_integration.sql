-- ============================================================
-- Phase 5: Square API連携強化
-- ============================================================

-- orders テーブルに Square 追跡用カラムを追加
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS square_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS square_payment_id TEXT;

CREATE INDEX idx_orders_square_order_id ON public.orders(square_order_id)
  WHERE square_order_id IS NOT NULL;

-- PurchaseComplete ページでのステータス確認用
-- anon/authenticated が order_id を知っていれば payment_status を確認可能
CREATE POLICY "Anyone can read order by order_id" ON public.orders
  FOR SELECT TO anon, authenticated USING (true);
