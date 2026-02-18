import Layout from "@/components/layout/Layout";

/**
 * 特定商取引法に基づく表記ページ
 */

const Law = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              特定商取引法に基づく表記
            </h1>

            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border">
                <dl className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">販売業者</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      QuantMarket（クオンツマーケット）
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">運営責任者</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      [お問い合わせ時に開示]
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">所在地</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      [お問い合わせ時に開示]
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">電話番号</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      [お問い合わせ時に開示]
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">メールアドレス</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      support@quantsmarket.com
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">URL</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      https://quantsmarket.com
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">商品の販売価格</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      各商品ページに表示（税込価格）
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">送料</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      デジタル商品のため送料なし
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">支払方法</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      クレジットカード決済（Square）、銀行振込
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">支払時期</dt>
                    <dd className="md:col-span-2 text-muted-foreground space-y-1">
                      <p>クレジットカード: ご注文時</p>
                      <p>銀行振込: ご注文後7日以内</p>
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">商品の引渡し時期</dt>
                    <dd className="md:col-span-2 text-muted-foreground space-y-1">
                      <p>クレジットカード: 決済完了後即時</p>
                      <p>銀行振込: 入金確認後1-2営業日以内</p>
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 pb-4 border-b border-border">
                    <dt className="font-medium">返品・交換について</dt>
                    <dd className="md:col-span-2 text-muted-foreground">
                      デジタル商品の性質上、購入後の返品・返金は原則としてお受けしておりません。
                      商品に重大な欠陥がある場合は、個別にご相談ください。
                    </dd>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
                    <dt className="font-medium">動作環境</dt>
                    <dd className="md:col-span-2 text-muted-foreground space-y-1">
                      <p>MT4、MT5、TradingView</p>
                      <p>※商品により対応プラットフォームが異なります。各商品ページでご確認ください。</p>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-6 rounded-xl bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                  ※ 住所・電話番号等の個人情報は、お問い合わせいただいた方にのみ開示いたします。
                  スパム対策のため、ウェブサイト上での公開は控えさせていただいております。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Law;
