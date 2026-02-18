import { Thermometer, Car, Cloud, BarChart3, Search, BookOpen, Heart, Sparkles } from "lucide-react";

const BeginnerGuideSection = () => {
  return (
    <section className="py-20 lg:py-28 border-t border-border">
      <div className="section-container">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">はじめての方へ</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            QuantMarket へようこそ
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            「株って難しそう」「チャートを見てもさっぱり分からない」——そう感じていませんか？
          </p>
          <p className="text-muted-foreground leading-relaxed mb-6">
            QuantMarket（クオンツマーケット）は、そんなあなたのための場所です。難しい専門知識がなくても、株式市場の「今」を分かりやすく見るためのお手伝いをします。
          </p>
          <p className="text-muted-foreground leading-relaxed">
            NISAを始めてみたいけど、何から手をつけていいか分からない。ニュースで「日経平均が上がった」と聞いても、自分には関係ないように感じる。そんな方こそ、ぜひ読み進めてみてください。
          </p>
        </div>

        {/* Stock Price Movement Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="p-8 lg:p-10 rounded-2xl bg-card border border-border">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              株価って、どうやって動いているの？
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                まず、株価の基本からお話しします。
              </p>
              <p className="leading-relaxed">
                株価は、毎日たくさんの人が「買いたい」「売りたい」と取引することで、上がったり下がったりしています。人気のある会社の株は買いたい人が多いので値段が上がり、逆に売りたい人が多いと値段が下がります。
              </p>
              <p className="leading-relaxed">
                この動きを<span className="text-foreground font-medium">「絵」にしたもの</span>が<span className="text-foreground font-medium">「チャート」</span>です。
              </p>
              <p className="leading-relaxed">
                チャートは、株価の動きを線やグラフで表したもの。横軸が時間、縦軸が値段です。過去から現在まで、株価がどう動いてきたかを一目で見ることができます。
              </p>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mt-6">
                <p className="text-sm text-foreground">
                  💡 たとえるなら、チャートは「株価の足あと」のようなもの。どこから来て、今どこにいるのかが分かります。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What is Indicator Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            インジケーターって何？
          </h3>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            インジケーターとは、チャートだけでは見えにくい情報を、分かりやすく数字や線で教えてくれる道具のこと。日常生活で例えると、こんなイメージです。
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-500/10 mb-4">
                <Thermometer className="h-6 w-6 text-red-500" />
              </div>
              <h4 className="font-semibold mb-3">体温計のようなもの</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                熱があるかどうかは、顔を見ただけでは分かりにくいですよね。体温計で測れば「37.5度か、少し熱があるな」と客観的に判断できます。インジケーターも同じで、株価が「熱くなりすぎていないか」「冷えすぎていないか」を数字で教えてくれます。
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/10 mb-4">
                <Car className="h-6 w-6 text-blue-500" />
              </div>
              <h4 className="font-semibold mb-3">カーナビのようなもの</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                知らない道を走るとき、カーナビがあれば安心ですよね。「この先、右に曲がります」と案内してくれる。インジケーターも、株価の動きに対して「この先、こういう傾向がありますよ」とヒントをくれる存在です。
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-sky-500/10 mb-4">
                <Cloud className="h-6 w-6 text-sky-500" />
              </div>
              <h4 className="font-semibold mb-3">天気予報のようなもの</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                明日の天気は、空を見ただけでは分かりません。でも天気予報を見れば「明日は雨かもしれないから傘を持っていこう」と準備ができます。インジケーターも「今の市場はこういう状態ですよ」と教えてくれるので、心の準備ができるのです。
              </p>
            </div>
          </div>
        </div>

        {/* Why Indicator Helps Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
            <h3 className="text-2xl font-bold mb-6">
              なぜインジケーターを見ると、株が分かりやすくなるの？
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                インジケーターを使う一番のメリットは、<span className="text-foreground font-medium">「感覚」や「勘」ではなく、客観的な情報をもとに市場を見られること</span>です。
              </p>
              <p className="leading-relaxed">
                たとえば、株価が急に上がったとき。「もっと上がるかも！」と焦って買いたくなるかもしれません。
                でもインジケーターを見れば、「今はちょっと上がりすぎかも」「そろそろ落ち着くかも」といった情報が分かることがあります。
              </p>
              <p className="leading-relaxed">
                逆に、株価が下がっているとき。「もうダメだ」と不安になるかもしれません。
                でもインジケーターが「そろそろ下げ止まりそう」と示していれば、冷静に状況を見ることができます。
              </p>
              <p className="leading-relaxed">
                つまり、インジケーターは<span className="text-foreground font-medium">「冷静な目」を持つための道具</span>。
                感情に振り回されず、落ち着いて市場を見るお手伝いをしてくれます。
              </p>
              <div className="p-4 rounded-lg bg-background/50 border border-border mt-6">
                <p className="text-foreground">
                  ✨ そして何より、インジケーターを使えば、投資を始めたばかりの方でも、
                  経験豊富な投資家と同じ視点で市場を見ることができるのです。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What You Can Do Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">
            QuantMarket でできること
          </h3>
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            QuantMarketは、日本株・米国株を中心に、株式市場を学ぶためのツールを提供しています。
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-3">株価チャートを見る</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                過去から現在まで、株価がどのように動いてきたかを確認できます。日々の値動きはもちろん、1週間、1ヶ月、1年といった長い期間での動きも見ることができます。
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
                <Search className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-3">市場の状態を理解する</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                チャートにインジケーターを重ねることで、「今、市場がどんな状態なのか」を把握できます。上がりやすい流れなのか、下がりやすい流れなのか、それとも落ち着いているのか——そういったことが見えてきます。
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card border border-border text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mx-auto mb-4">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <h4 className="font-semibold mb-3">過去と比較して学習する</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                「あのときはこうだった」「今回はどう違うのか」——過去のチャートと見比べることで、市場の動きのパターンを学ぶことができます。
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice Section */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="p-8 lg:p-10 rounded-2xl bg-accent/5 border border-accent/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Heart className="h-6 w-6 text-accent" />
              大切なこと
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed text-foreground font-medium">
                QuantMarketは、「すぐに売買するため」のツールではありません。「市場を理解するため」「学ぶため」のツールです。
              </p>
              <p className="leading-relaxed">
                インジケーターは、未来を100%当てる魔法の道具ではありません。天気予報が外れることがあるように、インジケーターの示す傾向が必ずしもその通りになるとは限りません。
              </p>
              <p className="leading-relaxed">
                だからこそ、焦らず、ゆっくりと。まずは「見る」ことから始めてみてください。
              </p>
              <p className="leading-relaxed">
                チャートを眺めてみる。インジケーターを重ねてみる。「へえ、こうなっているんだ」と思う。それだけで十分です。
              </p>
              <p className="leading-relaxed text-foreground">
                投資の判断は、ご自身の責任で、慎重に行ってください。QuantMarketは、その判断のための「目」を養うお手伝いをします。
              </p>
            </div>
          </div>
        </div>

        {/* Closing Section */}
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-6">
            分からないことがあっても大丈夫
          </h3>
          <div className="space-y-4 text-muted-foreground">
            <p className="leading-relaxed">
              「やっぱり難しそう」と思いましたか？
            </p>
            <p className="leading-relaxed">
              大丈夫です。最初は誰でも分からないことだらけ。私たちも、あなたと同じところからスタートしました。
            </p>
            <p className="leading-relaxed">
              QuantMarketでは、TradingView、MT4、MT5といった人気のチャートツールに対応したインジケーターを取り揃えています。FXや暗号資産の分析にも活用いただけますが、まずは身近な日本株や米国株から始めてみることをおすすめします。
            </p>
            <p className="leading-relaxed text-lg text-foreground font-medium mt-8">
              一歩ずつ、ゆっくりと。あなたのペースで、株式市場を知っていきましょう。
            </p>
            <p className="text-primary font-medium">
              QuantMarketは、あなたの「分かりたい」という気持ちに寄り添います。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeginnerGuideSection;
