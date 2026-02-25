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

const BuyerRegister = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      toast({
        title: "エラー",
        description: "パスワードが一致しません。",
        variant: "destructive",
      });
      return;
    }

    if (form.password.length < 6) {
      toast({
        title: "エラー",
        description: "パスワードは6文字以上で設定してください。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

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

    // Auth成功後、ログインしてcustomersレコードを紐付け
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (signInData?.user) {
      // RPC関数でcustomer upsert（既存ゲスト顧客の紐付け or 新規作成）
      const { error: rpcError } = await supabase.rpc("upsert_customer", {
        p_email: form.email,
        p_name: form.name,
        p_auth_user_id: signInData.user.id,
      });

      if (rpcError) {
        console.error("Customer upsert error:", rpcError);
      }
    } else {
      // メール確認が必要な場合
      toast({
        title: "登録完了",
        description: "メールアドレスの確認後、ログインしてください。",
      });
      navigate("/account/login");
      setIsLoading(false);
      return;
    }

    toast({ title: "アカウントを作成しました" });
    navigate("/account/mypage");
    setIsLoading(false);
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">アカウント登録</h1>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl bg-card border border-border">
            <div className="space-y-2">
              <Label htmlFor="name">お名前</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="山田 太郎"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="user@example.com"
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

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登録中...
                </>
              ) : (
                "アカウントを作成"
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">または</span>
              </div>
            </div>

            <GoogleSignInButton role="buyer" label="Googleで登録" />

            <p className="text-center text-sm text-muted-foreground">
              既にアカウントをお持ちの方は
              <Link to="/account/login" className="text-primary hover:underline ml-1">
                ログイン
              </Link>
            </p>

            <p className="text-center text-xs text-muted-foreground">
              アカウント登録なしでもゲストとして購入できます。
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default BuyerRegister;
