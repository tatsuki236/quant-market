import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError("認証セッションの取得に失敗しました。再度ログインしてください。");
        return;
      }

      const role = localStorage.getItem("oauth_role") || "buyer";
      localStorage.removeItem("oauth_role");

      const user = session.user;

      if (role === "seller") {
        // 出品者: sellers テーブルに既存レコードがあるか確認
        const { data: seller } = await supabase
          .from("sellers")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (seller) {
          navigate("/seller/dashboard", { replace: true });
        } else {
          navigate("/seller/register", { replace: true });
        }
      } else {
        // 購入者: customers テーブルに既存レコードがあるか確認
        const { data: customer } = await supabase
          .from("customers")
          .select("id")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (!customer) {
          const displayName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "ユーザー";

          await supabase.rpc("upsert_customer", {
            p_email: user.email,
            p_name: displayName,
            p_auth_user_id: user.id,
          });
        }

        navigate("/account/mypage", { replace: true });
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">認証エラー</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="space-y-2">
              <Link to="/account/login" className="text-primary hover:underline block">
                購入者ログインへ
              </Link>
              <Link to="/seller/login" className="text-primary hover:underline block">
                出品者ログインへ
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-md mx-auto text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">認証処理中...</p>
        </div>
      </section>
    </Layout>
  );
};

export default AuthCallback;
