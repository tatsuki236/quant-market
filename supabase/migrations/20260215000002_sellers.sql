-- ============================================================
-- Phase 2: sellers テーブル + RLS + 出品者用ポリシー
-- ============================================================

CREATE TABLE public.sellers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  bank_name TEXT,
  bank_branch TEXT,
  bank_account_type TEXT CHECK (bank_account_type IN ('普通', '当座')),
  bank_account_number TEXT,
  bank_account_holder TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sellers_auth_user_id ON public.sellers(auth_user_id);
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;

-- Service role has full access
CREATE POLICY "Service role has full access to sellers" ON public.sellers
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Authenticated users can read their own seller profile
CREATE POLICY "Sellers can read own profile" ON public.sellers
  FOR SELECT TO authenticated USING (auth.uid() = auth_user_id);

-- Authenticated users can update their own seller profile
CREATE POLICY "Sellers can update own profile" ON public.sellers
  FOR UPDATE TO authenticated USING (auth.uid() = auth_user_id) WITH CHECK (auth.uid() = auth_user_id);

-- Authenticated users can create their own seller profile
CREATE POLICY "Sellers can create own profile" ON public.sellers
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = auth_user_id);

-- Add FK from products to sellers
ALTER TABLE public.products
  ADD CONSTRAINT fk_products_seller_id FOREIGN KEY (seller_id) REFERENCES public.sellers(id);

-- Seller can manage own products
CREATE POLICY "Sellers can manage own products" ON public.products
  FOR ALL TO authenticated
  USING (seller_id IN (SELECT id FROM public.sellers WHERE auth_user_id = auth.uid()))
  WITH CHECK (seller_id IN (SELECT id FROM public.sellers WHERE auth_user_id = auth.uid()));

-- Updated_at trigger for sellers
CREATE TRIGGER update_sellers_updated_at BEFORE UPDATE ON public.sellers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
