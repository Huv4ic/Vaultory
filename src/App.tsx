
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/about" element={<About />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/support" element={<Support />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            {/* Заглушки для страниц в разработке */}
            <Route path="/profile" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Профиль</h1><p className="text-gray-400">Войдите через Telegram</p></div></div>} />
            <Route path="/cart" element={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center"><div className="text-center"><h1 className="text-4xl font-bold mb-4">Корзина</h1><p className="text-gray-400">Ваша корзина пуста</p></div></div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
