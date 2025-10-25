
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0e0e0e]">
      {/* Простой тёмный фон */}
      <div className="absolute inset-0 bg-[#0e0e0e]"></div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-[#181818] border border-[#a31212] rounded-full text-[#a31212] text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-fade-in">
              🔥 Лучший игровой маркетплейс 2025
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 text-[#f0f0f0] leading-tight animate-fade-in px-2">
            Покупай игровые товары
            <br />
            <span className="text-[#a31212]">
              мгновенно
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#a0a0a0] mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up px-4">
            Тысячи товаров для твоих любимых игр. Безопасные покупки, мгновенная доставка и лучшие цены на рынке.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link to="/#products">
              <Button size="lg" className="bg-[#a31212] hover:bg-[#8a0f0f] border-none text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-lg sm:rounded-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                Начать покупки
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#1c1c1c] hover:border-[#a31212] hover:text-[#f0f0f0] text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-lg sm:rounded-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
              >
                Узнать больше
              </Button>
            </Link>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center p-4 sm:p-6 bg-[#181818] backdrop-blur-sm rounded-lg sm:rounded-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 transform hover:scale-105 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a31212] rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-[#f0f0f0] font-semibold mb-2 text-sm sm:text-base">Мгновенная доставка</h3>
              <p className="text-[#a0a0a0] text-xs sm:text-sm text-center">Получай товары сразу после покупки</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 bg-[#181818] backdrop-blur-sm rounded-lg sm:rounded-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 transform hover:scale-105 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a31212] rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-300">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-[#f0f0f0] font-semibold mb-2 text-sm sm:text-base">100% безопасность</h3>
              <p className="text-[#a0a0a0] text-xs sm:text-sm text-center">Гарантия возврата средств</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 bg-[#181818] backdrop-blur-sm rounded-lg sm:rounded-xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 transform hover:scale-105 group sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#a31212] rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-105 transition-all duration-300">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-[#f0f0f0] font-semibold mb-2 text-sm sm:text-base">24/7 поддержка</h3>
              <p className="text-[#a0a0a0] text-xs sm:text-sm text-center">Всегда готовы помочь</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
