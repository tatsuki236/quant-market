import type { LucideIcon } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

/** DB から取得した生の商品行 */
export type ProductRow = Tables<"products">;

/** フロントエンドで使用する商品型（icon 解決済み） */
export type Product = Omit<ProductRow, "icon_name"> & {
  icon: LucideIcon;
  seller_display_name?: string | null;
};
