-- 電子書籍の商品画像を更新
UPDATE public.products
SET image = '/gold-ea-ebook.webp',
    updated_at = NOW()
WHERE slug = 'chatgpt-mql5-gold-nanpin-martin-ea';
