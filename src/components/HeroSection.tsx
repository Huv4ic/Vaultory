
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-amber-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] border border-amber-500/10 rounded-full animate-spin" style={{animationDuration: '25s'}}></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs sm:text-sm font-medium mb-4 sm:mb-6 animate-fade-in">
              🔥 Лучший игровой маркетплейс 2025
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-transparent leading-tight animate-fade-in px-2">
            Покупай игровые товары
            <br />
            <span className="bg-gradient-to-r from-amber-500 to-emerald-600 bg-clip-text text-transparent">
              мгновенно
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up px-4">
            Тысячи товаров для твоих любимых игр. Безопасные покупки, мгновенная доставка и лучшие цены на рынке.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
            <Link to="/catalog">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 border-none text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-lg sm:rounded-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 w-full sm:w-auto">
                Начать покупки
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 rounded-lg sm:rounded-xl transform hover:scale-105 transition-all duration-500 w-full sm:w-auto"
              >
                Узнать больше
              </Button>
            </Link>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-3xl mx-auto px-4">
            <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 transform hover:scale-105 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-500">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Мгновенная доставка</h3>
              <p className="text-gray-400 text-xs sm:text-sm text-center">Получай товары сразу после покупки</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 transform hover:scale-105 group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-500">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">100% безопасность</h3>
              <p className="text-gray-400 text-xs sm:text-sm text-center">Гарантия возврата средств</p>
            </div>

            <div className="flex flex-col items-center p-4 sm:p-6 bg-gray-800/30 backdrop-blur-sm rounded-lg sm:rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-500 transform hover:scale-105 group sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-emerald-600 rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-all duration-500">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">24/7 поддержка</h3>
              <p className="text-gray-400 text-xs sm:text-sm text-center">Всегда готовы помочь</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
