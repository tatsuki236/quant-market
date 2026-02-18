import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ShoppingBag } from "lucide-react";

const CTASection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} className="py-20 lg:py-28 bg-card/30">
      <div className="section-container">
        <div className="grid md:grid-cols-2 gap-8">
          {/* For Buyers */}
          <div className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 mb-6">
                <ShoppingBag className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                インジケータを<span className="text-primary">購入</span>したい方へ
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                株式・FX・仮想通貨のトレードに活用できる高品質なテクニカルインジケータを探しているなら、QuantMarketにお任せください。MT4・MT5・TradingView対応の多様なツールを取り揃えています。
              </p>
              <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  インジケータとは何か、基礎から解説
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  プラットフォーム別の使い方
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  バックテストの重要性
                </li>
              </ul>
              <Button variant="hero" size="lg" asChild>
                <Link to="/buyers">
                  購入者ガイドを見る
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* For Sellers */}
          <div className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-accent/20 mb-6">
                <Users className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">
                インジケータを<span className="text-gradient-accent">出品</span>したい方へ
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                MQL4・MQL5・Pine Scriptでインジケータを開発している方、QuantMarketで販売してみませんか？専門性の高いマーケットで、あなたの技術を収益化するチャンスです。
              </p>
              <ul className="space-y-2 mb-8 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  インジケータ専門のマーケット
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  透明性の高い運営方針
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  適正な収益配分
                </li>
              </ul>
              <Button variant="accent" size="lg" asChild>
                <Link to="/sellers">
                  出品者ガイドを見る
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

CTASection.displayName = "CTASection";

export default CTASection;
