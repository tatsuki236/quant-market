-- AURO AI 商品を公開状態に変更 + ステータス修正
UPDATE public.products
SET is_published = true,
    status = '審査中',
    updated_at = NOW()
WHERE slug = 'AURO-AI';
