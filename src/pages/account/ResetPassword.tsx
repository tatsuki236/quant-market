import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsReady(true);
      }
    });

    // Also check if session already exists (user may have already been redirected)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "エラー",
        description: "パスワードは6文字以上で入力してください。",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "エラー",
        description: "パスワードが一致しません。",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setIsComplete(true);
    setIsLoading(false);
  };

  if (isComplete) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-center mb-8">パスワード変更完了</h1>
            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium">パスワードを変更しました</p>
              <p className="text-sm text-muted-foreground">
                新しいパスワードでログインできます。
              </p>
              <Link to="/account/login" className="text-primary hover:underline text-sm inline-block mt-4">
                ログインページへ
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isReady) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-md mx-auto text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">認証情報を確認中...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">新しいパスワードを設定</h1>

          <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl bg-card border border-border">
            <div className="space-y-2">
              <Label htmlFor="password">新しいパスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上"
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">パスワード確認</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="もう一度入力"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  変更中...
                </>
              ) : (
                "パスワードを変更"
              )}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPassword;
