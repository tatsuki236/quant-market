import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DollarSign, Bitcoin, Building2, ArrowRight } from "lucide-react";

const markets = [
  {
    icon: Building2,
    name: "株式（日本株・米国株）",
    description: "株式市場向けのテクニカルインジケータ。個別銘柄やインデックスの分析に活用できるツールを提供。ファンダメンタルズ分析と組み合わせることで、より精度の高い投資判断をサポートします。",
    link: "/indicators/stocks",
    keywords: ["株 インジケータ", "株式 テクニカル分析", "銘柄分析"],
  },
  {
    icon: Bitcoin,
    name: "仮想通貨（暗号資産）",
    description: "ビットコインやアルトコインなど、仮想通貨市場向けのテクニカル分析ツール。24時間365日動く暗号資産市場の特性を考慮したインジケータを取り揃えています。",
    link: "/indicators/crypto",
    keywords: ["仮想通貨 インジケータ", "ビットコイン 分析", "暗号資産 トレード"],
  },
  {
    icon: DollarSign,
    name: "FX（外国為替）",
    description: "為替市場向けのテクニカルインジケータ。通貨ペアの動きを分析し、エントリーポイントやトレンドの判断を支援します。スキャルピングからスイングトレードまで、様々な取引スタイルに対応したツールを提供しています。",
    link: "/indicators/fx",
    keywords: ["FX インジケータ", "為替 トレード", "通貨ペア分析"],
  },
];

const MarketSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            3つの市場に<span className="text-gradient-primary">対応</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            QuantMarketでは、株式・FX・仮想通貨の3つの主要市場に対応したインジケータを取り扱っています。各市場の特性を踏まえたテクニカル分析ツールで、トレード戦略を構築しましょう。
          </p>
        </div>

        {/* Market Cards */}
        <div className="grid lg:grid-cols-3 gap-8">
          {markets.map((market, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-xl bg-gradient-to-b from-card to-background border border-border hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors mb-6">
                <market.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{market.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed flex-grow">
                {market.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6 min-h-[60px] content-start">
                {market.keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground h-fit"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <Button variant="glow" size="sm" className="w-full mt-auto" asChild>
                <Link to={market.link}>
                  インジケータを探す
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

export default MarketSection;
