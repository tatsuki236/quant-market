-- テスト用: 商品にレビュー評価サンプルデータを設定
-- レビューレコードは挿入せず、products の集計カラムのみ更新

UPDATE products SET rating_average = 4.5, rating_count = 12
WHERE slug = 'trend-master-pro';

UPDATE products SET rating_average = 4.2, rating_count = 8
WHERE slug = 'rsi-divergence-detector';

UPDATE products SET rating_average = 3.8, rating_count = 5
WHERE slug = 'multi-timeframe-analyzer';

UPDATE products SET rating_average = 4.7, rating_count = 15
WHERE slug = 'volatility-scanner';

UPDATE products SET rating_average = 4.0, rating_count = 6
WHERE slug = 'bollinger-breakout';

UPDATE products SET rating_average = 4.3, rating_count = 9
WHERE slug = 'support-resistance-auto';

UPDATE products SET rating_average = 4.6, rating_count = 18
WHERE slug = 'blog-fx-scalping-strategy';

UPDATE products SET rating_average = 3.9, rating_count = 7
WHERE slug = 'blog-stock-indicator-guide';

UPDATE products SET rating_average = 4.1, rating_count = 11
WHERE slug = 'blog-crypto-risk-management';

UPDATE products SET rating_average = 4.8, rating_count = 22
WHERE slug = 'moving-average-basics';

UPDATE products SET rating_average = 4.4, rating_count = 10
WHERE slug = 'rsi-indicator-guide';

UPDATE products SET rating_average = 3.7, rating_count = 4
WHERE slug = 'macd-divergence';

UPDATE products SET rating_average = 4.0, rating_count = 6
WHERE slug = 'bollinger-bands-strategy';

UPDATE products SET rating_average = 4.5, rating_count = 14
WHERE slug = 'mt4-vs-mt5-comparison';

UPDATE products SET rating_average = 4.2, rating_count = 9
WHERE slug = 'crypto-indicator-tips';
