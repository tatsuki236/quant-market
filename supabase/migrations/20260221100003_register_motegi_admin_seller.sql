-- motegi@lex-er.co.jp (既存アカウント) を管理者 + 審査済み出品者に設定
UPDATE public.sellers
SET is_approved = true,
    is_active = true,
    is_admin = true
WHERE auth_user_id = 'd0c05684-8278-4fa3-bdde-825295db5f94';

-- signup で誤って作成された重複authユーザーを削除
DELETE FROM auth.users
WHERE id = '2906f1a7-c594-4144-adeb-43894a37d436';
