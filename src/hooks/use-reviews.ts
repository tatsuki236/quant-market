import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { ReviewWithReviewer } from "@/types/review";

/** レビュー一覧取得（RPC経由） */
export function useReviews(productId: string | undefined) {
  return useQuery<ReviewWithReviewer[]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_product_reviews", {
        p_product_id: productId!,
      });
      if (error) throw error;
      return (data ?? []) as ReviewWithReviewer[];
    },
    enabled: !!productId,
  });
}

/** 自分のレビュー取得 */
export function useMyReview(productId: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-review", productId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId!)
        .eq("auth_user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!productId && !!user,
  });
}

/** レビュー投稿 */
export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      product_id: string;
      customer_id: string;
      auth_user_id: string;
      rating: number;
      comment?: string;
    }) => {
      const { data, error } = await supabase
        .from("reviews")
        .insert(params)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["my-review", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

/** レビュー更新 */
export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: string;
      product_id: string;
      rating: number;
      comment?: string | null;
    }) => {
      const { id, product_id, ...updates } = params;
      const { data, error } = await supabase
        .from("reviews")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["my-review", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}

/** レビュー削除 */
export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: string; product_id: string }) => {
      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", params.id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["my-review", variables.product_id] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product"] });
    },
  });
}
