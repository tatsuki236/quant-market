import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SellerRevenue {
  totalSales: number;
  totalFee: number;
  totalPayout: number;
}

export function useSellerRevenue() {
  const { seller } = useAuth();

  return useQuery({
    queryKey: ["seller-revenue", seller?.id],
    queryFn: async (): Promise<SellerRevenue> => {
      if (!seller) return { totalSales: 0, totalFee: 0, totalPayout: 0 };

      // order_items から自分の売上を取得し、対応する orders が completed のものだけ集計
      const { data, error } = await supabase
        .from("order_items")
        .select("price, platform_fee, seller_amount, order_id, orders!inner(payment_status)")
        .eq("seller_id", seller.id);

      if (error) throw error;

      let totalSales = 0;
      let totalFee = 0;
      let totalPayout = 0;

      for (const item of data ?? []) {
        // orders!inner で join した結果の payment_status を確認
        const order = item.orders as unknown as { payment_status: string };
        if (order?.payment_status !== "completed") continue;

        totalSales += item.price;
        totalFee += item.platform_fee ?? 0;
        totalPayout += item.seller_amount ?? 0;
      }

      return { totalSales, totalFee, totalPayout };
    },
    enabled: !!seller,
  });
}
