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
        <div className="px-12">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
          >
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem
                  key={product.slug}
                  className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-glow h-full overflow-hidden flex flex-col">
                    <Link
                      to={`/products/${product.slug}`}
                      className="group block flex-1"
                    >
                      <div className="aspect-video bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <product.icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex gap-1.5">
                            <span className="px-1.5 py-0.5 text-xs rounded bg-secondary text-secondary-foreground">
                              {product.platform}
                            </span>
                            <span className="px-1.5 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                              {product.market}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-base font-semibold mb-1.5 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {product.features.map((feature, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ProductCategorySlider;
