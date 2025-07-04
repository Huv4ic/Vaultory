
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900/20">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-red-500/10 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
              🔥 Лучший игровой маркетплейс 2025
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-purple-100 bg-clip-text text-transparent leading-tight">
            Покупай игровые товары
            <br />
            <span className="bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              мгновенно
            </span>
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Тысячи товаров для твоих любимых игр. Безопасные покупки, мгновенная доставка и лучшие цены на рынке.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/catalog">
              <Button size="lg" className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none text-lg px-8 py-6 rounded-xl">
                Начать покупки
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500 text-lg px-8 py-6 rounded-xl"
              >
                Узнать больше
              </Button>
            </Link>
          </div>

          {/* Преимущества */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Мгновенная доставка</h3>
              <p className="text-gray-400 text-sm text-center">Получай товары сразу после покупки</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">100% безопасность</h3>
              <p className="text-gray-400 text-sm text-center">Гарантия возврата средств</p>
            </div>

            <div className="flex flex-col items-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">24/7 поддержка</h3>
              <p className="text-gray-400 text-sm text-center">Всегда готовы помочь</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
