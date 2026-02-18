import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/use-products";

/**
 * インジケータカテゴリページ
 * SEOキーワード: インジケータ, テクニカルインジケータ, MT4 インジケータ, MT5 インジケータ,
 * TradingView インジケータ, FX インジケータ, 仮想通貨 インジケータ, 株 インジケータ
 */

type CategoryType = "mt4" | "mt5" | "tradingview" | "fx" | "crypto" | "stocks";

const categoryData: Record<CategoryType, {
  title: string;
  h1: string;
  h1Sub: string;
  description: string;
  content: string;
}> = {
  mt4: {
    title: "MT4 インジケータ",
    h1: "MT4（MetaTrader 4）",
    h1Sub: "対応インジケータ",
    description: "MT4プラットフォームで利用可能なテクニカルインジケータ。MQL4言語で開発されたカスタムインジケータを取り揃えています。",
    content: "MetaTrader 4は、世界中のFXトレーダーに最も広く利用されているプラットフォームです。QuantMarketでは、MT4対応のインジケータを豊富に取り揃えており、トレンド分析、オシレーター、売買シグナル生成など、様々な目的に応じたツールを提供しています。",
  },
  mt5: {
    title: "MT5 インジケータ",
    h1: "MT5（MetaTrader 5）",
    h1Sub: "対応インジケータ",
    description: "MT5プラットフォームで利用可能なテクニカルインジケータ。MQL5言語で開発された高度な分析ツールを提供しています。",
    content: "MetaTrader 5は、MT4の後継として開発された次世代プラットフォームです。株式、先物、CFDなど、より幅広い市場に対応しており、高度なバックテスト機能を備えています。MQL5言語で開発されたインジケータは、より複雑な分析ロジックを実装可能です。",
  },
  tradingview: {
    title: "TradingView インジケータ",
    h1: "TradingView",
    h1Sub: "対応インジケータ",
    description: "TradingViewで利用可能なPine Scriptインジケータ。ブラウザベースで手軽に使えるテクニカル分析ツールを提供しています。",
    content: "TradingViewは、ブラウザベースで利用できる高機能チャートプラットフォームです。Pine Scriptで開発されたインジケータは、インストール不要でどこからでもアクセス可能。ソーシャルトレーディング機能と組み合わせることで、他のトレーダーとの情報共有も容易です。",
  },
  fx: {
    title: "FX インジケータ",
    h1: "FX（外国為替）",
    h1Sub: "向けインジケータ",
    description: "FX取引に特化したテクニカルインジケータ。通貨ペアの分析、エントリーポイントの判断に役立つツールを提供しています。",
    content: "外国為替市場（FX）は、24時間取引可能な世界最大の金融市場です。QuantMarketでは、ドル円、ユーロドルなど主要通貨ペアの分析に適したインジケータを取り揃えています。スキャルピング、デイトレード、スイングトレードなど、様々な取引スタイルに対応しています。",
  },
  crypto: {
    title: "仮想通貨 インジケータ",
    h1: "仮想通貨（暗号資産）",
    h1Sub: "向けインジケータ",
    description: "ビットコイン、イーサリアムなど仮想通貨取引向けのテクニカルインジケータ。24時間365日動く市場に対応したツールを提供しています。",
    content: "仮想通貨市場は、24時間365日取引可能な高ボラティリティ市場です。ビットコイン、イーサリアム、アルトコインなどの分析に適したインジケータを取り揃えています。従来の市場とは異なる特性を考慮した、暗号資産専用のテクニカル分析ツールを提供しています。",
  },
  stocks: {
    title: "株式 インジケータ",
    h1: "株式（日本株・米国株）",
    h1Sub: "向けインジケータ",
    description: "株式市場向けのテクニカルインジケータ。個別銘柄やインデックスの分析に活用できるツールを提供しています。",
    content: "株式市場では、ファンダメンタルズ分析とテクニカル分析を組み合わせることが重要です。QuantMarketでは、日本株、米国株の分析に役立つインジケータを提供しています。移動平均、出来高分析、トレンド判定など、株式投資の意思決定をサポートするツールを取り揃えています。",
  },
};

const Indicators = () => {
  const { category } = useParams<{ category?: CategoryType }>();
  const { data: products = [], isLoading } = useProducts();

  const currentCategory = category && categoryData[category as CategoryType]
    ? categoryData[category as CategoryType]
    : null;

  // 注目のインジケータ（最大4件表示）
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {currentCategory
                ? <>{currentCategory.h1} {currentCategory.h1Sub}</>
                : <>テクニカルインジケータ専門カテゴリ</>
              }
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              {currentCategory
                ? currentCategory.description
                : "QuantMarketでは、MT4・MT5・TradingView対応のテクニカルインジケータを豊富に取り揃えています。株式・FX・仮想通貨のトレード戦略に活用できる分析ツールをお探しください。"
              }
            </p>
          </div>

          {/* Category Navigation */}
          {!currentCategory && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {Object.entries(categoryData).map(([key, data]) => (
                <Link
                  key={key}
                  to={`/indicators/${key}`}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors text-balance">
                    {data.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {data.description}
                  </p>
                  <span className="inline-flex items-center text-sm text-primary">
                    詳しく見る
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Category Content */}
          {currentCategory && (
            <div className="max-w-3xl mx-auto mb-10">
              <div className="p-6 rounded-xl bg-card border border-border">
                <p className="text-muted-foreground leading-relaxed">
                  {currentCategory.content}
                </p>
              </div>
            </div>
          )}

          {/* Featured Indicators */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center text-balance">
              {currentCategory ? `${currentCategory.title}の` : ""}注目のインジケータ
            </h2>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/products/${product.slug}`}
                    className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-glow"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                      <product.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors text-balance">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-muted-foreground">
                        {product.platform}
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                    <span className="inline-flex items-center text-sm text-primary">
                      詳細を見る
                      <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/products">
                すべての商品を見る
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 border-t border-border">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-muted-foreground space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              テクニカルインジケータとは
            </h2>
            <p className="leading-relaxed">
              テクニカルインジケータは、過去の価格や出来高データを基に
              将来の価格動向を予測するための分析ツールです。
              移動平均、RSI、MACD、ボリンジャーバンドなど、様々な種類があり、
              トレンド相場やレンジ相場での売買判断に活用されています。
            </p>
            <p className="leading-relaxed">
              QuantMarketでは、MT4・MT5・TradingViewに対応した
              高品質なインジケータを提供しています。
              株式、FX、仮想通貨など、各市場に適したツールを
              お選びいただけます。システムトレードや裁量トレードの
              補助ツールとしてご活用ください。
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Indicators;
