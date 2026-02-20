import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAdminSellers, useUpdateSeller } from "@/hooks/use-admin";
import { useToast } from "@/components/ui/use-toast";

const AdminSellers = () => {
  const { data: sellers = [], isLoading } = useAdminSellers();
  const updateSeller = useUpdateSeller();
  const { toast } = useToast();

  const handleToggle = async (
    id: string,
    field: "is_approved" | "is_active",
    value: boolean,
    displayName: string
  ) => {
    try {
      await updateSeller.mutateAsync({ id, [field]: value });
      const label = field === "is_approved" ? "承認" : "有効";
      toast({
        title: `${label}ステータスを変更しました`,
        description: `「${displayName}」を${value ? label : `非${label}`}にしました`,
      });
    } catch {
      toast({ title: "エラー", description: "更新に失敗しました", variant: "destructive" });
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
            <h1 className="text-2xl font-bold">出品者管理</h1>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              出品者がいません
            </div>
          ) : (
            <div className="space-y-4">
              {sellers.map((seller) => (
                <div
                  key={seller.id}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{seller.display_name}</h3>
                        {seller.is_admin && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            管理者
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {seller.email} ・ 登録: {new Date(seller.created_at).toLocaleDateString("ja-JP")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={seller.is_approved}
                        onCheckedChange={(checked) =>
                          handleToggle(seller.id, "is_approved", checked, seller.display_name)
                        }
                        disabled={updateSeller.isPending}
                      />
                      承認
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={seller.is_active}
                        onCheckedChange={(checked) =>
                          handleToggle(seller.id, "is_active", checked, seller.display_name)
                        }
                        disabled={updateSeller.isPending}
                      />
                      有効
                    </label>
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

export default AdminSellers;
