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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-[#f0f0f0]">
            404
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Страница не найдена. Возможно, она была удалена или перемещена.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Что делать дальше */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f0f0f0] text-center mb-6 sm:mb-8">
            Что делать дальше?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="glass rounded-xl sm:rounded-2xl border border-[#FFD700]/20 p-4 sm:p-6 text-center hover:border-[#FFD700]/50 hover-lift hover-glow transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-[#FFD700]">
                <Home className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#f0f0f0] mb-2">Вернуться на главную</h3>
              <p className="text-xs sm:text-sm text-[#a0a0a0]">
                Перейдите на главную страницу сайта
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl border border-[#FFD700]/20 p-4 sm:p-6 text-center hover:border-[#FFD700]/50 hover-lift hover-glow transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-[#FFD700]">
                <Search className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#f0f0f0] mb-2">Поиск</h3>
              <p className="text-xs sm:text-sm text-[#a0a0a0]">
                Используйте поиск для нахождения нужной страницы
              </p>
            </div>
            
            <div className="glass rounded-xl sm:rounded-2xl border border-[#FFD700]/20 p-4 sm:p-6 text-center hover:border-[#FFD700]/50 hover-lift hover-glow transition-all duration-300">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 glass rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-[#FFD700]">
                <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD700]" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-[#f0f0f0] mb-2">Поддержка</h3>
              <p className="text-xs sm:text-sm text-[#a0a0a0]">
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
              className="px-6 sm:px-8 py-2 sm:py-3 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              На главную
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 glass border border-[#FFD700]/20 text-[#a0a0a0] hover:bg-[#FFD700] hover:border-[#FFD700]/50 hover-lift hover-glow hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              В каталог
            </Button>
            
            <Button
              onClick={() => navigate('/support')}
              variant="outline"
              className="px-6 sm:px-8 py-2 sm:py-3 glass border border-[#FFD700]/20 text-[#a0a0a0] hover:bg-[#FFD700] hover:border-[#FFD700]/50 hover-lift hover-glow hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
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
