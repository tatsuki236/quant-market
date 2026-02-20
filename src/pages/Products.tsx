import Layout from "@/components/layout/Layout";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Filter, Loader2 } from "lucide-react";
import { useState } from "react";
import { useProducts } from "@/hooks/use-products";
import { StarRating } from "@/components/ui/star-rating";

/**
 * 商品一覧ページ
 * SEOキーワード: インジケータ 販売, MT4 インジケータ, MT5 インジケータ,
 * TradingView インジケータ, FX インジケータ, 仮想通貨 インジケータ, 株 インジケータ
 */

const CategoryFilters = [
  { value: "すべて", label: "すべて" },
  { value: "indicator", label: "インジケータ" },
  { value: "有料記事", label: "電子書籍" },
];

const Filters = {
  platform: ["すべて", "MT4", "MT5", "TradingView"],
  market: ["すべて", "FX", "株式", "仮想通貨"],
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "すべて";
  const initialMarket = searchParams.get("market") || "すべて";
  const searchQuery = searchParams.get("q") || "";
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [platformFilter, setPlatformFilter] = useState("すべて");
  const [marketFilter, setMarketFilter] = useState(initialMarket);
  const { data: products = [], isLoading } = useProducts();

  const filteredProducts = products.filter((product) => {
    const categoryMatch = categoryFilter === "すべて" || product.category === categoryFilter;
    const platformMatch = platformFilter === "すべて" || product.platform.includes(platformFilter);
    const marketMatch = marketFilter === "すべて" || product.market === marketFilter;
    const queryMatch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && platformMatch && marketMatch && queryMatch;
  });

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {searchQuery ? `「${searchQuery}」の検索結果` : "商品一覧"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {searchQuery
                ? `${filteredProducts.length}件の商品が見つかりました。`
                : "QuantMarketでは、株式・FX・仮想通貨向けのテクニカルインジケータや電子書籍など、トレードに役立つ高品質なデジタル商品を取り揃えています。"}
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-8 p-2 sm:p-3 md:p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">フィルター:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CategoryFilters.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                    categoryFilter === cat.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex flex-wrap gap-2">
              {Filters.platform.map((platform) => (
                <button
                  key={platform}
                  onClick={() => setPlatformFilter(platform)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                    platformFilter === platform
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
            <div className="w-px h-6 bg-border hidden sm:block" />
            <div className="flex flex-wrap gap-2">
              {Filters.market.map((market) => (
                <button
                  key={market}
                  onClick={() => setMarketFilter(market)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                    marketFilter === market
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mb-8">
              {filteredProducts.map((product) => (
                <Link
                  key={product.slug}
                  to={`/products/${product.slug}`}
                  className="group flex flex-col rounded-lg sm:rounded-xl bg-card border border-border/60 sm:border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-square sm:aspect-video bg-muted overflow-hidden relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.status === '審査中' && (
                      <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded bg-yellow-500 text-white">審査中</span>
                    )}
                  </div>

                  {/* === Mobile content — 楽天スタイル === */}
                  <div className="px-1.5 pt-1.5 pb-2 flex flex-col flex-1 sm:hidden">
                    <h3 className="text-[11px] leading-[1.3] font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2 break-words">
                      {product.name}
                    </h3>
                    {product.rating_count > 0 && (
                      <div className="mb-0.5">
                        <StarRating mode="compact" rating={product.rating_average} count={product.rating_count} size="sm" />
                      </div>
                    )}
                    <p className="font-mono text-sm font-bold text-primary mt-auto">
                      ¥{product.price.toLocaleString()}
                    </p>
                  </div>

                  {/* === Desktop content (sm+) — MECE: 識別→商品情報→評価→価格 === */}
                  <div className="p-4 hidden sm:flex flex-col flex-1">
                    {/* G1: 識別 */}
                    <div className="flex gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                        {product.platform}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                        {product.market}
                      </span>
                    </div>
                    {/* G2: 商品情報 */}
                    <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
                      {product.description}
                    </p>
                    {/* G3: 評価 */}
                    {product.rating_count > 0 && (
                      <div className="mb-3">
                        <StarRating mode="compact" rating={product.rating_average} count={product.rating_count} size="sm" />
                      </div>
                    )}
                    {/* G4: 価格 */}
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <span className="text-xs text-muted-foreground">価格</span>
                      <span className="font-mono text-lg font-bold text-primary">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                条件に一致する商品が見つかりませんでした。
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryFilter("すべて");
                  setPlatformFilter("すべて");
                  setMarketFilter("すべて");
                }}
              >
                フィルターをリセット
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 border-t border-border">
        <div className="section-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">
              テクニカルインジケータとは
            </h2>
            <div className="text-muted-foreground space-y-4">
              <p className="leading-relaxed">
                QuantMarketでは、テクニカルインジケータを専門に取り扱っています。
                インジケータはチャート上にテクニカル分析の結果を表示するツールで、
                トレーダー自身が売買判断を行う「裁量トレード」を補助します。
              </p>
              <p className="leading-relaxed">
                移動平均、RSI、MACD、ボリンジャーバンドといった基本的な指標から、
                独自のロジックを組み込んだ高度な売買シグナルツールまで、
                多様なインジケータを取り揃えています。
              </p>
              <p className="leading-relaxed">
                MT4、MT5、TradingView対応の各種ツールを取り揃えておりますので、
                ご利用のプラットフォームに合わせてお選びください。
                バックテストを行い、過去データでの検証を経てからご利用いただくことを推奨しています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Products;
