import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { InventoryProvider } from "@/hooks/useInventory";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import About from "./pages/About";
import Cases from "./pages/Cases";
import Support from "./pages/Support";
import ProductPage from "./pages/ProductPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import CasePage from "./pages/CasePage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/ui/ToastContainer";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <InventoryProvider>
            <TooltipProvider>
              <ToastContainer />
              <div className="flex flex-col min-h-screen">
                {!isAdmin && <Header />}
                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/cases" element={<Cases />} />
                    <Route path="/case/:id" element={<CasePage />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                {!isAdmin && <Footer />}
              </div>
            </TooltipProvider>
          </InventoryProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
