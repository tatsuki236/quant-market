import Layout from "@/components/layout/Layout";
import { AlertTriangle } from "lucide-react";

/**
 * 免責事項ページ
 * SEOキーワード: 免責事項, 投資リスク, テクニカル分析, インジケータ
 */

const Disclaimer = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <AlertTriangle className="h-8 w-8 text-accent" />
              <h1 className="text-3xl md:text-4xl font-bold">免責事項</h1>
            </div>

            <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20 mb-8">
              <p className="text-foreground font-medium">
                投資には元本割れを含むリスクがあります。
                当サイトで販売する商品は投資助言ではありません。
                投資判断は必ず自己責任で行ってください。
              </p>
            </div>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. 投資リスクについて</h2>
                <p className="text-muted-foreground leading-relaxed">
                  株式、FX（外国為替証拠金取引）、仮想通貨（暗号資産）への投資には、
                  元本割れを含む損失のリスクがあります。
                  レバレッジを利用した取引では、投資額以上の損失が発生する可能性があります。
                  投資を行う際は、ご自身の財務状況、投資経験、リスク許容度を十分に考慮し、
                  必要に応じて専門家にご相談ください。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. 当サイトの商品について</h2>
                <p className="text-muted-foreground leading-relaxed">
                  QuantMarket（クオンツマーケット）で販売するテクニカルインジケータ等の
                  トレードツールは、投資判断の参考情報を提供するものであり、
                  投資助言、投資勧誘、または利益の保証を行うものではありません。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. 過去の実績について</h2>
                <p className="text-muted-foreground leading-relaxed">
                  商品説明に記載されるバックテスト結果や過去の実績は、
                  将来の利益を保証するものではありません。
                  相場環境は常に変化しており、過去に有効だった戦略が
                  将来も同様に機能するとは限りません。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. 情報の正確性について</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトに掲載される情報は、可能な限り正確であるよう努めていますが、
                  その正確性、完全性、最新性を保証するものではありません。
                  情報の利用によって生じた損害について、当サイトは責任を負いません。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. インジケータの限界</h2>
                <p className="text-muted-foreground leading-relaxed">
                  インジケータはテクニカル分析の補助ツールであり、
                  売買判断の最終責任はトレーダー自身にあります。
                  インジケータのシグナルが常に正確であるとは限らず、
                  相場環境によっては期待通りに機能しない場合があります。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. 損害の免責</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトで購入した商品の使用、または当サイトに掲載される情報の利用によって
                  生じた直接的・間接的な損害について、当サイトおよび商品の出品者は
                  一切の責任を負いません。すべての投資判断は自己責任で行ってください。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. 推奨事項</h2>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>購入した商品は、必ずデモ口座でテストしてから実運用を検討してください</li>
                  <li>バックテストを行い、過去データでの検証を行ってください</li>
                  <li>余裕資金の範囲内で投資を行ってください</li>
                  <li>リスク管理（損切り設定等）を必ず行ってください</li>
                  <li>不明な点は専門家にご相談ください</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Disclaimer;
