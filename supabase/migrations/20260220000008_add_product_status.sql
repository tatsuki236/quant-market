-- 商品ステータス列を追加
ALTER TABLE public.products
ADD COLUMN status TEXT NOT NULL DEFAULT '販売中';

-- 電子書籍を審査中に設定
UPDATE public.products
SET status = '審査中'
WHERE slug = 'chatgpt-mql5-gold-nanpin-martin-ea';
