import Layout from "@/components/layout/Layout";
import { TrendingUp, Shield, Users } from "lucide-react";

/**
 * 運営者情報ページ
 * SEOキーワード: QuantMarket, クオンツマーケット, 運営者情報, 会社概要
 */

const About = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              運営者情報
            </h1>

            {/* Vision */}
            <div className="mb-12 p-8 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">QuantMarketの理念</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                QuantMarket（クオンツマーケット）は、株式・FX・仮想通貨向けの
                テクニカルインジケータを専門に扱うマーケットプレイスです。
                システムトレード、アルゴリズム取引、クオンツ取引に関心を持つ
                トレーダーと開発者を結びつけ、高品質なトレードツールの
                流通を促進することを目指しています。
              </p>
            </div>

            {/* Values */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="p-6 rounded-xl bg-card border border-border">
                <Shield className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-semibold mb-2">誠実・透明性</h3>
                <p className="text-sm text-muted-foreground">
                  金融系サービスとして、誇大広告や利益保証を避け、
                  誠実で中立的な情報提供を心がけています。
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <Users className="h-6 w-6 text-primary mb-4" />
                <h3 className="font-semibold mb-2">専門性</h3>
                <p className="text-sm text-muted-foreground">
                  インジケータに特化したマーケットとして、
                  テクニカル分析の専門知識を持つスタッフが運営しています。
                </p>
              </div>
            </div>

            {/* Company Info */}
            <div className="p-8 rounded-xl bg-card border border-border">
              <h2 className="text-xl font-semibold mb-6">事業者情報</h2>
              <dl className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">サイト名</dt>
                  <dd className="col-span-2">QuantMarket（クオンツマーケット）</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">URL</dt>
                  <dd className="col-span-2">https://quantsmarket.com</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">お問い合わせ</dt>
                  <dd className="col-span-2">support@quantsmarket.com</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">事業内容</dt>
                  <dd className="col-span-2">
                    テクニカルインジケータの販売
                  </dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">対応プラットフォーム</dt>
                  <dd className="col-span-2">MT4 / MT5 / TradingView</dd>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <dt className="text-muted-foreground">対象市場</dt>
                  <dd className="col-span-2">株式 / FX / 仮想通貨</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
