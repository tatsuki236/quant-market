import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { resolveIcon } from "@/lib/icon-map";
import type { ProductRow, Product } from "@/types/product";

function toProduct(row: Record<string, unknown>): Product {
  const { icon_name, sellers, ...rest } = row;
  return {
    ...rest,
    icon: resolveIcon(icon_name),
    seller_display_name: sellers?.display_name ?? null,
  };
}

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, sellers(display_name)")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(toProduct);
}

async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*, sellers(display_name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw error;
  return data ? toProduct(data) : null;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
}

export function useProductsByMarket(market: string) {
  return useQuery({
    queryKey: ["products", "market", market],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter((p) => p.market === market);
    },
  });
}

export function useProductsByCategory(category: string) {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      const products = await fetchProducts();
      return products.filter((p) => p.category === category);
    },
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });
}
