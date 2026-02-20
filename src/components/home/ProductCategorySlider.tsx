import { Link } from "react-router-dom";
import { ArrowRight, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";

type ProductCategorySliderProps = {
  title: string;
  products: Product[];
  viewAllLink: string;
};

const ProductCategorySlider = ({
  title,
  products,
  viewAllLink,
}: ProductCategorySliderProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  return (
    <section className="py-12 lg:py-16 border-t border-border">
      <div className="section-container">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            全体を表示する
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="sm:px-6 md:px-12">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
            >
              <CarouselContent className="-ml-2 sm:-ml-4">
                {products.map((product) => (
                  <CarouselItem
                    key={product.slug}
                    className="pl-2 sm:pl-4 basis-[44%] sm:basis-1/2 lg:basis-1/3"
                  >
                    {/* === Desktop Card (sm+) === */}
                    <div className="hidden sm:flex rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 h-full overflow-hidden flex-col">
                      <Link
                        to={`/products/${product.slug}`}
                        className="group flex flex-col flex-1"
                      >
                        <div className="aspect-video bg-muted overflow-hidden relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.status === '審査中' && (
                            <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded bg-yellow-500 text-white">審査中</span>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          {/* G1: 識別 — プラットフォーム・市場 */}
                          <div className="flex gap-1.5 mb-2">
                            <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                              {product.platform}
                            </span>
                            <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                              {product.market}
                            </span>
                          </div>
                          {/* G2: 商品情報 — 名前・説明 */}
                          <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                            {product.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                          {/* G3: 評価 */}
                          {product.rating_count > 0 && (
                            <div className="mb-3">
                              <StarRating mode="compact" rating={product.rating_average} count={product.rating_count} size="sm" />
                            </div>
                          )}
                          {/* G4: 価格 */}
                          <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                            <span className="text-xs text-muted-foreground">価格</span>
                            <span className="font-mono text-lg font-bold text-primary">
                              ¥{product.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1.5"
                          onClick={() => {
                            const added = addItem({
                              productId: product.slug,
                              name: product.name,
                              price: product.price,
                              platform: product.platform,
                              market: product.market,
                              image: product.image,
                            });
                            if (added) {
                              toast({
                                title: "カートに追加しました",
                                description: `${product.name}をカートに追加しました。`,
                              });
                            } else {
                              toast({
                                title: "既にカートに入っています",
                                description: `${product.name}は既にカートに追加されています。`,
                              });
                            }
                          }}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          カートに入れる
                        </Button>
                      </div>
                    </div>

                    {/* === Mobile Card (< sm) — 楽天スタイル === */}
                    <Link
                      to={`/products/${product.slug}`}
                      className="group sm:hidden block rounded-lg bg-card border border-border/60 h-full overflow-hidden"
                    >
                      <div className="aspect-square bg-muted overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                        {product.status === '審査中' && (
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] font-bold rounded bg-yellow-500 text-white">審査中</span>
                        )}
                      </div>
                      <div className="px-1.5 pt-1.5 pb-2">
                        <h3 className="text-[11px] leading-[1.3] font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors min-h-[1.8em] break-words">
                          {product.name}
                        </h3>
                        {product.rating_count > 0 && (
                          <div className="mb-0.5">
                            <StarRating mode="compact" rating={product.rating_average} count={product.rating_count} size="sm" />
                          </div>
                        )}
                        <p className="font-mono text-sm font-bold text-primary">
                          ¥{product.price.toLocaleString()}
                        </p>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>

          {/* Mobile scroll hint gradient */}
          <div className="sm:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
        </div>
      </div>
    </section>
  );
};

export default ProductCategorySlider;
