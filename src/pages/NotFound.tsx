import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

const NotFound = () => {
  const { t } = useLanguage();
  const { telegramUser, refreshTelegramProfile } = useAuth();
  
  // Автоматически обновляем профиль при загрузке страницы
  useEffect(() => {
    if (telegramUser) {
      refreshTelegramProfile();
    }
  }, [telegramUser, refreshTelegramProfile]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-500 mb-4 animate-pulse">404</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            {t('Страница не найдена')}
          </h1>
          <p className="text-xl text-gray-400 mb-8 leading-relaxed">
            {t('К сожалению, запрашиваемая страница не существует или была перемещена.')}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-200">
              <Home className="w-5 h-5 mr-2" />
              {t('На главную')}
            </Button>
          </Link>
          
          <Link to="/catalog">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400 px-8 py-3 rounded-lg">
              <Search className="w-5 h-5 mr-2" />
              {t('В каталог')}
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            {t('Если вы считаете, что это ошибка, обратитесь в')} {' '}
            <a href="/support" className="text-red-400 hover:text-red-300 underline">
              {t('поддержку')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
