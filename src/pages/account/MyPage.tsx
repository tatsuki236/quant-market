import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Package, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MyPage = () => {
  const { user, signOut } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      // customersテーブルからcustomer_idを取得
      const { data: customer } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_user_id", user!.id)
        .maybeSingle();

      if (!customer) return [];

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">マイページ</h1>
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

          {/* 購入履歴 */}
          <div>
            <h2 className="text-lg font-semibold mb-4">購入履歴</h2>

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
