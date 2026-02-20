-- ============================================================
-- 電子書籍: GOLDナンピンマーチンEAの作り方
-- ============================================================

INSERT INTO public.products (
  slug,
  name,
  description,
  price,
  platform,
  market,
  category,
  icon_name,
  image,
  features,
  full_description,
  free_content,
  paid_content,
  seller_id,
  is_published,
  sort_order
) VALUES (
  'chatgpt-mql5-gold-nanpin-martin-ea',
  '✨ChatGPTだけで作る！高度ロジック搭載 MQL5版 GOLDナンピンマーチンEAの作り方‼',
  'プログラミング未経験でもOK！ChatGPTを活用してMQL5でGOLD専用ナンピンマーチンEA（自動売買ツール）を自作する方法を徹底解説。高度なロジック搭載のEAをゼロから作れるようになります。',
  50000,
  'MT5',
  'FX',
  '有料記事',
  'BookOpen',
  '/placeholder.svg',
  ARRAY['ChatGPT活用', 'MQL5', 'EA自作', 'GOLD', 'ナンピンマーチン'],
  'ChatGPTを使って、プログラミング未経験の方でもMQL5でGOLD専用ナンピンマーチンEAを作成できる完全ガイドです。高度なロジックの実装方法からバックテストまで、EA開発の全工程を丁寧に解説します。',
  NULL,
  NULL,
  (SELECT id FROM public.sellers WHERE auth_user_id = 'd0c05684-8278-4fa3-bdde-825295db5f94'),
  true,
  1
);
