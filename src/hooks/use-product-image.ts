import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const BUCKET = "product-images";

export function useProductImage() {
  const { seller } = useAuth();

  const uploadProductImage = async (file: File, slug: string): Promise<string> => {
    if (!seller) throw new Error("出品者情報が見つかりません");

    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${seller.auth_user_id}/${slug}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  };

  const deleteProductImage = async (url: string) => {
    // Extract path from public URL
    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return;
    const path = url.substring(idx + marker.length);

    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw error;
  };

  return { uploadProductImage, deleteProductImage };
}
