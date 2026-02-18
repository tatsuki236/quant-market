import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type ProductRow = Tables<"products">;
type ProductInsert = TablesInsert<"products">;
type ProductUpdate = TablesUpdate<"products">;

export function useSellerProducts() {
  const { seller } = useAuth();

  return useQuery({
    queryKey: ["seller-products", seller?.id],
    queryFn: async () => {
      if (!seller) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", seller.id)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as ProductRow[];
    },
    enabled: !!seller,
  });
}

export function useSellerProduct(productId: string | undefined) {
  const { seller } = useAuth();

  return useQuery({
    queryKey: ["seller-product", productId],
    queryFn: async () => {
      if (!seller || !productId) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .eq("seller_id", seller.id)
        .maybeSingle();
      if (error) throw error;
      return data as ProductRow | null;
    },
    enabled: !!seller && !!productId,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { seller } = useAuth();

  return useMutation({
    mutationFn: async (product: Omit<ProductInsert, "seller_id">) => {
      if (!seller) throw new Error("出品者情報が見つかりません");
      const { data, error } = await supabase
        .from("products")
        .insert({ ...product, seller_id: seller.id, is_published: false })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: ProductUpdate & { id: string }) => {
      // Sellers cannot change is_published — admin only
      const { is_published, ...safeUpdates } = updates;
      const { data, error } = await supabase
        .from("products")
        .update(safeUpdates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}
