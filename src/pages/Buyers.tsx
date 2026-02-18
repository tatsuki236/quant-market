import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, BarChart3, Cpu, Target, HelpCircle, CheckCircle } from "lucide-react";

/**
 * 購入者向けガイドページ
 * SEOキーワード: インジケータとは, MT4 使い方, MT5 使い方, TradingView 使い方,
 * バックテスト, 裁量トレード, テクニカル分析
 */

const Buyers = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 lg:py-20 border-b border-border">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">購入者ガイド</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              インジケータを<span className="text-gradient-primary">購入したい方へ</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              QuantMarketでテクニカルインジケータを購入する前に知っておいていただきたいこと。インジケータの基礎知識から、MT4・MT5・TradingViewでの使い方、バックテストの重要性まで解説します。
            </p>
          </div>
        </div>
      </section>

      {/* What is Indicator */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                テクニカルインジケータとは何か
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  テクニカルインジケータは、過去の価格データ（始値・高値・安値・終値）や出来高を基に計算され、チャート上に表示されるテクニカル分析ツールです。
                </p>
                <p className="leading-relaxed">
                  移動平均、RSI、MACD、ボリンジャーバンドなど様々な種類があり、トレンドの方向性、相場の過熱感、売買タイミングの判断に活用されます。
                </p>
                <p className="leading-relaxed">
                  インジケータは「売買の補助ツール」であり、最終的な投資判断はトレーダー自身が行う必要があります。テクニカル分析のスキルを高め、より良いトレード判断を目指しましょう。
                </p>
              </div>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border">
              <BarChart3 className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-4">代表的なインジケータ</h3>
              <ul className="space-y-3">
                {[
                  { name: "移動平均（MA）", desc: "トレンドの方向性を判断" },
                  { name: "RSI", desc: "買われすぎ・売られすぎを判定" },
                  { name: "MACD", desc: "トレンドの転換点を検出" },
                  { name: "ボリンジャーバンド", desc: "価格の変動幅を分析" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">- {item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Indicator Benefits */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            インジケータを活用するメリット
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-xl bg-card border border-primary/30">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                トレード判断の補助
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  チャート上に分析結果を視覚的に表示
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  売買タイミングの判断をサポート
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  裁量トレードの精度向上
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  テクニカル分析の学習に最適
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                効率的な相場分析
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  複雑な計算を自動化
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  複数の指標を同時に確認可能
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  トレンドの方向性を明確化
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  エントリー・エグジットポイントの判断
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-8 max-w-2xl mx-auto leading-relaxed">
            QuantMarketでは、テクニカル分析の基礎を学べるインジケータを専門に取り扱っています。インジケータで相場分析のスキルを身につけましょう。
          </p>
        </div>
      </section>

      {/* Platform Guide */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            プラットフォーム別の使い方
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                name: "MT4",
                fullName: "MetaTrader 4",
                steps: [
                  "インジケータファイル（.ex4/.mq4）をダウンロード",
                  "MT4のデータフォルダ > MQL4 > Indicators に配置",
                  "MT4を再起動してナビゲーターから選択",
                  "チャートにドラッグ＆ドロップで適用",
                ],
              },
              {
                name: "MT5",
                fullName: "MetaTrader 5",
                steps: [
                  "インジケータファイル（.ex5/.mq5）をダウンロード",
                  "MT5のデータフォルダ > MQL5 > Indicators に配置",
                  "MT5を再起動してナビゲーターから選択",
                  "チャートにドラッグ＆ドロップで適用",
                ],
              },
              {
                name: "TradingView",
                fullName: "TradingView",
                steps: [
                  "TradingViewにログイン",
                  "Pine Editorでスクリプトをペースト",
                  "「チャートに追加」をクリック",
                  "インジケーターパネルから設定を調整",
                ],
              },
            ].map((platform, i) => (
              <div key={i} className="p-6 rounded-xl bg-card border border-border">
                <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{platform.fullName}</p>
                <ol className="space-y-3">
                  {platform.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold flex-shrink-0">
                        {j + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Backtest Importance */}
      <section className="py-16 lg:py-20 bg-card/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                バックテストの重要性
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                インジケータを実際のトレードで使用する前に、必ず過去データでの検証（バックテスト）を行ってください。
              </p>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-2">なぜバックテストが必要か</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  インジケータのシグナルが、あなたのトレードスタイルや対象通貨ペア・銘柄に適しているかを確認するためです。過去のデータで検証することで、シグナルの精度や勝率の目安を把握できます。
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border">
                <h3 className="font-semibold mb-2">バックテストの注意点</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• 過去の成績が将来を保証するものではありません</li>
                  <li>• 十分な期間のデータで検証してください</li>
                  <li>• 相場環境（トレンド/レンジ）による差異を確認してください</li>
                  <li>• デモ口座でのテスト運用を推奨します</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Buy */}
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              購入までの流れ
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  title: "アカウント作成",
                  description: "メールアドレスとパスワードで購入者アカウントを作成します。",
                },
                {
                  step: "2",
                  title: "商品を選ぶ",
                  description: "対象市場やプラットフォームから、お探しのインジケータを見つけます。",
                },
                {
                  step: "3",
                  title: "カートに追加・決済",
                  description: "商品をカートに追加し、クレジットカードまたは銀行振込でお支払いいただけます。",
                },
                {
                  step: "4",
                  title: "ダウンロード・導入",
                  description: "購入完了後、インジケータファイルをダウンロードしてお使いのプラットフォームに導入します。",
                },
              ].map((item) => (
                <div key={item.step} className="p-5 rounded-xl bg-card border border-border text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-base font-semibold mb-2">{item.title}</h3>
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
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              まずはアカウントを作成しましょう
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              無料でアカウントを作成して、インジケータを探してみましょう。選び方や使い方でお悩みの方は、お気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/account/register">
                  購入者アカウントを作成
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/products">商品を探す</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Buyers;
