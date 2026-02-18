import Layout from "@/components/layout/Layout";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart, CheckCircle, AlertTriangle, BarChart3, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useProduct } from "@/hooks/use-products";

/**
 * 商品詳細ページ
 * SEOキーワード: インジケータ, テクニカルインジケータ, MT4 インジケータ, MT5 インジケータ,
 * TradingView インジケータ, トレード戦略, バックテスト, 売買シグナル
 */

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { data: product, isLoading } = useProduct(slug);

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container text-center">
            <h1 className="text-2xl font-bold mb-4">商品が見つかりません</h1>
            <p className="text-muted-foreground mb-8">
              お探しの商品は存在しないか、削除された可能性があります。
            </p>
            <Button variant="outline" asChild>
              <Link to="/products">
                <ArrowLeft className="mr-2 h-4 w-4" />
                商品一覧に戻る
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const hasDetailedInfo = product.full_description || product.technical_logic;

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="hover:text-foreground transition-colors">
                  ホーム
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/products" className="hover:text-foreground transition-colors">
                  商品一覧
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground">{product.name}</li>
            </ol>
          </nav>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Product Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                    {product.market}インジケータ
                  </span>
                  <span className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground">
                    {product.platform}対応
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {product.name}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {product.description}
                </p>
              </div>

              {/* Full Description */}
              {product.full_description && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4">商品説明</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.full_description}
                  </p>
                </div>
              )}

              {/* Technical Logic */}
              {product.technical_logic && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    テクニカル分析ロジック
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {product.technical_logic}
                  </p>
                  {product.indicators && product.indicators.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {product.indicators.map((indicator, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm rounded-full bg-muted text-muted-foreground"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Market Condition */}
              {product.market_condition && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4">想定相場・使用条件</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.market_condition}
                  </p>
                </div>
              )}

              {/* Backtest Info */}
              {product.backtest_info && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4">バックテスト情報</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.backtest_info}
                  </p>
                </div>
              )}

              {/* Detail Features */}
              {product.detail_features && product.detail_features.length > 0 && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4">機能一覧</h2>
                  <ul className="space-y-3">
                    {product.detail_features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Features (basic) — shown when no detailed sections exist */}
              {!hasDetailedInfo && product.features.length > 0 && (
                <div className="p-6 rounded-xl bg-card border border-border">
                  <h2 className="text-xl font-semibold mb-4">特徴</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Notice */}
              <div className="p-6 rounded-xl bg-destructive/10 border border-destructive/20">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  リスク・注意事項
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 本商品は投資助言ではありません。投資判断は自己責任で行ってください。</li>
                  <li>• 過去のバックテスト結果は将来の成績を保証するものではありません。</li>
                  <li>• インジケータのシグナルは参考情報であり、必ずしも利益を保証するものではありません。</li>
                  <li>• 必ずデモ口座でテストを行ってから実運用をご検討ください。</li>
                </ul>
              </div>
            </div>

            {/* Sidebar - Purchase Card */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 p-6 rounded-xl bg-card border border-border card-glow">
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground">販売価格</span>
                  <p className="font-mono text-4xl font-bold text-primary">
                    ¥{product.price.toLocaleString()}
                  </p>
                  <span className="text-sm text-muted-foreground">（税込）</span>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">対応プラットフォーム</span>
                    <span className="font-medium">{product.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">対象市場</span>
                    <span className="font-medium">{product.market}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">商品タイプ</span>
                    <span className="font-medium">インジケータ</span>
                  </div>
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full mb-4"
                  onClick={() => {
                    const added = addItem({
                      productId: product.slug,
                      name: product.name,
                      price: product.price,
                      platform: product.platform,
                      market: product.market,
                      image: product.image,
                    });
                    if (added) {
                      toast({
                        title: "カートに追加しました",
                        description: `${product.name}をカートに追加しました。`,
                      });
                    } else {
                      toast({
                        title: "既にカートに入っています",
                        description: `${product.name}は既にカートに追加されています。`,
                      });
                    }
                  }}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  カートに入れる
                </Button>

                <div className="text-xs text-muted-foreground space-y-2">
                  <p>• クレジットカード決済（Square）</p>
                  <p>• 銀行振込対応</p>
                  <p>• ご購入後すぐにダウンロード可能</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
