import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type ProductRow = Tables<"products">;
type SellerRow = Tables<"sellers">;

// 全商品取得（出品者名付き）
export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, sellers(display_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as (ProductRow & { sellers: { display_name: string } | null })[];
    },
  });
}

// 商品承認: is_published=true, status='販売中'
export function useApproveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_published: true, status: "販売中" })
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// 商品非承認: is_published=false, status='非承認'
export function useRejectProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("products")
        .update({ is_published: false, status: "非承認" })
        .eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

// 全出品者取得
export function useAdminSellers() {
  return useQuery({
    queryKey: ["admin-sellers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sellers")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as SellerRow[];
    },
  });
}

// 出品者更新（is_approved / is_active 切替）
export function useUpdateSeller() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      is_approved,
      is_active,
    }: {
      id: string;
      is_approved?: boolean;
      is_active?: boolean;
    }) => {
      const updates: Record<string, boolean> = {};
      if (is_approved !== undefined) updates.is_approved = is_approved;
      if (is_active !== undefined) updates.is_active = is_active;

      const { error } = await supabase
        .from("sellers")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-sellers"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

// 統計データ
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [productsRes, sellersRes, ordersRes] = await Promise.all([
        supabase.from("products").select("id, status", { count: "exact" }),
        supabase.from("sellers").select("id", { count: "exact" }),
        supabase.from("orders").select("id", { count: "exact" }),
      ]);

      const products = productsRes.data ?? [];
      const pendingCount = products.filter((p) => p.status === "審査中").length;

      return {
        totalProducts: productsRes.count ?? 0,
        pendingProducts: pendingCount,
        totalSellers: sellersRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
      };
    },
  });
}
