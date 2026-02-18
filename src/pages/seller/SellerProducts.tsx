import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useSellerProducts, useDeleteProduct } from "@/hooks/use-seller-products";
import { useToast } from "@/hooks/use-toast";

const SellerProducts = () => {
  const { data: products = [], isLoading } = useSellerProducts();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`「${name}」を削除しますか？この操作は元に戻せません。`)) return;

    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: "商品を削除しました" });
    } catch {
      toast({ title: "削除に失敗しました", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">商品管理</h1>
            <Button variant="hero" asChild>
              <Link to="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                新しい商品を出品
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">まだ商品が登録されていません。</p>
              <Button variant="hero" asChild>
                <Link to="/seller/products/new">最初の商品を出品する</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      {product.is_published ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-success/10 text-success">掲載中</span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-500">審査中</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.platform} / {product.market} — ¥{product.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/seller/products/${product.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default SellerProducts;
