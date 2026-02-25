-- products テーブルに商品ごとの手数料率カラムを追加
ALTER TABLE products
  ADD COLUMN commission_rate NUMERIC(5,4) DEFAULT 0.20;

-- 手数料率は 0〜1 の範囲に制限
ALTER TABLE products
  ADD CONSTRAINT check_commission_rate
  CHECK (commission_rate >= 0 AND commission_rate <= 1);
