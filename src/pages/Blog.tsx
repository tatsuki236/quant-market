import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag, Loader2, FileText } from "lucide-react";
import { useProductsByCategory } from "@/hooks/use-products";

/**
 * ブログページ（電子書籍一覧）
 * SEOキーワード: インジケータ 解説, テクニカル分析, MT4 MT5, TradingView,
 * トレード戦略, 株 FX 仮想通貨
 */

const Blog = () => {
  const { data: articles = [], isLoading } = useProductsByCategory("有料記事");

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              QuantMarket ブログ
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              株式・FX・仮想通貨のテクニカル分析、インジケータの使い方、
              MT4・MT5・TradingViewのTips、トレード戦略など、
              トレーダーに役立つ情報を発信しています。
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(article.created_at).toLocaleDateString("ja-JP")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      {article.features[0]}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    <Link to={`/products/${article.slug}`}>{article.name}</Link>
                  </h2>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.features.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-lg font-bold text-primary">
                        ¥{article.price.toLocaleString()}
                      </span>
                      <Link
                        to={`/products/${article.slug}`}
                        className="inline-flex items-center text-sm text-primary hover:underline"
                      >
                        <FileText className="mr-1 h-4 w-4" />
                        続きを読む
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                現在、記事はまだ公開されていません。
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
