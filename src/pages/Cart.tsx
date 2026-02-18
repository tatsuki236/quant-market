import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="py-16 lg:py-20">
          <div className="section-container text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <ShoppingCart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">カートは空です</h1>
            <p className="text-muted-foreground mb-8">
              商品をカートに追加してください。
            </p>
            <Button variant="hero" asChild>
              <Link to="/products">
                商品を探す
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 lg:py-20">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">ショッピングカート</h1>
            <p className="text-muted-foreground mb-8">
              {items.length}件の商品がカートに入っています
            </p>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
                  >
                    <div className="w-20 h-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.platform} / {item.market}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono text-lg font-bold text-primary">
                        ¥{item.price.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`${item.name}を削除`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 p-6 rounded-xl bg-card border border-border card-glow">
                  <h2 className="text-lg font-semibold mb-4">ご注文内容</h2>
                  <div className="space-y-3 mb-6 text-sm">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between">
                        <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                        <span className="font-mono flex-shrink-0">¥{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-border mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">合計（税込）</span>
                      <span className="font-mono text-2xl font-bold text-primary">
                        ¥{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Button variant="hero" size="lg" className="w-full" asChild>
                    <Link to="/checkout">
                      購入手続きへ
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
