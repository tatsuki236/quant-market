import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Shield, Zap, DollarSign, CheckCircle } from "lucide-react";

/**
 * 出品者向けガイドページ
 * SEOキーワード: インジケータ 販売, MT4 開発, MT5 開発, MQL4, MQL5,
 * Pine Script, TradingView 開発, クオンツ, アルゴリズム取引
 */

const Sellers = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Users className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-accent">出品者ガイド</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              インジケータを<span className="text-gradient-accent">出品したい方へ</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              MQL4・MQL5・Pine Scriptでインジケータやトレードツールを開発している方、QuantMarketであなたの技術を収益化しませんか？インジケータ専門マーケットとして、開発者の皆様を支援します。
            </p>
          </div>
        </div>
      </section>

      {/* Why QuantMarket */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            QuantMarketで出品するメリット
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "インジケータ専門マーケット",
                description: "テクニカルインジケータに特化したマーケットプレイスで、専門性の高いユーザーにリーチできます。",
              },
              {
                icon: Shield,
                title: "透明性の高い運営",
                description: "販売手数料、支払いサイクル、規約などを明確に開示。誠実で中立な運営を心がけています。",
              },
              {
                icon: Zap,
                title: "3プラットフォーム対応",
                description: "MT4、MT5、TradingViewの3つのプラットフォームに対応。幅広いユーザー層にアプローチできます。",
              },
              {
                icon: DollarSign,
                title: "適正な収益配分",
                description: "開発者の努力に見合った収益配分を実現。詳細は出品申請時にご説明いたします。",
              },
              {
                icon: Users,
                title: "開発者コミュニティ",
                description: "他の開発者との情報交換や、技術的なサポートを受けられる環境を整備しています。",
              },
              {
                icon: CheckCircle,
                title: "充実したサポート",
                description: "出品から販売まで、開発者の皆様を丁寧にサポートいたします。",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-colors">
                <item.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Demand */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              テクニカルインジケータの市場需要
            </h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="leading-relaxed">
                株式・FX・仮想通貨市場の拡大に伴い、テクニカル分析ツールへの需要は年々高まっています。特に、システムトレードやアルゴリズム取引への関心が増加する中、高品質なインジケータを求めるトレーダーは少なくありません。
              </p>
              <p className="leading-relaxed">
                QuantMarketでは、以下のようなインジケータに需要があります：
              </p>
              <ul className="space-y-2 pl-6">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  トレンド判定・売買シグナル生成インジケータ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  オシレーター系・ダイバージェンス検出ツール
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  マルチタイムフレーム分析インジケータ
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  ボラティリティ・リスク管理ツール
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  特定市場（仮想通貨、株式）に特化したツール
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Requirements */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            開発者向け技術要件
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                platform: "MT4",
                language: "MQL4",
                description: "MetaTrader 4向けのインジケータ。世界中のFXトレーダーに利用されているプラットフォームです。",
                requirements: [
                  ".mq4/.ex4形式での提出",
                  "パラメータの適切な設定",
                  "日本語/英語の説明文",
                  "スクリーンショット必須",
                ],
              },
              {
                platform: "MT5",
                language: "MQL5",
                description: "MetaTrader 5向けのインジケータ。株式・先物にも対応した次世代プラットフォームです。",
                requirements: [
                  ".mq5/.ex5形式での提出",
                  "マルチアセット対応推奨",
                  "日本語/英語の説明文",
                  "スクリーンショット必須",
                ],
              },
              {
                platform: "TradingView",
                language: "Pine Script",
                description: "ブラウザベースの人気チャートプラットフォーム。世界中のトレーダーにアクセス可能です。",
                requirements: [
                  "Pine Script v5推奨",
                  "パブリッシュ可能な形式",
                  "日本語/英語の説明文",
                  "スクリーンショット必須",
                ],
              },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold">{item.platform}</h3>
                  <span className="text-sm text-accent">{item.language}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {item.description}
                </p>
                <h4 className="text-sm font-semibold mb-3">提出要件</h4>
                <ul className="space-y-2">
                  {item.requirements.map((req, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Model */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              収益化モデル
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              QuantMarketでは、開発者の皆様の技術と努力に見合った収益配分を目指しています。具体的な手数料率や支払いサイクルについては、出品申請時に詳細をご説明いたします。
            </p>
            <div className="p-6 rounded-xl bg-card border border-border inline-block text-sm text-muted-foreground space-y-1">
              <p>お支払い方法：銀行振込</p>
              <p>支払いサイクル：月末締め翌月払い</p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Start */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              出品までの流れ
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "出品者アカウント作成",
                  description: "メールアドレスとパスワードで出品者アカウントを作成します。表示名や銀行口座情報もご登録ください。",
                },
                {
                  step: "2",
                  title: "商品を登録",
                  description: "商品名・説明・価格・対象市場などの情報を入力し、商品画像をアップロードして出品します。",
                },
                {
                  step: "3",
                  title: "審査後に掲載開始",
                  description: "管理者が内容を確認後、承認された商品がサイトに掲載されます。審査完了までしばらくお待ちください。",
                },
              ].map((item) => (
                <div key={item.step} className="p-6 rounded-xl bg-card border border-border text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              出品をご検討の方へ
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              まずは出品者アカウントを作成して、あなたのインジケータを出品しましょう。ご不明点があればお気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg" asChild>
                <Link to="/seller/register">
                  出品者アカウントを作成
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">出品について問い合わせる</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sellers;
