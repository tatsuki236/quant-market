import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

/**
 * ブログページ
 * SEOキーワード: インジケータ 解説, テクニカル分析, MT4 MT5, TradingView,
 * トレード戦略, 株 FX 仮想通貨
 */

const Blog = () => {
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

          {/* Blog Posts */}
          <div className="max-w-4xl mx-auto space-y-8">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {post.tags[0]}
                  </span>
                </div>
                <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    続きを読む
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
