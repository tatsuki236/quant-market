import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, User, Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSellerProducts } from "@/hooks/use-seller-products";

const SellerDashboard = () => {
  const { seller } = useAuth();
  const { data: products = [], isLoading } = useSellerProducts();

  const publishedCount = products.filter((p) => p.is_published).length;
  const totalRevenue = 0; // TODO: 売上集計は将来実装

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">出品者ダッシュボード</h1>
              <p className="text-muted-foreground">
                ようこそ、{seller?.display_name ?? "出品者"}さん
              </p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/seller/products/new">
                <Plus className="mr-2 h-4 w-4" />
                新しい商品を出品
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">登録商品数</p>
              <p className="text-3xl font-bold">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : products.length}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">公開中</p>
              <p className="text-3xl font-bold text-primary">
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : publishedCount}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground mb-1">承認ステータス</p>
              <p className="text-lg font-semibold">
                {seller?.is_approved ? (
                  <span className="text-success">承認済み</span>
                ) : (
                  <span className="text-yellow-500">審査中</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/seller/products"
              className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">商品管理</h3>
                <p className="text-sm text-muted-foreground">商品の追加・編集・削除</p>
              </div>
            </Link>
            <Link
              to="/seller/profile"
              className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">プロフィール設定</h3>
                <p className="text-sm text-muted-foreground">表示名・振込先情報の管理</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SellerDashboard;
