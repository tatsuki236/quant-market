-- ============================================================
-- 出品者アカウント作成: motegi@lex-er.co.jp
-- ============================================================

-- 1. メール確認をスキップ（本番オーナーアカウント）
UPDATE auth.users
SET email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE id = 'd0c05684-8278-4fa3-bdde-825295db5f94';

-- 2. sellersレコード作成
INSERT INTO public.sellers (auth_user_id, name, display_name, email)
VALUES (
  'd0c05684-8278-4fa3-bdde-825295db5f94',
  'QuantMarket管理者',
  'QuantMarket',
  'motegi@lex-er.co.jp'
);
