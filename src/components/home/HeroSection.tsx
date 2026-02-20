import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const HeroSection = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center text-white">
      {/* Background — テーマ別オーバーレイ、動画は共通 */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 z-10 ${isLight ? "bg-white/40" : "bg-black/60"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 opacity-80" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://cdn.pixabay.com/video/2023/10/22/186115-877653483_large.mp4"
            type="video/mp4"
          />
          <img
            src="https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2670&auto=format&fit=crop"
            alt="Trading Background"
            className="w-full h-full object-cover"
          />
        </video>
      </div>

      {/* Content */}
      <div className={`relative z-20 section-container text-center px-4 ${isLight ? "text-gray-900" : "text-white"}`}>
        {/* Animated Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full backdrop-blur-md mb-8 animate-fade-in group transition-colors cursor-default ${
          isLight
            ? "bg-gray-900/10 border border-gray-900/20 hover:bg-gray-900/20"
            : "bg-white/10 border border-white/20 hover:bg-white/20"
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className={`text-xs font-medium tracking-wide ${isLight ? "text-gray-700" : "text-gray-200"}`}>
            Next Gen Trading Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 animate-slide-up">
          <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
            isLight
              ? "from-gray-900 via-gray-700 to-gray-500"
              : "from-white via-gray-200 to-gray-400"
          }`}>
            Quant
          </span>
          <br />
          <span className={`text-4xl md:text-6xl lg:text-7xl font-light ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Market
          </span>
        </h1>

        {/* Subtitle */}
        <p className={`max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed font-light animate-slide-up ${isLight ? "text-gray-600" : "text-gray-300"}`} style={{ animationDelay: "0.1s" }}>
          高度な金融工学とAIを融合。
          <br className="hidden sm:block" />
          プロ仕様のインジケータで、あなたのトレードを次の次元へ。
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button variant="default" size="xl" className={`h-14 px-8 rounded-full font-semibold text-base transition-transform hover:scale-105 ${
            isLight
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-white text-black hover:bg-gray-200"
          }`} asChild>
            <Link to="/products">
              インジケータを探す
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className={`h-14 px-8 rounded-full backdrop-blur-sm font-medium text-base transition-all ${
            isLight
              ? "border-gray-900/30 text-gray-900 bg-gray-900/5 hover:bg-gray-900/10 hover:border-gray-900"
              : "border-white/30 text-white bg-white/5 hover:bg-white/10 hover:border-white"
          }`} asChild>
            <Link to="/about" className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              選ばれる理由
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mt-12 max-w-md mx-auto animate-fade-in opacity-80" style={{ animationDelay: '0.4s' }}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full opacity-30 group-hover:opacity-75 transition duration-500 blur"></div>
            <div className={`relative flex items-center backdrop-blur-xl rounded-full px-4 py-3 ${
              isLight
                ? "bg-white/70 border border-gray-300"
                : "bg-black/50 border border-white/10"
            }`}>
              <svg className={`w-5 h-5 ml-2 ${isLight ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="銘柄、インジケータ名を検索..."
                className={`w-full bg-transparent border-none focus:ring-0 text-sm ml-3 ${
                  isLight
                    ? "text-gray-900 placeholder-gray-500"
                    : "text-white placeholder-gray-400"
                }`}
              />
            </div>
          </div>
          <p className={`text-xs mt-3 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
            Popular: Moving Average, RSI, Bollinger Bands, AI Forecast
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
