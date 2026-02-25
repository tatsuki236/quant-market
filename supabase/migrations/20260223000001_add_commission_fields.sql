-- order_items テーブルに販売手数料関連カラムを追加
ALTER TABLE order_items
  ADD COLUMN seller_id UUID REFERENCES sellers(id),
  ADD COLUMN platform_fee INTEGER DEFAULT 0,
  ADD COLUMN seller_amount INTEGER DEFAULT 0;

-- seller_id でフィルタする集計クエリ用インデックス
CREATE INDEX idx_order_items_seller_id ON order_items(seller_id);
