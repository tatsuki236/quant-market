import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Indicators from "./pages/Indicators";
import Products from "./pages/Products";
import Articles from "./pages/Articles";
import ProductDetail from "./pages/ProductDetail";
import Buyers from "./pages/Buyers";
import Sellers from "./pages/Sellers";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import ContactThanks from "./pages/ContactThanks";
import Announcements from "./pages/Announcements";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Law from "./pages/Law";
import PaymentMethods from "./pages/PaymentMethods";
import Cart from "./pages/Cart";
import Purchase from "./pages/Purchase";
import PurchaseComplete from "./pages/PurchaseComplete";
import NotFound from "./pages/NotFound";

// Seller pages
import SellerLogin from "./pages/seller/SellerLogin";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductForm from "./pages/seller/SellerProductForm";
import SellerProfile from "./pages/seller/SellerProfile";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSellers from "./pages/admin/AdminSellers";
import AdminOrders from "./pages/admin/AdminOrders";

// Auth pages
import AuthCallback from "./pages/auth/AuthCallback";

// Buyer pages
import BuyerLogin from "./pages/account/BuyerLogin";
import BuyerRegister from "./pages/account/BuyerRegister";
import ForgotPassword from "./pages/account/ForgotPassword";
import ResetPassword from "./pages/account/ResetPassword";
import MyPage from "./pages/account/MyPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Main Pages */}
          <Route path="/" element={<Index />} />

          {/* Indicator Categories */}
          <Route path="/indicators" element={<Indicators />} />
          <Route path="/indicators/:category" element={<Indicators />} />

          {/* Products */}
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />

          {/* Articles */}
          <Route path="/articles" element={<Articles />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Purchase />} />
          <Route path="/purchase/complete" element={<PurchaseComplete />} />

          {/* Guides */}
          <Route path="/buyers" element={<Buyers />} />
          <Route path="/sellers" element={<Sellers />} />

          {/* Support */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/thanks" element={<ContactThanks />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />

          {/* Announcements */}
          <Route path="/announcements" element={<Announcements />} />

          {/* Legal & Company */}
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/law" element={<Law />} />

          {/* Auth Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Seller Routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/register" element={<SellerRegister />} />
          <Route path="/seller/dashboard" element={
            <ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/seller/products" element={
            <ProtectedRoute requireSeller><SellerProducts /></ProtectedRoute>
          } />
          <Route path="/seller/products/new" element={
            <ProtectedRoute requireSeller><SellerProductForm /></ProtectedRoute>
          } />
          <Route path="/seller/products/:id" element={
            <ProtectedRoute requireSeller><SellerProductForm /></ProtectedRoute>
          } />
          <Route path="/seller/profile" element={
            <ProtectedRoute requireSeller><SellerProfile /></ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute requireAdmin><AdminProducts /></ProtectedRoute>
          } />
          <Route path="/admin/sellers" element={
            <ProtectedRoute requireAdmin><AdminSellers /></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>
          } />

          {/* Buyer / Account Routes */}
          <Route path="/account/login" element={<BuyerLogin />} />
          <Route path="/account/register" element={<BuyerRegister />} />
          <Route path="/account/forgot-password" element={<ForgotPassword />} />
          <Route path="/account/reset-password" element={<ResetPassword />} />
          <Route path="/account/mypage" element={
            <ProtectedRoute redirectTo="/account/login"><MyPage /></ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
