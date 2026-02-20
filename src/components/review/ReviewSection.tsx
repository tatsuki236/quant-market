import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/ui/star-rating";
import { useAuth } from "@/contexts/AuthContext";
import { useHasPurchased } from "@/hooks/use-article-purchase";
import {
  useReviews,
  useMyReview,
  useCreateReview,
  useUpdateReview,
  useDeleteReview,
} from "@/hooks/use-reviews";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Props = {
  productId: string;   // products.id (UUID)
  ratingAverage: number | null;
  ratingCount: number;
};

export default function ReviewSection({ productId, ratingAverage, ratingCount }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(productId);
  const { data: myReview } = useMyReview(productId);
  const { data: hasPurchased } = useHasPurchased(productId);
  const createReview = useCreateReview();
  const updateReview = useUpdateReview();
  const deleteReview = useDeleteReview();

  // 自分の customer_id 取得
  const { data: myCustomerId } = useQuery({
    queryKey: ["my-customer-id", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data?.id ?? null;
    },
    enabled: !!user,
  });

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const canReview = !!user && !!hasPurchased && !myReview && !!myCustomerId;
  const isSubmitting = createReview.isPending || updateReview.isPending;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "星評価を選択してください", variant: "destructive" });
      return;
    }
    try {
      await createReview.mutateAsync({
        product_id: productId,
        customer_id: myCustomerId!,
        auth_user_id: user!.id,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment("");
      toast({ title: "レビューを投稿しました" });
    } catch {
      toast({ title: "レビューの投稿に失敗しました", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (rating === 0 || !myReview) return;
    try {
      await updateReview.mutateAsync({
        id: myReview.id,
        product_id: productId,
        rating,
        comment: comment.trim() || null,
      });
      setIsEditing(false);
      toast({ title: "レビューを更新しました" });
    } catch {
      toast({ title: "レビューの更新に失敗しました", variant: "destructive" });
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    try {
      await deleteReview.mutateAsync({ id: myReview.id, product_id: productId });
      toast({ title: "レビューを削除しました" });
    } catch {
      toast({ title: "レビューの削除に失敗しました", variant: "destructive" });
    }
  };

  const startEdit = () => {
    if (!myReview) return;
    setRating(myReview.rating);
    setComment(myReview.comment ?? "");
    setIsEditing(true);
  };

  return (
    <div className="p-6 rounded-xl bg-card border border-border space-y-6">
      <h2 className="text-xl font-semibold">レビュー</h2>

      {/* サマリー */}
      <div className="flex items-center gap-4">
        {ratingCount > 0 ? (
          <>
            <span className="text-4xl font-bold text-primary">
              {(ratingAverage ?? 0).toFixed(1)}
            </span>
            <div>
              <StarRating mode="display" rating={ratingAverage} count={ratingCount} size="md" />
              <p className="text-sm text-muted-foreground mt-1">{ratingCount}件のレビュー</p>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">まだレビューはありません</p>
        )}
      </div>

      {/* 投稿フォーム / 状態メッセージ */}
      {!user && (
        <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          レビューを投稿するには
          <Link to="/auth" className="text-primary hover:underline ml-1">ログイン</Link>
          してください。
        </div>
      )}

      {user && !hasPurchased && !myReview && (
        <div className="p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          購入後にレビューを投稿できます。
        </div>
      )}

      {canReview && !isEditing && (
        <div className="space-y-3 p-4 rounded-lg border border-border">
          <p className="text-sm font-medium">レビューを投稿する</p>
          <StarRating mode="input" value={rating} onChange={setRating} size="md" />
          <Textarea
            placeholder="コメント（任意）"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button onClick={handleSubmit} disabled={isSubmitting} size="sm">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            投稿する
          </Button>
        </div>
      )}

      {/* 自分のレビュー編集中 */}
      {myReview && isEditing && (
        <div className="space-y-3 p-4 rounded-lg border border-primary/30">
          <p className="text-sm font-medium">レビューを編集</p>
          <StarRating mode="input" value={rating} onChange={setRating} size="md" />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleUpdate} disabled={isSubmitting} size="sm">
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              更新する
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              キャンセル
            </Button>
          </div>
        </div>
      )}

      {/* レビュー一覧 */}
      {reviewsLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!reviewsLoading && reviews.length > 0 && (
        <div className="space-y-4">
          {reviews.map((review) => {
            const isOwn = user && review.auth_user_id === user.id;
            return (
              <div key={review.id} className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{review.reviewer_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString("ja-JP")}
                    </span>
                  </div>
                  {isOwn && !isEditing && (
                    <div className="flex gap-1">
                      <button onClick={startEdit} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={handleDelete} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
                <StarRating mode="display" rating={review.rating} size="sm" />
                {review.comment && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
