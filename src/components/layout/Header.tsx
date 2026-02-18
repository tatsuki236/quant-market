import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, TrendingUp, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount } = useCart();
  const { user, seller } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/products", label: "商品一覧" },
    { path: "/buyers", label: "購入者ガイド" },
    { path: "/sellers", label: "出品者ガイド" },
    { path: "/announcements", label: "お知らせ" },
    { path: "/faq", label: "FAQ" },
  ];

  const authLink = user
    ? seller
      ? { path: "/seller/dashboard", label: "出品者管理" }
      : { path: "/account/mypage", label: "マイページ" }
    : { path: "/account/login", label: "ログイン" };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Quant<span className="text-primary">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive(link.path)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild>
              <Link to="/contact">お問い合わせ</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to={authLink.path} className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {authLink.label}
              </Link>
            </Button>
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
          </div>

          {/* Mobile Cart + Menu Button */}
          <div className="lg:hidden flex items-center gap-1">
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
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">テーマ</span>
                  <ThemeToggle />
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    お問い合わせ
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="justify-start gap-2">
                  <Link to={authLink.path} onClick={() => setMobileMenuOpen(false)}>
                    <User className="h-4 w-4" />
                    {authLink.label}
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild className="justify-start gap-2">
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <ShoppingCart className="h-4 w-4" />
                    カート
                    {itemCount > 0 && (
                      <span className="ml-1 flex items-center justify-center w-5 h-5 text-[11px] font-bold rounded-full bg-primary text-primary-foreground">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
