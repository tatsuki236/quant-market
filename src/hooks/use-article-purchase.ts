import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useHasPurchased(productId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["has-purchased", productId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("has_purchased_product", {
        p_product_id: productId!,
      });
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user && !!productId,
  });
}
