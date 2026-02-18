import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";

const NewsSection = () => {
  const latestPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">最新ブログ</h2>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            もっと見る
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Blog Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {post.tags[0]}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
              <div className="mt-3 inline-flex items-center text-xs text-primary">
                続きを読む
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
