-- ============================================================
-- 仮商品データ全削除（本番運用前）
-- ============================================================

DELETE FROM public.reviews;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.products;
