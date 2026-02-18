import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SellerProfile = () => {
  const { seller, refreshSeller, signOut } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    phone: "",
    bank_name: "",
    bank_branch: "",
    bank_account_type: "普通" as string,
    bank_account_number: "",
    bank_account_holder: "",
  });

  useEffect(() => {
    if (seller) {
      setForm({
        display_name: seller.display_name,
        phone: seller.phone ?? "",
        bank_name: seller.bank_name ?? "",
        bank_branch: seller.bank_branch ?? "",
        bank_account_type: seller.bank_account_type ?? "普通",
        bank_account_number: seller.bank_account_number ?? "",
        bank_account_holder: seller.bank_account_holder ?? "",
      });
    }
  }, [seller]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    setIsLoading(true);

    const { error } = await supabase
      .from("sellers")
      .update({
        display_name: form.display_name,
        phone: form.phone || null,
        bank_name: form.bank_name || null,
        bank_branch: form.bank_branch || null,
        bank_account_type: form.bank_account_type || null,
        bank_account_number: form.bank_account_number || null,
        bank_account_holder: form.bank_account_holder || null,
      })
      .eq("id", seller.id);

    if (error) {
      toast({ title: "更新に失敗しました", description: error.message, variant: "destructive" });
    } else {
      await refreshSeller();
      toast({ title: "プロフィールを更新しました" });
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">プロフィール設定</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="text-lg font-semibold">基本情報</h2>

              <div className="space-y-2">
                <Label>メールアドレス</Label>
                <Input value={seller?.email ?? ""} disabled />
                <p className="text-xs text-muted-foreground">メールアドレスは変更できません。</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">表示名</Label>
                <Input
                  id="display_name"
                  value={form.display_name}
                  onChange={(e) => handleChange("display_name", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">電話番号</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="090-1234-5678"
                />
              </div>
            </div>

            {/* 振込先情報 */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <h2 className="text-lg font-semibold">振込先口座情報</h2>
              <p className="text-sm text-muted-foreground">
                売上の振込先口座を設定してください。
              </p>

              <div className="space-y-2">
                <Label htmlFor="bank_name">銀行名</Label>
                <Input
                  id="bank_name"
                  value={form.bank_name}
                  onChange={(e) => handleChange("bank_name", e.target.value)}
                  placeholder="みずほ銀行"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_branch">支店名</Label>
                <Input
                  id="bank_branch"
                  value={form.bank_branch}
                  onChange={(e) => handleChange("bank_branch", e.target.value)}
                  placeholder="渋谷支店"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>口座種別</Label>
                  <Select
                    value={form.bank_account_type}
                    onValueChange={(v) => handleChange("bank_account_type", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="普通">普通</SelectItem>
                      <SelectItem value="当座">当座</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">口座番号</Label>
                  <Input
                    id="bank_account_number"
                    value={form.bank_account_number}
                    onChange={(e) => handleChange("bank_account_number", e.target.value)}
                    placeholder="1234567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bank_account_holder">口座名義（カタカナ）</Label>
                <Input
                  id="bank_account_holder"
                  value={form.bank_account_holder}
                  onChange={(e) => handleChange("bank_account_holder", e.target.value)}
                  placeholder="ヤマダ タロウ"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  "プロフィールを保存"
                )}
              </Button>
            </div>
          </form>

          {/* ログアウト */}
          <div className="mt-12 pt-8 border-t border-border">
            <Button variant="outline" onClick={signOut} className="w-full">
              ログアウト
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SellerProfile;
