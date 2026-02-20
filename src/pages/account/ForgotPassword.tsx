import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    });

    if (error) {
      toast({
        title: "エラー",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    setIsSent(true);
    setIsLoading(false);
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-center mb-8">パスワードリセット</h1>

          {isSent ? (
            <div className="p-6 rounded-xl bg-card border border-border text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-lg font-medium">メールを送信しました</p>
              <p className="text-sm text-muted-foreground">
                {email} にパスワードリセット用のリンクを送信しました。
                メールをご確認ください。
              </p>
              <p className="text-xs text-muted-foreground">
                メールが届かない場合は、迷惑メールフォルダをご確認ください。
              </p>
              <Link to="/account/login" className="text-primary hover:underline text-sm inline-block mt-4">
                ログインページに戻る
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground">
                登録済みのメールアドレスを入力してください。パスワードリセット用のリンクをお送りします。
              </p>

              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <Button type="submit" variant="hero" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    送信中...
                  </>
                ) : (
                  "リセットリンクを送信"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <Link to="/account/login" className="text-primary hover:underline">
                  ログインページに戻る
                </Link>
              </p>
            </form>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;
