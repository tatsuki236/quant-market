import Layout from "@/components/layout/Layout";
import { CreditCard, Building2, Clock, Shield, CheckCircle } from "lucide-react";

/**
 * お支払い方法ページ
 * SEOキーワード: 決済方法, Square, 銀行振込, クレジットカード
 */

const PaymentMethods = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              お支払い方法
            </h1>
            <p className="text-muted-foreground text-center mb-12">
              QuantMarketでは、クレジットカード決済と銀行振込の
              2つのお支払い方法をご用意しています。
            </p>

            {/* Credit Card */}
            <div className="mb-8 p-8 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                  <CreditCard className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">クレジットカード決済</h2>
                  <p className="text-sm text-muted-foreground">Square経由での安全な決済</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  クレジットカード決済は、Square社の決済システムを利用しています。
                  Visa、Mastercard、American Express、JCB、Diners Club、Discoverに対応。
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">即時決済・即時ダウンロード</p>
                      <p className="text-sm">決済完了後すぐに商品をダウンロードできます</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">安全なSSL暗号化</p>
                      <p className="text-sm">カード情報は暗号化されて送信されます</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer */}
            <div className="mb-8 p-8 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10">
                  <Building2 className="h-7 w-7 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">銀行振込</h2>
                  <p className="text-sm text-muted-foreground">入金確認後にダウンロード可能</p>
                </div>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  銀行振込をご希望の場合は、ご注文後に振込先口座をメールでご案内いたします。
                  入金確認後、1-2営業日以内にダウンロードが可能となります。
                </p>
                <div className="p-4 rounded-lg bg-muted/50 mt-4">
                  <h3 className="font-medium text-foreground mb-2">銀行振込の流れ</h3>
                  <ol className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-semibold flex-shrink-0">1</span>
                      購入手続きで「銀行振込」を選択
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-semibold flex-shrink-0">2</span>
                      振込先口座がメールで届きます
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-semibold flex-shrink-0">3</span>
                      7日以内にお振込みください
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-accent text-xs font-semibold flex-shrink-0">4</span>
                      入金確認後、ダウンロードURLをお送りします
                    </li>
                  </ol>
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm">
                    <span className="font-medium text-foreground">入金反映タイミング:</span>
                    通常1-2営業日以内に確認いたします。土日祝日をまたぐ場合は、翌営業日以降の対応となります。
                  </p>
                </div>
              </div>
            </div>

            {/* Corporate */}
            <div className="p-6 rounded-xl bg-muted/50 border border-border">
              <h3 className="font-semibold mb-2">法人のお客様へ</h3>
              <p className="text-sm text-muted-foreground">
                請求書払い（月末締め翌月末払い等）をご希望の法人様は、
                お問い合わせフォームよりご連絡ください。
                お取引条件をご相談させていただきます。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PaymentMethods;
