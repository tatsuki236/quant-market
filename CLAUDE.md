# CLAUDE.md

このファイルは、Claude Code（claude.ai/code）がこのリポジトリのコードを扱う際のガイダンスを提供します。

## プロジェクト概要

QuantMarket（QuantTrader Hub）は、トレーディングインジケーター（FX、株式、暗号通貨）の日本語マーケットプレイスです。MT4、MT5、TradingView向けのデジタル商品を販売しています。Lovable.devで構築されています。

## コマンド

- `npm run dev` — 開発サーバー起動（ポート8080）
- `npm run build` — 本番ビルド
- `npm run lint` — ESLint実行
- `npm run test` — テスト一括実行（`vitest run`）
- `npm run test:watch` — テストをウォッチモードで実行
- `npx vitest run src/path/to/file.test.ts` — 単一テストファイルの実行

## 技術スタック

- **フレームワーク**: React 18 + TypeScript + Vite（SWCプラグイン）
- **スタイリング**: Tailwind CSS 3、CSS変数によるテーミング（ライト/ダーク）
- **UIコンポーネント**: shadcn/ui（Radixプリミティブ） — `components.json`で設定
- **ルーティング**: react-router-dom v6（BrowserRouter）
- **データ取得**: @tanstack/react-query
- **フォーム**: react-hook-form + zodバリデーション
- **バックエンド**: Supabase（Postgres DB、Deno経由のEdge Functions）
- **決済**: Square API（Supabase Edge Function `create-square-payment`経由）
- **テスト**: Vitest + jsdom + @testing-library/react

## アーキテクチャ

### パスエイリアス
`@/`は`./src/`にマッピング（tsconfigとviteで設定）。

### プロバイダー階層
`main.tsx`がアプリをラップ: `ThemeProvider` → `AuthProvider` → `CartProvider` → `QueryClientProvider` → `TooltipProvider` → `BrowserRouter`。テーマは`src/hooks/use-theme.tsx`のカスタムコンテキスト（next-themesではない）。認証は`src/contexts/AuthContext.tsx`のSupabase Auth管理。

### ルーティング（App.tsx）
全ルートは`App.tsx`でフラットに定義。ページコンポーネントは`src/pages/`に配置。主要ルートグループ:
- `/products`, `/products/:slug` — 商品カタログ＆詳細
- `/checkout`, `/purchase/complete` — 購入フロー
- `/indicators`, `/indicators/:category` — インジケーター閲覧
- `/seller/*` — 出品者管理（ProtectedRoute + requireSeller）
- `/account/*` — 購入者アカウント（ProtectedRoute）
- 法的ページ: `/terms`, `/privacy`, `/disclaimer`, `/law`

### レイアウトパターン
ページは`src/components/layout/Layout.tsx`の`<Layout>`を使用し、Header + main + Footerを提供。ホームページセクションは`src/components/home/`に配置。

### Supabase連携
- クライアント: `src/integrations/supabase/client.ts`（`.env`の`VITE_SUPABASE_URL`と`VITE_SUPABASE_PUBLISHABLE_KEY`を使用）
- 型定義: `src/integrations/supabase/types.ts`（手動管理、products/customers/orders/order_items/sellersテーブル）
- データベーステーブル（すべてRLS有効）:
  - `products` — 商品マスター（slug, icon_name等。フロントは`useProducts()`フックで取得）
  - `customers` — 購入者（ゲスト+認証ユーザー）
  - `orders` — 注文（customer_id FK付き）
  - `order_items` — 注文明細（product_id FK付き）
  - `sellers` — 出品者プロフィール（auth_user_id FK付き）
- Edge Function: `supabase/functions/create-square-payment/index.ts`
- Auth: Supabase Authでメール/パスワード認証（出品者・購入者共用）

### 商品データ
商品はSupabase `products`テーブルに保存。フロントエンドでは:
- `src/hooks/use-products.ts` — React Queryフック: `useProducts()`, `useProductsByMarket()`, `useProduct(slug)`
- `src/types/product.ts` — フロントエンド用Product型（icon解決済み）
- `src/lib/icon-map.ts` — DB上の`icon_name`文字列をLucideIconコンポーネントに変換

### 決済フロー
1. カートベースのチェックアウト（`/checkout`）。customer upsert + order_items作成
2. カード決済: `create-square-payment` Edge Functionを呼び出し → Squareチェックアウトにリダイレクト → `/purchase/complete`に戻る
3. 銀行振込: Supabaseクライアント経由で注文を直接挿入 → `/purchase/complete`に遷移

### テーミング
カスタム`ThemeProvider`が`<html>`の`light`/`dark`クラスを切り替え。CSS変数は`src/index.css`で両テーマ用に定義。トレーディング専用カラー: `chart-bullish`, `chart-bearish`, `chart-neutral`。カスタムユーティリティクラス: `.section-container`, `.card-glow`, `.text-gradient-primary`, `.text-gradient-accent`。

### TypeScript設定
`strictNullChecks`と`noImplicitAny`は**オフ**。`noUnusedLocals`と`noUnusedParameters`もオフ。ESLintも`@typescript-eslint/no-unused-vars`を無効化。

## 規約

- **すべての応答・回答は必ず日本語で行うこと**
- ユーザー向けテキストはすべて日本語
- 通貨はJPY（日本円）、`¥`プレフィックスと`toLocaleString()`でフォーマット
- アイコン: lucide-react
- トースト通知: デュアルシステム — `@/components/ui/toaster`（Radix）と`sonner`の両方をマウント
- shadcn/uiコンポーネントは`src/components/ui/`に配置、`npx shadcn-ui@latest add <component>`で追加すること
