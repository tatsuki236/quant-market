import { useHasPurchased } from "@/hooks/use-article-purchase";
import { useAuth } from "@/contexts/AuthContext";
import PaywallGate from "./PaywallGate";
import type { Product } from "@/types/product";
import { useRef, useEffect } from "react";

const PROSE_CLASSES =
  "prose prose-sm sm:prose dark:prose-invert max-w-none [&_img]:rounded-lg [&_img]:max-w-full [&_pre]:relative [&_pre]:bg-[#1e1e2e] [&_pre]:text-[#cdd6f4] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:pr-14 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-sm [&_pre_code]:font-mono [&_mark]:rounded [&_mark]:px-0.5 [&_a]:text-primary [&_a]:underline";

/** コンテナ内の <pre> にコピーボタンを付与 */
function useCodeCopyButtons(ref: React.RefObject<HTMLDivElement | null>, deps: unknown[]) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pres = el.querySelectorAll("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".code-copy-btn")) return;
      const btn = document.createElement("button");
      btn.className =
        "code-copy-btn absolute top-2 right-2 px-2 py-1 text-xs rounded-md bg-white/10 hover:bg-white/20 text-[#cdd6f4] transition-colors select-none";
      btn.textContent = "コピー";
      btn.onclick = () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        navigator.clipboard.writeText(code);
        btn.textContent = "コピー済み ✓";
        setTimeout(() => { btn.textContent = "コピー"; }, 2000);
      };
      pre.style.position = "relative";
      pre.appendChild(btn);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

type ArticleDetailProps = {
  product: Product;
};

const ArticleDetail = ({ product }: ArticleDetailProps) => {
  const { user } = useAuth();
  const { data: hasPurchased = false } = useHasPurchased(product.id);
  const freeRef = useRef<HTMLDivElement>(null);
  const paidRef = useRef<HTMLDivElement>(null);

  // 出品者自身の記事は全文表示
  const isSeller = !!user && product.seller_id === user.id;
  const canViewPaid = hasPurchased || isSeller;

  useCodeCopyButtons(freeRef, [product.free_content]);
  useCodeCopyButtons(paidRef, [product.paid_content, canViewPaid]);

  return (
    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
      {/* 無料パート */}
      {product.free_content && (
        <div className="p-4 sm:p-6 rounded-xl bg-card border border-border">
          <div
            ref={freeRef}
            className={PROSE_CLASSES}
            dangerouslySetInnerHTML={{ __html: product.free_content }}
          />
        </div>
      )}

      {/* 有料パート or ペイウォール */}
      {product.paid_content && (
        canViewPaid ? (
          <div className="p-4 sm:p-6 rounded-xl bg-card border border-border">
            <div
              ref={paidRef}
              className={PROSE_CLASSES}
              dangerouslySetInnerHTML={{ __html: product.paid_content }}
            />
          </div>
        ) : (
          <PaywallGate product={product} />
        )
      )}
    </div>
  );
};

export default ArticleDetail;
