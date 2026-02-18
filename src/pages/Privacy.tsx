import Layout from "@/components/layout/Layout";

/**
 * プライバシーポリシーページ
 */

const Privacy = () => {
  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              プライバシーポリシー
            </h1>
            <p className="text-muted-foreground mb-8">
              最終更新日: 2024年1月1日
            </p>

            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-xl font-semibold mb-4">1. はじめに</h2>
                <p className="text-muted-foreground leading-relaxed">
                  QuantMarket（クオンツマーケット）（以下「当サイト」）は、
                  ユーザーの個人情報の保護を重要視しております。
                  本プライバシーポリシーは、当サイトが収集する情報、
                  その利用方法、およびユーザーの権利について説明するものです。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">2. 収集する情報</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  当サイトでは、以下の情報を収集することがあります。
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>氏名、メールアドレス等の連絡先情報</li>
                  <li>決済に必要な情報（クレジットカード情報はSquare社が管理）</li>
                  <li>購入履歴、閲覧履歴</li>
                  <li>IPアドレス、ブラウザ情報等のアクセスログ</li>
                  <li>お問い合わせ内容</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">3. 情報の利用目的</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  収集した情報は、以下の目的で利用いたします。
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                  <li>商品の販売、提供、およびサポート</li>
                  <li>決済処理および購入確認</li>
                  <li>お問い合わせへの回答</li>
                  <li>サービス改善のための分析</li>
                  <li>重要なお知らせの送信</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">4. 情報の第三者提供</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供いたしません。
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-4">
                  <li>ユーザーの同意がある場合</li>
                  <li>法令に基づく場合</li>
                  <li>決済処理に必要な場合（Square社への情報提供）</li>
                  <li>サービス提供に必要な業務委託先への提供</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">5. 情報の管理</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトは、個人情報の漏洩、滅失、毀損の防止のため、
                  適切なセキュリティ対策を講じます。
                  SSL暗号化通信を使用し、データの安全性を確保しています。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">6. Cookieの使用</h2>
                <p className="text-muted-foreground leading-relaxed">
                  当サイトでは、ユーザー体験の向上およびアクセス解析のため、
                  Cookieを使用しています。ブラウザの設定によりCookieを無効にすることができますが、
                  一部のサービスが正常に動作しない場合があります。
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-4">7. お問い合わせ</h2>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。
                </p>
                <p className="text-muted-foreground">
                  メールアドレス: support@quantsmarket.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
