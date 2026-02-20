import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Package, LogOut, FileText, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MyPage = () => {
  const { user, signOut } = useAuth();

  // 顧客ID取得
  const { data: customer } = useQuery({
    queryKey: ["my-customer", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // 購入履歴
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["my-orders", customer?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customer!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!customer,
  });

  // 購入済み電子書籍
  const { data: purchasedArticles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["my-purchased-articles", customer?.id],
    queryFn: async () => {
      // 決済完了の注文から order_items を取得
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("order_id")
        .eq("customer_id", customer!.id)
        .eq("payment_status", "completed");

      if (!completedOrders || completedOrders.length === 0) return [];

      const orderIds = completedOrders.map((o) => o.order_id);

      // order_items から購入した product_id を取得
      const { data: items } = await supabase
        .from("order_items")
        .select("product_id, product_name, created_at")
        .in("order_id", orderIds);

      if (!items || items.length === 0) return [];

      const productIds = [...new Set(items.map((i) => i.product_id))];

      // 電子書籍のみ取得
      const { data: articles } = await supabase
        .from("products")
        .select("id, slug, name, description, price, features, image, free_content, paid_content, created_at")
        .in("id", productIds)
        .eq("category", "有料記事");

      if (!articles) return [];

      // 購入日を付与
      return articles.map((article) => {
        const item = items.find((i) => i.product_id === article.id);
        return {
          ...article,
          purchased_at: item?.created_at ?? article.created_at,
        };
      });
    },
    enabled: !!customer,
  });

  const isLoading = ordersLoading || articlesLoading;

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-bold">マイページ</h1>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              ログアウト
            </Button>
          </div>

          {/* ユーザー情報 */}
          <div className="p-6 rounded-xl bg-card border border-border mb-8">
            <h2 className="text-lg font-semibold mb-4">アカウント情報</h2>
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">メールアドレス</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>

          {/* 購入済み電子書籍 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              購入済み記事
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : purchasedArticles.length === 0 ? (
              <div className="text-center py-10 rounded-xl bg-card border border-border">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">購入済みの記事はまだありません。</p>
                <Button variant="outline" asChild>
                  <Link to="/articles">電子書籍を探す</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {purchasedArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/products/${article.slug}`}
                    className="block p-3 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                          {article.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {article.description}
                        </p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-4 mt-1" />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {article.features?.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-auto">
                        購入日: {new Date(article.purchased_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 購入履歴 */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              購入履歴
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 rounded-xl bg-card border border-border">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">まだ購入履歴がありません。</p>
                <Button variant="hero" asChild>
                  <Link to="/products">商品を探す</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{order.product_name}</p>
                        <p className="text-xs text-muted-foreground">
                          注文ID: {order.order_id}
                        </p>
                      </div>
                      <span className="font-mono font-bold text-primary">
                        ¥{order.price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {order.payment_method === "card" ? "カード決済" : "銀行振込"}
                      </span>
                      <span>
                        {order.payment_status === "completed" && "決済完了"}
                        {order.payment_status === "pending" && "入金待ち"}
                        {order.payment_status === "failed" && "決済失敗"}
                      </span>
                      <span>
                        {new Date(order.created_at).toLocaleDateString("ja-JP")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MyPage;
