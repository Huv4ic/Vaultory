import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Sparkles, ArrowLeft, Gift, Star, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useCases } from '@/hooks/useCases';
import { useAuth } from '@/hooks/useAuth';

const Cases = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { cases, caseItems, loading, error } = useCases();
  const { telegramUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-amber-400/30 mx-auto"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-300">{t('Загрузка кейсов...')}</p>
          <div className="flex justify-center space-x-1 mt-3 sm:mt-4">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce animation-delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-red-500/30">
            <span className="text-red-400 text-2xl sm:text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-red-400">{t('Ошибка загрузки')}</h1>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-gray-300 px-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-500/30"
          >
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🎁 {t('Игровые Кейсы')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Откройте для себя мир удивительных наград! Каждый кейс содержит уникальные предметы 
            из ваших любимых игр. Попробуйте удачу и получите эксклюзивные вещи.
          </p>
          
          {/* Статистика кейсов */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            <div className="text-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-xl sm:text-2xl mb-2">📦</div>
              <p className="text-gray-300 text-xs sm:text-sm">Всего кейсов</p>
              <p className="text-amber-400 font-bold text-base sm:text-lg">{cases.length}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-xl sm:text-2xl mb-2">🎮</div>
              <p className="text-gray-300 text-xs sm:text-sm">Игр доступно</p>
              <p className="text-amber-400 font-bold text-base sm:text-lg">{new Set(cases.map(c => c.game)).size}</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-xl sm:text-2xl mb-2">⭐</div>
              <p className="text-gray-300 text-xs sm:text-sm">Уникальных предметов</p>
              <p className="text-amber-400 font-bold text-base sm:text-lg">{caseItems.length}</p>
            </div>
          </div>
        </div>
        
        {/* Анимированные элементы фона - скрываем на мобильных */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="hidden md:block absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Сетка кейсов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="group relative cursor-pointer animate-fade-in hover:scale-105 transition-all duration-500" 
              style={{ animationDelay: `${idx * 0.07}s` }}
              onClick={() => navigate(`/case/${caseData.id}`)}
            >
              {/* Карточка кейса в стиле GGDROP */}
              <div className="relative w-full h-64 sm:h-80 md:h-96">
                {/* Убираем все фоны - оставляем только прозрачность */}
                
                {/* Изображение кейса с 3D эффектом */}
                {caseData.image_url ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={caseData.image_url} 
                      alt={caseData.name}
                      className="w-full h-full object-contain rounded-xl sm:rounded-2xl transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback иконка (скрыта по умолчанию) */}
                    <div className="hidden absolute inset-0 w-full h-full flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:w-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30">
                        <Gift className="w-8 h-8 sm:w-10 sm:w-12 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Если нет изображения, показываем стилизованную иконку */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:w-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30">
                      <Gift className="w-8 h-8 sm:w-10 sm:w-12 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Информация о кейсе поверх изображения */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-xl sm:rounded-b-2xl p-2 sm:p-3">
                  {/* Название кейса */}
                  <div className="text-sm sm:text-base font-bold text-white mb-1 drop-shadow-lg line-clamp-2">
                    {caseData.name}
                  </div>
                  
                  {/* Игра */}
                  <div className="text-xs text-amber-300 mb-1 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    <span className="truncate">{caseData.game}</span>
                  </div>
                  
                  {/* Цена */}
                  <div className="text-base sm:text-lg font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    {caseData.price}₴
                  </div>
                </div>
                
                {/* Декоративные элементы подсветки - скрываем на мобильных */}
                <div className="hidden sm:block absolute top-2 right-2 w-2 h-2 bg-amber-400/60 rounded-full animate-ping"></div>
                <div className="hidden sm:block absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-300/60 rounded-full animate-ping animation-delay-1000"></div>
                
                {/* Hover эффект - только легкая подсветка краев */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl border border-transparent group-hover:border-amber-500/30 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Информация о кейсах */}
        <div className="mt-12 sm:mt-16 md:mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-400" />
                Как работают кейсы?
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                <p>• Каждый кейс содержит случайные предметы из игры</p>
                <p>• Шансы выпадения указаны для каждого предмета</p>
                <p>• Предметы выдаются мгновенно после открытия</p>
                <p>• Все предметы официальные и лицензированные</p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-400" />
                Советы по открытию
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                <p>• Открывайте кейсы в хорошем настроении</p>
                <p>• Не увлекайтесь - играйте ответственно</p>
                <p>• Устанавливайте лимиты на траты</p>
                <p>• Помните, что это развлечение</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12 sm:mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cases;
