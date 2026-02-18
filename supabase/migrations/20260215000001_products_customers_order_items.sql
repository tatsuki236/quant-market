-- ============================================================
-- Phase 1: products, customers, order_items テーブル作成
-- ============================================================

-- ============ products テーブル ============
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  platform TEXT NOT NULL,
  market TEXT NOT NULL CHECK (market IN ('FX', '株式', '仮想通貨')),
  category TEXT NOT NULL DEFAULT 'indicator',
  icon_name TEXT NOT NULL DEFAULT 'TrendingUp',
  image TEXT NOT NULL DEFAULT '/placeholder.svg',
  features TEXT[] NOT NULL DEFAULT '{}',
  full_description TEXT,
  technical_logic TEXT,
  indicators TEXT[] DEFAULT '{}',
  market_condition TEXT,
  backtest_info TEXT,
  detail_features TEXT[] DEFAULT '{}',
  seller_id UUID,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_market ON public.products(market);
CREATE INDEX idx_products_platform ON public.products(platform);
CREATE INDEX idx_products_is_published ON public.products(is_published);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published products" ON public.products
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Service role has full access to products" ON public.products
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ customers テーブル ============
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_customers_email ON public.customers(email);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to customers" ON public.customers
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anonymous can create customers" ON public.customers
  FOR INSERT TO anon WITH CHECK (
    email IS NOT NULL
    AND email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ orders テーブル拡張 ============
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

-- ============ order_items テーブル ============
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES public.orders(order_id),
  product_id UUID NOT NULL REFERENCES public.products(id),
  product_slug TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role has full access to order_items" ON public.order_items
  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Anonymous can create order_items" ON public.order_items
  FOR INSERT TO anon WITH CHECK (true);

-- ============ シードデータ（6商品） ============
INSERT INTO public.products (slug, name, description, price, platform, market, category, icon_name, image, features, full_description, technical_logic, indicators, market_condition, backtest_info, detail_features, sort_order)
VALUES
  (
    'trend-master-pro',
    'トレンドマスター Pro',
    '複数の移動平均線を組み合わせた高精度トレンド判定インジケータ。トレンドの強さと方向性を視覚的に表示し、エントリーポイントを明確化します。',
    12800,
    'MT4/MT5',
    'FX',
    'indicator',
    'TrendingUp',
    '/placeholder.svg',
    ARRAY['移動平均', 'トレンド分析', '売買シグナル'],
    'トレンドマスター Proは、短期・中期・長期の移動平均線を独自のアルゴリズムで組み合わせ、トレンドの強さと方向性を視覚的に表示するテクニカルインジケータです。ゴールデンクロス・デッドクロスの判定に加え、トレンドの継続性を数値化することで、より精度の高いエントリーポイントの判断を支援します。',
    '短期（5期間）、中期（21期間）、長期（89期間）の指数移動平均（EMA）を使用。3本の移動平均線の位置関係とその傾きから、トレンドの強さを0-100のスコアで表示します。',
    ARRAY['移動平均（EMA）', 'トレンド強度スコア', 'クロスシグナル'],
    'トレンド相場に最適。レンジ相場ではシグナルが頻発する可能性があるため、他のオシレーター系指標との併用を推奨します。',
    '過去5年間のEUR/USD 4時間足でのバックテストを実施。バックテスト結果は参考値であり、将来の成績を保証するものではありません。',
    ARRAY['エントリーシグナル表示', 'トレンド強度メーター', 'アラート機能', 'マルチ通貨対応'],
    1
  ),
  (
    'rsi-divergence-detector',
    'RSI ダイバージェンス検出',
    'RSIのダイバージェンスを自動検出し、反転シグナルをチャート上に表示。オシレーター系分析の精度向上に貢献します。',
    8500,
    'TradingView',
    '株式',
    'indicator',
    'LineChart',
    '/placeholder.svg',
    ARRAY['RSI', 'ダイバージェンス', '反転シグナル'],
    'RSI ダイバージェンス検出は、価格とRSIの乖離（ダイバージェンス）を自動で検出し、チャート上にマーキングするインジケータです。強気ダイバージェンスと弱気ダイバージェンスを区別して表示し、トレンド反転の可能性を事前に察知できます。',
    '14期間のRSIを基準に、価格の高値・安値とRSIの高値・安値を比較。ダイバージェンスが検出された場合、チャート上に自動でラインとアイコンを描画します。',
    ARRAY['RSI（14期間）', 'ダイバージェンスライン', '反転シグナル'],
    'トレンドの終盤やレンジ相場での反転ポイント検出に有効。強いトレンド中は偽シグナルが発生する可能性があるため、トレンド判定と併用してください。',
    '日経225先物の日足データで検証。ダイバージェンス発生後の反転確率は過去データに基づく参考値です。',
    ARRAY['自動ダイバージェンス検出', '強気/弱気の区別表示', 'アラート通知', 'カスタマイズ可能'],
    2
  ),
  (
    'multi-timeframe-analyzer',
    'マルチタイムフレーム分析',
    '複数時間軸を同時に分析し、エントリータイミングを最適化。上位足と下位足の相関を可視化します。',
    15000,
    'MT5',
    'FX',
    'indicator',
    'BarChart3',
    '/placeholder.svg',
    ARRAY['マルチタイムフレーム', '相関分析', 'エントリー最適化'],
    NULL, NULL, '{}', NULL, NULL, '{}',
    3
  ),
  (
    'volatility-scanner',
    'ボラティリティスキャナー',
    '相場のボラティリティを数値化し、トレードチャンスを自動検出。ATRベースの分析で相場の活況度を判定します。',
    9800,
    'MT4',
    '仮想通貨',
    'indicator',
    'Activity',
    '/placeholder.svg',
    ARRAY['ボラティリティ', 'ATR', 'チャンス検出'],
    NULL, NULL, '{}', NULL, NULL, '{}',
    4
  ),
  (
    'bollinger-breakout',
    'ボリンジャーブレイクアウト',
    'ボリンジャーバンドのブレイクアウトを検出し、アラート通知。レンジ相場からトレンドへの転換を捉えます。',
    7800,
    'TradingView',
    '株式',
    'indicator',
    'Zap',
    '/placeholder.svg',
    ARRAY['ボリンジャーバンド', 'ブレイクアウト', 'アラート'],
    NULL, NULL, '{}', NULL, NULL, '{}',
    5
  ),
  (
    'support-resistance-auto',
    'サポレジ自動描画',
    'サポートラインとレジスタンスラインを自動で描画。過去の高値・安値を分析し、重要な価格帯を可視化します。',
    6500,
    'MT4/MT5',
    'FX',
    'indicator',
    'Target',
    '/placeholder.svg',
    ARRAY['サポートライン', 'レジスタンス', '自動描画'],
    NULL, NULL, '{}', NULL, NULL, '{}',
    6
  );
