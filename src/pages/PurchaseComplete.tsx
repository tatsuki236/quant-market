import { useSearchParams, Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  CheckCircle,
  Download,
  Mail,
  BookOpen,
  MessageCircle,
  ArrowRight,
  FileText,
  HelpCircle,
  Clock,
  Loader2,
  AlertTriangle,
} from "lucide-react";

type PaymentStatus = "pending" | "completed" | "failed";

const PurchaseComplete = () => {
  const [searchParams] = useSearchParams();
  const productName = searchParams.get("product") || "ご購入商品";
  const paymentMethod = searchParams.get("method") || "card";
  const orderId = searchParams.get("order") || "";

  const isBankTransfer = paymentMethod === "bank";
  const isCard = paymentMethod === "card";

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(
    isBankTransfer ? "pending" : "pending"
  );
  const [isPolling, setIsPolling] = useState(isCard);

  // カード決済の場合、Webhook による status 更新をポーリングで確認
  const checkPaymentStatus = useCallback(async () => {
    if (!orderId || !isCard) return;

    const { data } = await supabase
      .from("orders")
      .select("payment_status")
      .eq("order_id", orderId)
      .maybeSingle();

    if (data) {
      const status = data.payment_status as PaymentStatus;
      setPaymentStatus(status);
      if (status === "completed" || status === "failed") {
        setIsPolling(false);
      }
    }
  }, [orderId, isCard]);

  useEffect(() => {
    if (!isPolling) return;

    // 初回チェック
    checkPaymentStatus();

    // 3秒間隔でポーリング（最大60秒 = 20回）
    let count = 0;
    const interval = setInterval(() => {
      count++;
      checkPaymentStatus();
      if (count >= 20) {
        setIsPolling(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isPolling, checkPaymentStatus]);

  // カード決済でポーリング中 → Squareからのリダイレクト直後は completed 扱い
  // （Webhookが先に到着していれば即 completed、遅延していればポーリングで検知）
  const isCardCompleted = isCard && paymentStatus === "completed";
  const isCardPending = isCard && paymentStatus === "pending";
  const isCardFailed = isCard && paymentStatus === "failed";

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container max-w-3xl">
          {/* Success Header */}
          <div className="text-center mb-10">
            {isCardFailed ? (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  決済に失敗しました
                </h1>
                <p className="text-muted-foreground text-base">
                  お手数ですが、再度お試しいただくかサポートまでご連絡ください。
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                  {isCardPending && isPolling ? (
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  ) : (
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  {isBankTransfer
                    ? "ご注文を受け付けました"
                    : isCardPending && isPolling
                      ? "決済を確認中..."
                      : "ご購入ありがとうございます！"}
                </h1>
                <p className="text-muted-foreground text-base">
                  {isBankTransfer
                    ? "銀行振込の確認後、ダウンロードリンクをメールでお送りします"
                    : isCardPending && isPolling
                      ? "Squareからの決済完了通知を待っています。しばらくお待ちください..."
                      : "ダウンロードの準備が整いました"
                  }
                </p>
              </>
            )}
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                ご注文内容
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">注文番号</span>
                    <span className="font-mono font-semibold text-foreground">{orderId}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">商品名</span>
                  <span className="font-semibold text-foreground">{productName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">お支払い方法</span>
                  <span className="text-foreground">
                    {isBankTransfer ? "銀行振込" : "クレジットカード"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ステータス</span>
                  {isCardPending && isPolling ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      確認中
                    </span>
                  ) : isCardFailed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      決済失敗
                    </span>
                  ) : isBankTransfer ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                      <Clock className="w-3.5 h-3.5" />
                      入金待ち
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      <CheckCircle className="w-3.5 h-3.5" />
                      完了
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card payment: pending timeout notice */}
          {isCardPending && !isPolling && (
            <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                    <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">決済確認に時間がかかっています</h3>
                    <p className="text-sm text-muted-foreground">
                      Squareでの決済が完了している場合、まもなく確認メールが届きます。
                      しばらく経っても届かない場合は、
                      <Link to="/contact" className="text-primary hover:underline">サポート</Link>
                      までご連絡ください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Card payment: failed */}
          {isCardFailed && (
            <Card className="mb-8 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  決済処理中にエラーが発生しました。カード情報をご確認の上、再度お試しください。
                </p>
                <Button variant="hero" asChild>
                  <Link to="/cart">カートに戻って再試行</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Bank Transfer Instructions */}
          {isBankTransfer && (
            <Card className="mb-8 border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-yellow-800 dark:text-yellow-400">
                  <Clock className="w-5 h-5" />
                  お振込み先のご案内
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-background rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">銀行名</span>
                    <span className="font-semibold">○○銀行</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">支店名</span>
                    <span className="font-semibold">△△支店（支店コード：123）</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">口座種別</span>
                    <span className="font-semibold">普通</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">口座番号</span>
                    <span className="font-semibold font-mono">1234567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">口座名義</span>
                    <span className="font-semibold">クオントマーケット（カ</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>※ ご注文から7日以内にお振込みください</p>
                  <p>※ 振込手数料はお客様のご負担となります</p>
                  <p>※ 入金確認後、24時間以内にダウンロードリンクをメールでお送りします</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Download Section (for completed card payment) */}
          {isCardCompleted && (
            <Card className="mb-8 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Download className="w-5 h-5 text-primary" />
                  ダウンロード
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  以下のボタンからインジケーターをダウンロードしてください。
                  ダウンロードリンクはメールでもお送りしています。
                </p>
                <Button size="lg" className="w-full gap-2">
                  <Download className="w-5 h-5" />
                  {productName} をダウンロード
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  ※ ダウンロードリンクは30日間有効です
                </p>
              </CardContent>
            </Card>
          )}

          {/* Email Confirmation */}
          {!isCardFailed && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">確認メールを送信しました</h3>
                    <p className="text-sm text-muted-foreground">
                      ご注文内容の確認メールをお送りしました。
                      {isCardCompleted && "ダウンロードリンクも記載されています。"}
                      メールが届かない場合は、迷惑メールフォルダをご確認ください。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-primary" />
              次のステップ
            </h2>
            <div className="grid gap-4">
              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-secondary">
                      <BookOpen className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">導入ガイドを確認する</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        インジケーターのインストール方法や基本的な使い方を解説しています。
                      </p>
                      <Link to="/buyers">
                        <Button variant="outline" size="sm" className="gap-1">
                          ガイドを見る
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-secondary">
                      <HelpCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">よくある質問を確認する</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        インストールやトラブルシューティングに関するFAQをご用意しています。
                      </p>
                      <Link to="/faq">
                        <Button variant="outline" size="sm" className="gap-1">
                          FAQを見る
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-secondary">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">サポートに連絡する</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        ご不明な点がございましたら、お気軽にお問い合わせください。
                      </p>
                      <Link to="/contact">
                        <Button variant="outline" size="sm" className="gap-1">
                          お問い合わせ
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/">
              <Button variant="ghost" className="gap-2">
                トップページに戻る
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PurchaseComplete;
