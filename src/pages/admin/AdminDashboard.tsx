import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Package, Users, ShoppingCart, Clock, ShieldCheck } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useAdminStats } from "@/hooks/use-admin";

const AdminDashboard = () => {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">管理者ダッシュボード</h1>
              <p className="text-muted-foreground">商品審査・出品者管理</p>
            </div>
          </div>

          {/* 商品・出品者統計 */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">商品・審査</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">全商品数</p>
                </div>
                <p className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalProducts ?? 0}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-amber-500">審査待ち</p>
                </div>
                <p className="text-3xl font-bold text-amber-500">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.pendingProducts ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">ユーザー・取引</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">出品者数</p>
                </div>
                <p className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalSellers ?? 0}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">注文数</p>
                </div>
                <p className="text-3xl font-bold">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.totalOrders ?? 0}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                  <p className="text-sm text-amber-500">振込入金待ち</p>
                </div>
                <p className="text-3xl font-bold text-amber-500">
                  {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats?.pendingBankOrders ?? 0}
                </p>
              </div>
            </div>
          </div>

          {/* メニュー */}
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">メニュー</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              to="/admin/products"
              className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">商品審査管理</h3>
                <p className="text-sm text-muted-foreground">商品の承認・非承認を管理</p>
              </div>
            </Link>
            <Link
              to="/admin/sellers"
              className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">出品者管理</h3>
                <p className="text-sm text-muted-foreground">出品者の承認・有効化を管理</p>
              </div>
            </Link>
            <Link
              to="/admin/orders"
              className="group flex items-center gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-primary transition-colors">注文管理</h3>
                <p className="text-sm text-muted-foreground">注文の確認・入金ステータス管理</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
