import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag, FileText } from "lucide-react";
import { useProductsByCategory } from "@/hooks/use-products";

const NewsSection = () => {
  const { data: articles = [] } = useProductsByCategory("有料記事");
  const latestArticles = articles.slice(0, 3);

  if (latestArticles.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">最新の電子書籍</h2>
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            もっと見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Article Cards */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {latestArticles.map((article) => (
            <Link
              key={article.slug}
              to={`/products/${article.slug}`}
              className="group flex flex-col p-3 sm:p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(article.created_at).toLocaleDateString("ja-JP")}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {article.features[0]}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2 min-h-[2.75rem]">
                {article.name}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 min-h-[3rem]">
                {article.description}
              </p>
              <div className="flex items-center justify-between mt-auto pt-3">
                <span className="inline-flex items-center text-xs text-primary">
                  <FileText className="mr-1 h-3.5 w-3.5" />
                  続きを読む
                </span>
                <span className="font-mono text-sm font-bold text-primary">
                  ¥{article.price.toLocaleString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
