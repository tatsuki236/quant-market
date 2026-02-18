import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const Footer = forwardRef<HTMLElement>((_, ref) => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    products: [
      { path: "/products?market=株式", label: "株式インジケータ" },
      { path: "/products?market=仮想通貨", label: "仮想通貨インジケータ" },
      { path: "/products?market=FX", label: "為替(FX)インジケータ" },
      { path: "/products?category=有料記事", label: "有料ブログ" },
    ],
    support: [
      { path: "/buyers", label: "購入者ガイド" },
      { path: "/sellers", label: "出品者ガイド" },
      { path: "/faq", label: "よくある質問" },
      { path: "/contact", label: "お問い合わせ" },
      { path: "/payment-methods", label: "お支払い方法" },
    ],
    company: [
      { path: "/about", label: "運営者情報" },
      { path: "/announcements", label: "お知らせ" },
      { path: "/terms", label: "利用規約" },
      { path: "/privacy", label: "プライバシーポリシー" },
      { path: "/disclaimer", label: "免責事項" },
      { path: "/law", label: "特定商取引法表記" },
    ],
  };

  return (
    <footer ref={ref} className="border-t border-border bg-card">
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 md:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-bold">
                Quant<span className="text-primary">Market</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              株・FX・仮想通貨向けのインジケータ販売専門マーケット
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              MT4 / MT5 / TradingView 対応
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-sm mb-4">商品カテゴリ</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4">サポート</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4">運営情報</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {currentYear} QuantMarket（クオンツマーケット）. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              株式・FX・仮想通貨のテクニカル分析ツール専門マーケットプレイス
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;
