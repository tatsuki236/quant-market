import { TrendingUp, LineChart, CandlestickChart, Activity, Zap, Target } from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "トレンド分析インジケータ",
    description: "移動平均、MACD、ボリンジャーバンドなど、トレンド相場での売買シグナルを提供するテクニカル指標を豊富に取り揃えています。",
  },
  {
    icon: LineChart,
    title: "オシレーター系ツール",
    description: "RSI、ストキャスティクスなど、レンジ相場での買われすぎ・売られすぎを判断するためのインジケータを提供します。",
  },
  {
    icon: CandlestickChart,
    title: "マルチタイムフレーム対応",
    description: "複数の時間軸を同時に分析し、より精度の高いトレード戦略の構築をサポートするツールを取り扱っています。",
  },
  {
    icon: Activity,
    title: "バックテスト検証済み",
    description: "出品されるインジケータは過去データでの検証が推奨されており、トレード戦略の有効性を確認できます。",
  },
  {
    icon: Zap,
    title: "リアルタイムアラート",
    description: "売買シグナルの発生をリアルタイムで通知。チャンスを逃さないアラート機能を備えたインジケータを取り揃えています。",
  },
  {
    icon: Target,
    title: "裁量トレード支援",
    description: "システムトレードだけでなく、裁量トレーダーの判断を補助するためのビジュアルツールも充実しています。",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            テクニカルインジケータで<span className="text-gradient-primary">取引を最適化</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            QuantMarketでは、株式・FX・仮想通貨のトレードに活用できる多様なテクニカル分析ツールを提供しています。MT4、MT5、TradingViewに対応したインジケータで、あなたのトレード戦略を強化しましょう。
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 card-glow"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
