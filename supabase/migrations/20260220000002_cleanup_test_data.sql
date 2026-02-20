-- ============================================================
-- 本番移行前クリーンアップ
-- ============================================================

-- 1. テスト注文データ削除（サンドボックス時のテスト4件）
DELETE FROM public.order_items;
DELETE FROM public.orders;

-- 2. テスト顧客データ削除
DELETE FROM public.customers;

-- 3. レビューテストデータ削除（実レビューなし）
DELETE FROM public.reviews;

-- 4. products の rating を初期化（テスト用シードデータをリセット）
UPDATE public.products
SET rating_average = NULL, rating_count = 0;

-- 5. products の seller_id が null のものはそのまま（管理者投入商品）
-- 整合性確認: is_published が true で image が placeholder のままの商品を確認用にログ
-- （実害はないためデータ変更なし）

-- 完了
