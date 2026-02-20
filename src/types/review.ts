/** RPC get_product_reviews の返り値の1行 */
export type ReviewWithReviewer = {
  id: string;
  product_id: string;
  customer_id: string;
  auth_user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  reviewer_name: string;
};
