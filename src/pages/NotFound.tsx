import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, AlertTriangle, Compass, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-amber-400 mb-4 animate-pulse">404</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              {t('Страница не найдена')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              {t('К сожалению, запрашиваемая страница не существует или была перемещена.')}
              <br />
              Не волнуйтесь, мы поможем вам найти то, что вы ищете.
            </p>
          </div>
          
          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold px-8 py-4 rounded-xl shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105">
                <Home className="w-5 h-5 mr-2" />
                {t('На главную')}
              </Button>
            </Link>
            
            <Link to="/catalog">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105">
                <Search className="w-5 h-5 mr-2" />
                {t('В каталог')}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <Home className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Главная страница</h3>
            <p className="text-gray-300 text-sm">
              Вернитесь на главную страницу и найдите нужную информацию
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <Search className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Каталог товаров</h3>
            <p className="text-gray-300 text-sm">
              Изучите наш каталог и найдите интересующие вас товары
            </p>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
              <HelpCircle className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Поддержка</h3>
            <p className="text-gray-300 text-sm">
              Обратитесь к нашей службе поддержки за помощью
            </p>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8">
            <div className="mx-auto w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
              <AlertTriangle className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Что могло пойти не так?
            </h3>
            <div className="space-y-3 text-gray-300 text-left max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Страница была перемещена или удалена</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Ошибка в URL адресе</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">Страница находится в разработке</span>
              </div>
            </div>
          </div>
        </div>

        {/* Полезные ссылки */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Полезные ссылки</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/about">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                О нас
              </Button>
            </Link>
            
            <Link to="/cases">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                Кейсы
              </Button>
            </Link>
            
            <Link to="/support">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                Поддержка
              </Button>
            </Link>
            
            <Link to="/terms">
              <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                Условия использования
              </Button>
            </Link>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="mt-16 text-center">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Compass className="w-6 h-6 mr-3 text-amber-400" />
              <h3 className="text-xl font-bold text-white">Нужна помощь?</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Если вы считаете, что это ошибка, или у вас есть вопросы, 
              не стесняйтесь обращаться к нам.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/support">
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                  Связаться с поддержкой
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Вернуться на главную
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
