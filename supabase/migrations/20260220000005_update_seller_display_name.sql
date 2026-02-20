-- 出品者表示名をAURO AIに変更
UPDATE public.sellers
SET display_name = 'AURO AI',
    updated_at = NOW()
WHERE auth_user_id = 'd0c05684-8278-4fa3-bdde-825295db5f94';
