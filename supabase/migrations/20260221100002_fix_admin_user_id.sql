-- 管理者フラグ: 正しい auth_user_id で設定
UPDATE public.sellers
SET is_admin = true
WHERE auth_user_id = 'd0c05684-8278-4fa3-bdde-825295db5f94';
