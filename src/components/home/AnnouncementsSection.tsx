import { Calendar } from "lucide-react";
import { useAnnouncements } from "@/hooks/use-announcements";

const AnnouncementsSection = () => {
  const { data: announcements = [] } = useAnnouncements();

  if (announcements.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="section-container">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6">お知らせ</h2>
        <ul className="space-y-2 sm:space-y-3">
          {announcements.map((item) => (
            <li
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 p-3 sm:p-4 rounded-lg bg-card border border-border"
            >
              <span className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {new Date(item.published_at).toLocaleDateString("ja-JP")}
              </span>
              <span className="text-sm font-medium">{item.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AnnouncementsSection;
