import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const sizeMap: Record<Size, { star: string; text: string }> = {
  sm: { star: "h-3.5 w-3.5", text: "text-xs" },
  md: { star: "h-5 w-5", text: "text-sm" },
  lg: { star: "h-6 w-6", text: "text-base" },
};

type StarRatingProps =
  | {
      mode: "compact";
      rating: number | null;
      count: number;
      size?: Size;
    }
  | {
      mode: "display";
      rating: number | null;
      count?: number;
      size?: Size;
    }
  | {
      mode: "input";
      value: number;
      onChange: (value: number) => void;
      size?: Size;
    };

export function StarRating(props: StarRatingProps) {
  const size = props.mode === "input" ? (props.size ?? "md") : (props.size ?? "sm");
  const s = sizeMap[size];

  // compact: 星5個アイコン + 件数
  if (props.mode === "compact") {
    if (!props.rating || props.count === 0) return null;
    const r = props.rating;
    const full = Math.floor(r);
    const hasHalf = r - full >= 0.25 && r - full < 0.75;
    const fullCeil = r - full >= 0.75 ? full + 1 : full;
    const empty = 5 - fullCeil - (hasHalf ? 1 : 0);
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: fullCeil }).map((_, i) => (
          <Star key={`f${i}`} className={cn(s.star, "fill-yellow-500 text-yellow-500")} />
        ))}
        {hasHalf && (
          <StarHalf className={cn(s.star, "fill-yellow-500 text-yellow-500")} />
        )}
        {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
          <Star key={`e${i}`} className={cn(s.star, "text-muted-foreground/30")} />
        ))}
        <span className={cn("text-muted-foreground ml-0.5", s.text)}>({props.count})</span>
      </div>
    );
  }

  // display: 星アイコン + 件数
  if (props.mode === "display") {
    const rating = props.rating ?? 0;
    const full = Math.floor(rating);
    const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
    const fullCeil = rating - full >= 0.75 ? full + 1 : full;
    const empty = 5 - fullCeil - (hasHalf ? 1 : 0);

    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullCeil }).map((_, i) => (
          <Star key={`f${i}`} className={cn(s.star, "fill-yellow-500 text-yellow-500")} />
        ))}
        {hasHalf && (
          <StarHalf className={cn(s.star, "fill-yellow-500 text-yellow-500")} />
        )}
        {Array.from({ length: Math.max(0, empty) }).map((_, i) => (
          <Star key={`e${i}`} className={cn(s.star, "text-muted-foreground/40")} />
        ))}
        {props.count !== undefined && (
          <span className={cn("text-muted-foreground ml-1", s.text)}>({props.count})</span>
        )}
      </div>
    );
  }

  // input: クリックで星選択
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => props.onChange(v)}
          className="p-0.5 transition-colors hover:scale-110"
        >
          <Star
            className={cn(
              s.star,
              v <= props.value
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground/40 hover:text-yellow-500/60"
            )}
          />
        </button>
      ))}
    </div>
  );
}
