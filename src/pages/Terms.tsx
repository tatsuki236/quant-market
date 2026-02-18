import Layout from "@/components/layout/Layout";

/**
 * 利用規約ページ
 */

const Terms = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">利用規約</h1>
            <p className="text-muted-foreground mb-8">
              最終更新日: 2024年1月1日
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">第1条（適用）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本規約は、QuantMarket（クオンツマーケット）（以下「当サイト」）が提供する
                  テクニカルインジケータ等のデジタル商品の
                  販売サービス（以下「本サービス」）の利用条件を定めるものです。
                  登録ユーザーの皆様（以下「ユーザー」）には、本規約に従って本サービスをご利用いただきます。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第2条（利用登録）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  登録希望者が当サイト所定の方法によって利用登録を申請し、
                  当サイトがこれを承認することによって、利用登録が完了するものとします。
                  当サイトは、利用登録の申請者に以下の事由があると判断した場合、
                  利用登録の申請を承認しないことがあります。
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>虚偽の事項を届け出た場合</li>
                  <li>本規約に違反したことがある者からの申請である場合</li>
                  <li>その他、当サイトが利用登録を相当でないと判断した場合</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第3条（商品について）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトで販売する商品は、MT4、MT5、TradingView対応の
                  テクニカルインジケータ等のデジタル商品です。
                  商品の使用にはご利用のプラットフォームの知識が必要です。
                  商品は投資助言ではなく、投資判断は自己責任で行っていただく必要があります。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第4条（禁止事項）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>購入した商品の無断転売・再配布</li>
                  <li>商品のリバースエンジニアリング</li>
                  <li>虚偽の情報を登録する行為</li>
                  <li>当サイトのサーバーまたはネットワークに過度な負荷をかける行為</li>
                  <li>その他、当サイトが不適切と判断する行為</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第5条（返金ポリシー）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  デジタル商品の性質上、ご購入後の返金は原則としてお受けしておりません。
                  ただし、商品に重大な欠陥がある場合や、
                  明らかに説明と異なる場合は、個別にご相談を承ります。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第6条（免責事項）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトは、本サービスに関して、その正確性、完全性、有用性等について
                  いかなる保証も行うものではありません。
                  本サービスの利用によって生じた損害について、
                  当サイトは一切の責任を負いません。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第7条（規約の変更）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトは、必要と判断した場合には、ユーザーに通知することなく
                  いつでも本規約を変更することができるものとします。
                  変更後の規約は、当サイトに掲示した時点から効力を生じるものとします。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">第8条（準拠法・管轄裁判所）</h2>
                <p className="text-muted-foreground leading-relaxed">
                  本規約の解釈にあたっては、日本法を準拠法とします。
                  本サービスに関して紛争が生じた場合には、
                  東京地方裁判所を専属的合意管轄とします。
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
