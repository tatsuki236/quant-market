import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

const SellerRegister = () => {
  const navigate = useNavigate();
  const { user, signUp, refreshSeller } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    displayName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let authUserId = user?.id;

    if (!authUserId) {
      // 新規ユーザー: まずAuth登録
      if (form.password !== form.passwordConfirm) {
        toast({
          title: "エラー",
          description: "パスワードが一致しません。",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (form.password.length < 6) {
        toast({
          title: "エラー",
          description: "パスワードは6文字以上で設定してください。",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { error } = await signUp(form.email, form.password);

      if (error) {
        toast({
          title: "登録エラー",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Auth成功後、ログイン（メール確認が有効な場合は失敗する可能性）
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });

      if (signInError || !signInData.user) {
        toast({
          title: "登録完了",
          description: "メールアドレスの確認後、再度ログインして出品者プロフィールを設定してください。",
        });
        navigate("/seller/login");
        setIsLoading(false);
        return;
      }

      authUserId = signInData.user.id;
    }

    // Sellersレコードを作成
    const { error: sellerError } = await supabase.from("sellers").insert({
      auth_user_id: authUserId,
      name: form.name,
      display_name: form.displayName,
      email: user?.email ?? form.email,
    });

    if (sellerError) {
      console.error("Seller creation error:", sellerError);
      toast({
        title: "出品者プロフィール作成エラー",
        description: "プロフィールの作成に失敗しました。再度お試しください。",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    await refreshSeller();
    toast({ title: "出品者登録が完了しました" });
    navigate("/seller/dashboard");
    setIsLoading(false);
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">出品者登録</h1>

          <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground mb-6">
            <p className="font-medium text-foreground mb-1">販売手数料について</p>
            <p>
              商品が売れた際、販売価格の <span className="font-semibold text-foreground">20%</span> をプラットフォーム手数料として差し引き、残りの <span className="font-semibold text-foreground">80%</span> が出品者様の受取額となります。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl bg-card border border-border">
            {user && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{user.email}</span> でログイン中です。出品者プロフィールを設定してください。
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">氏名（本名）</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="山田 太郎"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">表示名</Label>
              <Input
                id="displayName"
                value={form.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
                placeholder="QuantTrader_Yamada"
                required
              />
              <p className="text-xs text-muted-foreground">商品ページに表示される名前です。</p>
            </div>

            {!user && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="seller@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="6文字以上"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordConfirm">パスワード（確認）</Label>
                  <Input
                    id="passwordConfirm"
                    type="password"
                    value={form.passwordConfirm}
                    onChange={(e) => handleChange("passwordConfirm", e.target.value)}
                    placeholder="パスワードを再入力"
                    required
                  />
                </div>
              </>
            )}

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : user ? (
                "出品者プロフィールを作成"
              ) : (
                "出品者として登録"
              )}
            </Button>

            {!user && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">または</span>
                  </div>
                </div>

                <GoogleSignInButton role="seller" label="Googleで登録" />

                <p className="text-center text-sm text-muted-foreground">
                  既にアカウントをお持ちの方は
                  <Link to="/seller/login" className="text-primary hover:underline ml-1">
                    ログイン
                  </Link>
                </p>
              </>
            )}
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default SellerRegister;
