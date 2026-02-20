import { Link } from "react-router-dom";
import { Lock, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types/product";

type PaywallGateProps = {
  product: Product;
};

const PaywallGate = ({ product }: PaywallGateProps) => {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { toast } = useToast();

  // 有料コンテンツの先頭部分をプレビュー（最初の300文字程度）
  const previewHtml = product.paid_content?.slice(0, 300) || "";

  const handleAddToCart = () => {
    const added = addItem({
      productId: product.slug,
      name: product.name,
      price: product.price,
      platform: product.platform,
      market: product.market,
      image: product.image,
    });
    if (added) {
      toast({
        title: "カートに追加しました",
        description: `${product.name}をカートに追加しました。`,
      });
    } else {
      toast({
        title: "既にカートに入っています",
        description: `${product.name}は既にカートに追加されています。`,
      });
    }
  };

  return (
    <div className="relative mt-8">
      {/* ぼかしプレビュー — 強めのブラー＋グラデーション */}
      {previewHtml && (
        <div className="relative overflow-hidden max-h-48 rounded-xl bg-card border border-border p-4 sm:p-6">
          <div
            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground select-none"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
          {/* 強力なぼかし＋グラデーションオーバーレイ */}
          <div className="absolute inset-0 backdrop-blur-[6px] bg-gradient-to-b from-transparent from-0% via-background/70 via-30% to-background to-80%" />
        </div>
      )}

      {/* ペイウォールカード */}
      <div className="relative p-4 sm:p-6 md:p-8 rounded-xl bg-card border-2 border-primary/20 text-center -mt-4">
        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary/10 mx-auto mb-3 sm:mb-4">
          <Lock className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
        </div>

        <h3 className="text-lg sm:text-xl font-bold mb-2">
          この先は有料コンテンツです
        </h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
          続きを読むには購入が必要です
        </p>

        <div className="mb-4 sm:mb-6">
          <span className="font-mono text-2xl sm:text-3xl font-bold text-primary">
            ¥{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground ml-1">（税込）</span>
        </div>

        {user ? (
          <Button variant="hero" size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            カートに入れる
          </Button>
        ) : (
          <div className="space-y-3">
            <Button variant="hero" size="lg" asChild>
              <Link to="/account/login">ログインして購入</Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              アカウントをお持ちでない方は
              <Link to="/account/register" className="text-primary hover:underline ml-1">
                新規登録
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaywallGate;
