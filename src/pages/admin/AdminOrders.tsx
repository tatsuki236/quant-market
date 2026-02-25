import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, X, CreditCard, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/use-admin";
import { useToast } from "@/components/ui/use-toast";

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
  completed: "bg-green-500/10 text-green-500 border-green-500/30",
  failed: "bg-red-500/10 text-red-500 border-red-500/30",
  cancelled: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "入金待ち",
  completed: "決済完了",
  failed: "決済失敗",
  cancelled: "キャンセル",
};

const paymentMethodLabels: Record<string, string> = {
  card: "カード",
  bank_transfer: "銀行振込",
};

type FilterTab = "全て" | "pending" | "completed" | "failed";

const AdminOrders = () => {
  const [filter, setFilter] = useState<FilterTab>("全て");
  const { data: orders = [], isLoading } = useAdminOrders();
  const updateStatus = useUpdateOrderStatus();
  const { toast } = useToast();

  const filtered =
    filter === "全て"
      ? orders
      : orders.filter((o) => o.payment_status === filter);

  const handleConfirmPayment = async (id: string, orderIdStr: string) => {
    try {
      await updateStatus.mutateAsync({ orderId: id, status: "completed" });
      toast({ title: "入金確認しました", description: `注文 ${orderIdStr} を決済完了にしました` });
    } catch {
      toast({ title: "エラー", description: "ステータス更新に失敗しました", variant: "destructive" });
    }
  };

  const handleCancel = async (id: string, orderIdStr: string) => {
    try {
      await updateStatus.mutateAsync({ orderId: id, status: "cancelled" });
      toast({ title: "キャンセルしました", description: `注文 ${orderIdStr} をキャンセルしました` });
    } catch {
      toast({ title: "エラー", description: "ステータス更新に失敗しました", variant: "destructive" });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-2xl font-bold">注文管理</h1>
          </div>

          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterTab)} className="mb-6">
            <TabsList>
              <TabsTrigger value="全て">全て ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">入金待ち ({orders.filter(o => o.payment_status === "pending").length})</TabsTrigger>
              <TabsTrigger value="completed">決済完了 ({orders.filter(o => o.payment_status === "completed").length})</TabsTrigger>
              <TabsTrigger value="failed">決済失敗 ({orders.filter(o => o.payment_status === "failed").length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              該当する注文はありません
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => {
                const isBankPending =
                  order.payment_method === "bank_transfer" &&
                  order.payment_status === "pending";

                return (
                  <div
                    key={order.id}
                    className="rounded-xl bg-card border border-border overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="font-semibold text-sm">
                          {order.order_id}
                        </h3>
                        <Badge
                          variant="outline"
                          className={paymentStatusColors[order.payment_status] ?? ""}
                        >
                          {paymentStatusLabels[order.payment_status] ?? order.payment_status}
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          {order.payment_method === "bank_transfer" ? (
                            <Building2 className="h-3 w-3" />
                          ) : (
                            <CreditCard className="h-3 w-3" />
                          )}
                          {paymentMethodLabels[order.payment_method] ?? order.payment_method}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium mb-1">
                        {order.product_name}
                        <span className="ml-2 text-primary font-bold">
                          ¥{order.price.toLocaleString()}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_name} ({order.customer_email})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    {isBankPending && (
                      <div className="flex items-center justify-end gap-2 px-4 py-3 bg-muted/30 border-t border-border">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-green-500/30 text-green-500 hover:bg-green-500/10"
                          onClick={() => handleConfirmPayment(order.id, order.order_id)}
                          disabled={updateStatus.isPending}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          入金確認
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                          onClick={() => handleCancel(order.id, order.order_id)}
                          disabled={updateStatus.isPending}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          キャンセル
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminOrders;
