import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useProductsByCategory } from "@/hooks/use-products";
import { StarRating } from "@/components/ui/star-rating";

const Articles = () => {
  const { data: articles = [], isLoading } = useProductsByCategory("有料記事");

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">電子書籍</h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              トレードの知見やノウハウをまとめた電子書籍です。無料パートで内容を確認してからご購入いただけます。
            </p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 mb-8">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/products/${article.slug}`}
                  className="group flex flex-col rounded-lg sm:rounded-xl bg-card border border-border/60 sm:border-border hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="aspect-square sm:aspect-video bg-muted overflow-hidden relative">
                    <img
                      src={article.image}
                      alt={article.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.status === '審査中' && (
                      <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded bg-yellow-500 text-white">審査中</span>
                    )}
                  </div>

                  {/* Mobile content — 楽天スタイル */}
                  <div className="px-1.5 pt-1.5 pb-2 flex flex-col flex-1 sm:hidden">
                    <h3 className="text-xs leading-[1.3] font-medium mb-1 group-hover:text-primary transition-colors line-clamp-2 break-words">
                      {article.name}
                    </h3>
                    {article.rating_count > 0 && (
                      <div className="mb-0.5">
                        <StarRating mode="compact" rating={article.rating_average} count={article.rating_count} size="sm" />
                      </div>
                    )}
                    <p className="font-mono text-sm font-bold text-primary mt-auto">
                      ¥{article.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Desktop content — MECE: 識別→商品情報→評価→価格 */}
                  <div className="p-4 hidden sm:flex flex-col flex-1">
                    {/* G1: 識別 */}
                    <div className="flex gap-1.5 mb-2">
                      <span className="px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary">
                        電子書籍
                      </span>
                    </div>
                    {/* G2: 商品情報 */}
                    <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                      {article.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
                      {article.description}
                    </p>
                    {/* G3: 評価 */}
                    {article.rating_count > 0 && (
                      <div className="mb-3">
                        <StarRating mode="compact" rating={article.rating_average} count={article.rating_count} size="sm" />
                      </div>
                    )}
                    {/* G4: 価格 */}
                    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                      <span className="text-xs text-muted-foreground">価格</span>
                      <span className="font-mono text-lg font-bold text-primary">
                        ¥{article.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!isLoading && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                現在、電子書籍はまだ公開されていません。
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Articles;
