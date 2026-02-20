import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu, X, TrendingUp, ShoppingCart, UserPlus, LogIn,
  Search, User, LayoutDashboard, BarChart3, BookOpen, Store,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { user, seller } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "?");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const closeMobile = () => setMobileMenuOpen(false);

  /* ========== MECE ナビ定義 ========== */
  // グループ1: 商品カテゴリ（ME: 商品種別で排他, CE: 全商品をカバー）
  const productLinks = [
    { path: "/products", label: "インジケータ", icon: BarChart3 },
    { path: "/articles", label: "電子書籍", icon: BookOpen },
  ];
  // グループ2: 出品（売り手向け — 買い手導線と排他）
  const sellLink = { path: "/sellers", label: "出品する", icon: Store };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="section-container">
        {/*
         * ════════════════════════════════════════
         *  MECE ヘッダー構造
         *  ─────────────────
         *  常時表示:  ロゴ（ブランド） | 検索（横断ユーティリティ） | カート（購入） | メニュー
         *  デスクトップ: ロゴ | G1:商品カテゴリ | 検索 | G2:出品 | G3:アカウント
         *  メニュー内:  G1:商品カテゴリ | G2:出品 | G3:アカウント（検索は除外＝ヘッダーに常駐）
         * ════════════════════════════════════════
         */}

        {/* ── Row 1: ロゴ + 検索 + アクション ── */}
        <div className="flex h-14 items-center gap-2 lg:gap-0">

          {/* ── ロゴ ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0 lg:mr-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:inline text-lg font-bold tracking-tight">
              Quant<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* ── Desktop: グループ1 商品カテゴリ ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-shrink-0">
            {productLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                  isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── 検索窓（横断ユーティリティ — 全デバイス常時表示） ── */}
          <form onSubmit={handleSearch} className="flex-1 min-w-0 mx-2 lg:mx-4">
            <div className="relative lg:max-w-sm lg:mx-auto">
              <Search className="absolute left-2.5 lg:left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="何をお探しですか？"
                className="w-full pl-8 lg:pl-9 pr-3 py-1.5 text-sm rounded-lg border border-border bg-muted/50 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
              />
            </div>
          </form>

          {/* ── Desktop: ユーザーアクション ── */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
            <ThemeToggle />

            {/* カート */}
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 relative">
              <Link to="/cart" aria-label="カート">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-primary text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>

            {/* 区切り */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* 出品する */}
            <Button variant="ghost" size="sm" asChild>
              <Link
                to={sellLink.path}
                className={`flex items-center gap-1.5 ${
                  isActive(sellLink.path) ? "text-primary" : ""
                }`}
              >
                <Store className="h-4 w-4" />
                出品する
              </Link>
            </Button>

            {/* 区切り */}
            <div className="w-px h-5 bg-border mx-1" />

            {/* アカウント */}
            {user ? (
              <Button variant="ghost" size="sm" asChild>
                <Link
                  to={seller ? "/seller/dashboard" : "/account/mypage"}
                  className="flex items-center gap-1.5"
                >
                  {seller ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {seller ? "出品者管理" : "マイページ"}
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/account/register" className="flex items-center gap-1.5">
                    <UserPlus className="h-4 w-4" />
                    会員登録
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/account/login" className="flex items-center gap-1.5">
                    <LogIn className="h-4 w-4" />
                    ログイン
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* ── Mobile: カート + メニュー ── */}
          <div className="lg:hidden flex items-center gap-0.5 flex-shrink-0">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9 relative">
              <Link to="/cart" aria-label="カート">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-primary text-primary-foreground animate-fade-in">
                    {itemCount}
                  </span>
                )}
              </Link>
            </Button>
            <button
              className="p-2 rounded-md hover:bg-secondary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* ══════ モバイルメニュー（MECEグループ別 — 検索はヘッダー常駐のため除外） ══════ */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-0.5">
              {/* グループ1: 商品カテゴリ（ME: 種別で排他, CE: 全商品カバー） */}
              <p className="px-3 pt-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                商品を探す
              </p>
              {productLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={closeMobile}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}

              {/* グループ2: 出品（売り手導線 — 買い手導線と排他） */}
              <div className="my-2 border-t border-border" />
              <p className="px-3 pt-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                出品する
              </p>
              <Link
                to={sellLink.path}
                onClick={closeMobile}
                className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                  isActive(sellLink.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <sellLink.icon className="h-4 w-4" />
                {sellLink.label}
              </Link>

              {/* グループ3: アカウント（認証・設定） */}
              <div className="my-2 border-t border-border" />
              <p className="px-3 pt-1 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                アカウント
              </p>

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm text-muted-foreground">テーマ</span>
                <ThemeToggle />
              </div>

              {user ? (
                <Link
                  to={seller ? "/seller/dashboard" : "/account/mypage"}
                  onClick={closeMobile}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {seller ? <LayoutDashboard className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  {seller ? "出品者管理" : "マイページ"}
                </Link>
              ) : (
                <>
                  <Link
                    to="/account/register"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    会員登録
                  </Link>
                  <Link
                    to="/account/login"
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <LogIn className="h-4 w-4" />
                    ログイン
                  </Link>
                </>
              )}

              <Link
                to="/cart"
                onClick={closeMobile}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                カート
                {itemCount > 0 && (
                  <span className="ml-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-primary text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
