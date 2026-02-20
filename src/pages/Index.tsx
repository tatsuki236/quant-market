import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import WelcomeSection from "@/components/home/WelcomeSection";
import ProductCategorySlider from "@/components/home/ProductCategorySlider";
import AnnouncementsSection from "@/components/home/AnnouncementsSection";
import { useProductsByMarket, useProductsByCategory } from "@/hooks/use-products";
import { Loader2 } from "lucide-react";

/**
 * QuantMarket トップページ
 * 株・FX・仮想通貨インジケータ販売専門サイト
 *
 * SEOキーワード: QuantMarket, クオンツマーケット, 株 インジケータ, FX インジケータ,
 * 仮想通貨 インジケータ, テクニカルインジケータ, MT4 インジケータ, MT5 インジケータ,
 * TradingView インジケータ, システムトレード, アルゴリズム取引, クオンツ取引,
 * バックテスト, テクニカル分析, トレード戦略, 株式投資 初心者, NISA インジケーター
 */
const Index = () => {
  const { data: stockProducts = [], isLoading: stockLoading } = useProductsByMarket("株式");
  const { data: cryptoProducts = [], isLoading: cryptoLoading } = useProductsByMarket("仮想通貨");
  const { data: fxProducts = [], isLoading: fxLoading } = useProductsByMarket("FX");
  const { data: blogProducts = [], isLoading: blogLoading } = useProductsByCategory("有料記事");

  const isLoading = stockLoading || cryptoLoading || fxLoading || blogLoading;

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Welcome Section */}
      <WelcomeSection />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* 株式カルーセル */}
          {stockProducts.length > 0 && (
            <ProductCategorySlider
              title="株式インジケータ"
              products={stockProducts}
              viewAllLink="/products?market=株式"
            />
          )}

          {/* 仮想通貨カルーセル */}
          {cryptoProducts.length > 0 && (
            <ProductCategorySlider
              title="仮想通貨インジケータ"
              products={cryptoProducts}
              viewAllLink="/products?market=仮想通貨"
            />
          )}

          {/* FXカルーセル */}
          {fxProducts.length > 0 && (
            <ProductCategorySlider
              title="為替(FX)インジケータ"
              products={fxProducts}
              viewAllLink="/products?market=FX"
            />
          )}

          {/* 電子書籍 */}
          {blogProducts.length > 0 && (
            <ProductCategorySlider
              title="電子書籍"
              products={blogProducts}
              viewAllLink="/products?category=有料記事"
            />
          )}
        </>
      )}

      {/* お知らせ */}
      <AnnouncementsSection />
    </Layout>
  );
};

export default Index;
