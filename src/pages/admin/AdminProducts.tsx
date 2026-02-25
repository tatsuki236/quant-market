import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Check, X, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAdminProducts, useApproveProduct, useRejectProduct, useUpdateCommissionRate } from "@/hooks/use-admin";
import { useToast } from "@/components/ui/use-toast";

const statusColors: Record<string, string> = {
  "審査中": "bg-amber-500/10 text-amber-500 border-amber-500/30",
  "販売中": "bg-green-500/10 text-green-500 border-green-500/30",
  "非承認": "bg-red-500/10 text-red-500 border-red-500/30",
};

const AdminProducts = () => {
  const [filter, setFilter] = useState("審査中");
  const { data: products = [], isLoading } = useAdminProducts();
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const updateCommissionRate = useUpdateCommissionRate();
  const { toast } = useToast();
  const [editingRate, setEditingRate] = useState<Record<string, string>>({});

  const filtered = filter === "全て"
    ? products
    : products.filter((p) => p.status === filter);

  const handleApprove = async (id: string, name: string) => {
    try {
      await approveProduct.mutateAsync(id);
      toast({ title: "承認しました", description: `「${name}」を公開しました` });
    } catch {
      toast({ title: "エラー", description: "承認に失敗しました", variant: "destructive" });
    }
  };

  const handleReject = async (id: string, name: string) => {
    try {
      await rejectProduct.mutateAsync(id);
      toast({ title: "非承認にしました", description: `「${name}」を非承認にしました` });
    } catch {
      toast({ title: "エラー", description: "非承認に失敗しました", variant: "destructive" });
    }
  };

  const handleSaveCommissionRate = async (id: string, name: string) => {
    const value = editingRate[id];
    if (value === undefined) return;
    const rate = parseFloat(value);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      toast({ title: "エラー", description: "手数料率は0〜100の範囲で入力してください", variant: "destructive" });
      return;
    }
    try {
      await updateCommissionRate.mutateAsync({ productId: id, commissionRate: rate / 100 });
      setEditingRate((prev) => { const next = { ...prev }; delete next[id]; return next; });
      toast({ title: "手数料率を更新しました", description: `「${name}」の手数料率を${rate}%に変更しました` });
    } catch {
      toast({ title: "エラー", description: "手数料率の更新に失敗しました", variant: "destructive" });
    }
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-2xl font-bold">商品審査管理</h1>
          </div>

          <Tabs value={filter} onValueChange={setFilter} className="mb-6">
            <TabsList>
              <TabsTrigger value="全て">全て ({products.length})</TabsTrigger>
              <TabsTrigger value="審査中">審査中 ({products.filter(p => p.status === "審査中").length})</TabsTrigger>
              <TabsTrigger value="販売中">販売中 ({products.filter(p => p.status === "販売中").length})</TabsTrigger>
              <TabsTrigger value="非承認">非承認 ({products.filter(p => p.status === "非承認").length})</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              該当する商品はありません
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((product) => {
                const currentRate = product.commission_rate ?? 0.20;
                const isEditing = editingRate[product.id] !== undefined;

                return (
                  <div
                    key={product.id}
                    className="rounded-xl bg-card border border-border overflow-hidden"
                  >
                    {/* 商品情報 */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <Badge variant="outline" className={statusColors[product.status] ?? ""}>
                          {product.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        出品者: {product.sellers?.display_name ?? "不明"} ・ ¥{product.price.toLocaleString()}
                      </p>
                    </div>

                    {/* 審査アクション + 手数料設定 */}
                    <div className="flex items-center justify-between gap-4 px-4 py-3 bg-muted/30 border-t border-border">
                      {/* 手数料率 */}
                      <div className="flex items-center gap-2">
                        <Percent className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={0}
                              max={100}
                              step={1}
                              value={editingRate[product.id]}
                              onChange={(e) => setEditingRate((prev) => ({ ...prev, [product.id]: e.target.value }))}
                              className="w-20 h-7 text-sm"
                            />
                            <span className="text-sm">%</span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleSaveCommissionRate(product.id, product.name)}
                              disabled={updateCommissionRate.isPending}
                            >
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => setEditingRate((prev) => { const next = { ...prev }; delete next[product.id]; return next; })}
                            >
                              取消
                            </Button>
                          </div>
                        ) : (
                          <button
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setEditingRate((prev) => ({ ...prev, [product.id]: String(Math.round(currentRate * 100)) }))}
                          >
                            手数料 <span className="font-medium text-foreground">{Math.round(currentRate * 100)}%</span>
                          </button>
                        )}
                      </div>

                      {/* 審査ボタン */}
                      <div className="flex gap-2 shrink-0">
                        {product.status !== "販売中" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-green-500/30 text-green-500 hover:bg-green-500/10"
                            onClick={() => handleApprove(product.id, product.name)}
                            disabled={approveProduct.isPending}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            承認
                          </Button>
                        )}
                        {product.status !== "非承認" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-red-500/30 text-red-500 hover:bg-red-500/10"
                            onClick={() => handleReject(product.id, product.name)}
                            disabled={rejectProduct.isPending}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            非承認
                          </Button>
                        )}
                      </div>
                    </div>
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

export default AdminProducts;
