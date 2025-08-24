import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft, AlertTriangle, Compass, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Проблема с сайтом Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня возникла проблема с сайтом:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            404
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Страница не найдена. Возможно, она была удалена или перемещена.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Что делать дальше */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Что делать дальше?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Вернуться на главную</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Перейдите на главную страницу сайта
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Поиск</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Используйте поиск для нахождения нужной страницы
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Поддержка</h3>
              <p className="text-xs sm:text-sm text-gray-300">
                Обратитесь к нашей службе поддержки за помощью
              </p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8">
            <Button
              onClick={() => navigate('/')}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              На главную
            </Button>
            
            <Button
              onClick={() => navigate('/catalog')}
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              В каталог
            </Button>
            
            <Button
              onClick={() => navigate('/support')}
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Поддержка
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
