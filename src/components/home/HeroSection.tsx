import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden hero-gradient">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="relative section-container py-10 lg:py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* H1 */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 animate-slide-up">
            株・FX・仮想通貨の<span className="text-gradient-primary">インジケータ</span>を探す
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto mb-5 animate-slide-up leading-relaxed" style={{ animationDelay: "0.1s" }}>
            MT4・MT5・TradingView対応のテクニカルインジケータ専門マーケットプレイス
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row gap-3 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Button variant="hero" size="default" asChild>
              <Link to="/products">
                商品を探す
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="default" asChild>
              <Link to="/sellers">出品者になる</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
