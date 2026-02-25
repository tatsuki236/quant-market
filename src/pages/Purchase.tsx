import Layout from "@/components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Building2, AlertCircle, Shield, CheckCircle, Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

/**
 * チェックアウトページ（カートベース）
 */

// バリデーションスキーマ
const purchaseSchema = z.object({
  name: z.string().trim().min(1, "お名前を入力してください").max(100, "お名前は100文字以内で入力してください"),
  email: z.string().trim().email("正しいメールアドレスを入力してください").max(255, "メールアドレスは255文字以内で入力してください"),
  emailConfirm: z.string().trim().email("正しいメールアドレスを入力してください"),
}).refine((data) => data.email === data.emailConfirm, {
  message: "メールアドレスが一致しません",
  path: ["emailConfirm"],
});

const Purchase = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    emailConfirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreements, setAgreements] = useState({
    terms: false,
    disclaimer: false,
    noRefund: false,
  });

  // カートが空の場合
  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">カートが空です</h1>
            <p className="text-muted-foreground mb-8">
              購入手続きを行うには、まず商品をカートに追加してください。
            </p>
            <Button variant="hero" asChild>
              <Link to="/products">商品を探す</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    try {
      purchaseSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const allAgreementsChecked = agreements.terms && agreements.disclaimer && agreements.noRefund;

  const productIds = items.map((i) => i.productId).join(",");
  const productNames = items.map((i) => i.name).join(", ");

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "入力エラー",
        description: "入力内容を確認してください。",
        variant: "destructive",
      });
      return;
    }

    if (!allAgreementsChecked) {
      toast({
        title: "同意が必要です",
        description: "すべての項目に同意してください。",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "card") {
        // カード決済: customer upsert + order + order_items はEdge Function（service_role）で一括処理
        const { data, error } = await supabase.functions.invoke("create-square-payment", {
          body: {
            items: items.map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
            })),
            customerName: formData.name,
            customerEmail: formData.email,
            authUserId: user?.id ?? null,
          },
        });

        if (error) {
          throw new Error(error.message || "決済処理に失敗しました");
        }

        if (data?.checkoutUrl) {
          clearCart();
          toast({
            title: "決済画面へ移動します",
            description: "Square決済画面に遷移します...",
          });
          window.location.href = data.checkoutUrl;
        } else {
          throw new Error("決済リンクの取得に失敗しました");
        }
      } else {
        // 銀行振込: customer upsert → order → order_items（UUID解決あり）

        // 1. Customer upsert（RPC関数でRLSバイパス）
        const { data: customerId, error: customerError } = await supabase.rpc("upsert_customer", {
          p_email: formData.email,
          p_name: formData.name,
          p_auth_user_id: user?.id ?? null,
        });

        if (customerError) {
          console.error("Customer upsert error:", customerError);
        }

        // 2. 注文作成
        const orderId = `QM-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        const { error: dbError } = await supabase.from("orders").insert({
          order_id: orderId,
          product_id: productIds,
          product_name: productNames,
          price: totalPrice,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_id: customerId ?? null,
          payment_method: "bank",
          payment_status: "pending",
        });

        if (dbError) {
          console.error("Database error:", dbError);
          throw new Error("注文の保存に失敗しました");
        }

        // 3. Order items作成（slug → UUID 解決 + 手数料計算）
        for (const item of items) {
          const { data: product } = await supabase
            .from("products")
            .select("id, seller_id, commission_rate")
            .eq("slug", item.productId)
            .maybeSingle();

          if (!product) {
            console.error(`Product not found for slug: ${item.productId}`);
            continue;
          }

          const feeRate = product.commission_rate ?? 0.20;
          const platformFee = Math.round(item.price * feeRate);
          const sellerAmount = item.price - platformFee;

          await supabase.from("order_items").insert({
            order_id: orderId,
            product_id: product.id,
            product_slug: item.productId,
            product_name: item.name,
            price: item.price,
            seller_id: product.seller_id ?? null,
            platform_fee: platformFee,
            seller_amount: sellerAmount,
          });
        }

        clearCart();

        toast({
          title: "注文を受け付けました",
          description: "振込先情報を確認してください。",
        });
        navigate(`/purchase/complete?product=${encodeURIComponent(productNames)}&method=bank&order=${encodeURIComponent(orderId)}`);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "決済処理に失敗しました。しばらくしてから再度お試しください。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            {/* Back Link */}
            <Link
              to="/cart"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              カートに戻る
            </Link>

            <h1 className="text-2xl md:text-3xl font-bold mb-2">購入手続き</h1>
            <p className="text-muted-foreground mb-8">
              以下のフォームに必要事項を入力し、決済方法を選択してください。
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Info */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-lg font-semibold mb-6">購入者情報</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">お名前 <span className="text-destructive">*</span></Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="山田 太郎"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">メールアドレス <span className="text-destructive">*</span></Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="example@email.com"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        ダウンロードURLをお送りしますので、受信可能なアドレスをご入力ください。
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailConfirm">メールアドレス（確認） <span className="text-destructive">*</span></Label>
                      <Input
                        id="emailConfirm"
                        type="email"
                        value={formData.emailConfirm}
                        onChange={(e) => handleInputChange("emailConfirm", e.target.value)}
                        placeholder="example@email.com"
                        className={errors.emailConfirm ? "border-destructive" : ""}
                      />
                      {errors.emailConfirm && (
                        <p className="text-sm text-destructive">{errors.emailConfirm}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-lg font-semibold mb-6">お支払い方法</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("card")}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <CreditCard className={`h-8 w-8 mb-3 ${paymentMethod === "card" ? "text-primary" : "text-muted-foreground"}`} />
                      <h3 className="font-semibold mb-1">クレジットカード</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Square経由・即時ダウンロード
                      </p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">Visa</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">Mastercard</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">JCB</span>
                        <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">Amex</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bank")}
                      className={`p-5 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === "bank"
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                    >
                      <Building2 className={`h-8 w-8 mb-3 ${paymentMethod === "bank" ? "text-accent" : "text-muted-foreground"}`} />
                      <h3 className="font-semibold mb-1">銀行振込</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        入金確認後にダウンロード
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ※ 1-2営業日で入金確認
                      </p>
                    </button>
                  </div>

                  {/* Payment Method Details */}
                  <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                    {paymentMethod === "card" ? (
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-1">クレジットカード決済について</p>
                          <p>決済はSquare社のセキュアな決済システムを使用しています。</p>
                          <p>決済完了後、すぐに商品をダウンロードいただけます。</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium text-foreground mb-1">銀行振込について</p>
                          <p>注文確定後、振込先口座情報をメールでお送りします。</p>
                          <p>7日以内にお振込みをお願いいたします。入金確認後、1-2営業日以内にダウンロードURLをお送りします。</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agreements */}
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-lg font-semibold mb-6">確認事項</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={agreements.terms}
                        onCheckedChange={(checked) =>
                          setAgreements((prev) => ({ ...prev, terms: checked === true }))
                        }
                        className="mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        <Link to="/terms" className="text-primary hover:underline" target="_blank">利用規約</Link>
                        および
                        <Link to="/privacy" className="text-primary hover:underline" target="_blank">プライバシーポリシー</Link>
                        に同意します。
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="disclaimer"
                        checked={agreements.disclaimer}
                        onCheckedChange={(checked) =>
                          setAgreements((prev) => ({ ...prev, disclaimer: checked === true }))
                        }
                        className="mt-1"
                      />
                      <Label htmlFor="disclaimer" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        本商品は投資助言ではなく、投資判断は自己責任で行うことを理解しました。
                        <Link to="/disclaimer" className="text-primary hover:underline ml-1" target="_blank">免責事項</Link>
                        を確認しました。
                      </Label>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="noRefund"
                        checked={agreements.noRefund}
                        onCheckedChange={(checked) =>
                          setAgreements((prev) => ({ ...prev, noRefund: checked === true }))
                        }
                        className="mt-1"
                      />
                      <Label htmlFor="noRefund" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        デジタル商品の性質上、購入後の返金は原則としてできないことを理解しました。
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Button (Mobile) */}
                <div className="lg:hidden">
                  <Button
                    variant={paymentMethod === "card" ? "hero" : "accent"}
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !allAgreementsChecked}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        処理中...
                      </>
                    ) : paymentMethod === "card" ? (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        クレジットカードで決済する
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-5 w-5" />
                        銀行振込で注文する
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Sidebar - Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4">
                  {/* Product Summary */}
                  <div className="p-6 rounded-xl bg-card border border-border">
                    <h2 className="text-lg font-semibold mb-4">ご注文内容</h2>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.productId}>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">{item.platform} / {item.market}</p>
                            <span className="font-mono">¥{item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">合計（税込）</span>
                          <span className="font-mono text-2xl font-bold text-primary">
                            ¥{totalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button (Desktop) */}
                  <div className="hidden lg:block">
                    <Button
                      variant={paymentMethod === "card" ? "hero" : "accent"}
                      size="lg"
                      className="w-full"
                      onClick={handleSubmit}
                      disabled={isSubmitting || !allAgreementsChecked}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          処理中...
                        </>
                      ) : paymentMethod === "card" ? (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          決済する
                        </>
                      ) : (
                        <>
                          <Building2 className="mr-2 h-5 w-5" />
                          注文する
                        </>
                      )}
                    </Button>
                    {!allAgreementsChecked && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        すべての確認事項に同意してください
                      </p>
                    )}
                  </div>

                  {/* Security Notice */}
                  <div className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">安全なお取引</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        SSL暗号化通信
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        Square安全決済
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-success" />
                        個人情報保護
                      </li>
                    </ul>
                  </div>

                  {/* Notice */}
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">ご注意</p>
                        <p>デジタル商品のため返金不可。購入前に商品説明をよくお読みください。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Purchase;
