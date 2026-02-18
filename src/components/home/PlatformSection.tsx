import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const platforms = [
  {
    name: "TradingView",
    fullName: "TradingView",
    description: "ブラウザベースの高機能チャートプラットフォーム。Pine Scriptによるインジケータ開発と、ソーシャルトレーディング機能が特徴です。",
    link: "/indicators/tradingview",
    features: ["Pine Script", "クラウドベース", "ソーシャル機能"],
  },
  {
    name: "MT4",
    fullName: "MetaTrader 4",
    description: "世界中のトレーダーに愛用されるFX・CFD取引プラットフォーム。豊富なカスタムインジケータに対応し、MQL4言語でのカスタマイズが可能です。",
    link: "/indicators/mt4",
    features: ["MQL4対応", "カスタムインジケータ", "豊富なテンプレート"],
  },
  {
    name: "MT5",
    fullName: "MetaTrader 5",
    description: "MT4の後継として開発された次世代プラットフォーム。株式・先物を含む幅広い市場に対応し、MQL5による高度な分析が可能です。",
    link: "/indicators/mt5",
    features: ["MQL5対応", "マルチアセット", "高度なバックテスト"],
  },
];

const PlatformSection = () => {
  return (
    <section className="py-20 lg:py-28 bg-card/30">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            主要プラットフォームに<span className="text-gradient-primary">完全対応</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            QuantMarketは、トレーダーに広く利用されているMT4・MT5・TradingViewの3つのプラットフォームに対応したインジケータを取り扱っています。
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              <div className="mb-4">
                <span className="text-2xl font-bold text-gradient-primary">
                  {platform.name}
                </span>
                <p className="text-sm text-muted-foreground mt-1">
                  {platform.fullName}
                </p>
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-1">
                {platform.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[68px] content-start">
                {platform.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground h-fit"
                  >
                    {feature}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-auto" asChild>
                <Link to={platform.link}>
                  {platform.name}インジケータを見る
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
