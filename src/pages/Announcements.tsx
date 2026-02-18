import Layout from "@/components/layout/Layout";
import { Calendar, Loader2 } from "lucide-react";
import { useAnnouncements } from "@/hooks/use-announcements";

const Announcements = () => {
  const { data: announcements = [], isLoading } = useAnnouncements();

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">お知らせ</h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              QuantMarketからの最新のお知らせを掲載しています。
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="max-w-4xl mx-auto text-center py-12">
              <p className="text-muted-foreground">現在お知らせはありません。</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {announcements.map((item) => (
                <article
                  key={item.id}
                  className="p-5 rounded-xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground whitespace-nowrap pt-0.5">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.published_at).toLocaleDateString("ja-JP")}
                    </span>
                    <div>
                      <h2 className="text-sm font-medium mb-1">
                        {item.title}
                      </h2>
                      {item.content && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.content}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Announcements;
