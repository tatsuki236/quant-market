import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, User, Plus, Loader2, ShieldCheck, TrendingUp, Receipt, Wallet } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSellerProducts } from "@/hooks/use-seller-products";
import { useSellerRevenue } from "@/hooks/use-seller-revenue";

const SellerDashboard = () => {
  const { seller, isAdmin } = useAuth();
  const { data: products = [], isLoading } = useSellerProducts();
  const { data: revenue, isLoading: isRevenueLoading } = useSellerRevenue();

  const publishedCount = products.filter((p) => p.is_published).length;

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

          {/* 承認ステータス */}
          <div className="p-4 rounded-xl bg-card border border-border mb-6 flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">承認ステータス:</span>
            {seller?.is_approved ? (
              <span className="text-sm font-semibold text-success">承認済み</span>
            ) : (
              <span className="text-sm font-semibold text-yellow-500">審査中</span>
            )}
          </div>

          {/* 商品統計 */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">商品</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">登録商品数</p>
                </div>
                <p className="text-2xl font-bold">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : products.length}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">公開中</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : publishedCount}
                </p>
              </div>
            </div>
          </div>

          {/* 収益統計 */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">収益</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">売上合計</p>
                </div>
                <p className="text-2xl font-bold">
                  {isRevenueLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `¥${(revenue?.totalSales ?? 0).toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4 text-destructive" />
                  <p className="text-xs text-muted-foreground">手数料</p>
                </div>
                <p className="text-2xl font-bold text-destructive">
                  {isRevenueLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `-¥${(revenue?.totalFee ?? 0).toLocaleString()}`
                  )}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-primary/30">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <p className="text-xs text-muted-foreground">受取額</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {isRevenueLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    `¥${(revenue?.totalPayout ?? 0).toLocaleString()}`
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* クイックアクション */}
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">メニュー</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-primary/30 hover:border-primary/50 transition-all md:col-span-2"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">管理者ダッシュボード</h3>
                  <p className="text-sm text-muted-foreground">商品審査・出品者管理</p>
                </div>
              </Link>
            )}
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
