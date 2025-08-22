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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-amber-400/30 mx-auto"></div>
            <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-amber-400 mx-auto"></div>
          </div>
          <p className="mt-6 text-xl text-gray-300">{t('Загрузка кейсов...')}</p>
          <div className="flex justify-center space-x-1 mt-4">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
            <span className="text-red-400 text-3xl">⚠️</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-red-400">{t('Ошибка загрузки')}</h1>
          <p className="text-xl mb-6 text-gray-300">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-500/30"
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
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🎁 {t('Игровые Кейсы')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя мир удивительных наград! Каждый кейс содержит уникальные предметы 
            из ваших любимых игр. Попробуйте удачу и получите эксклюзивные вещи.
          </p>
          
          {/* Статистика кейсов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-gray-300 text-sm">Всего кейсов</p>
              <p className="text-amber-400 font-bold text-lg">{cases.length}</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">🎮</div>
              <p className="text-gray-300 text-sm">Игр доступно</p>
              <p className="text-amber-400 font-bold text-lg">{new Set(cases.map(c => c.game)).size}</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-gray-300 text-sm">Уникальных предметов</p>
              <p className="text-amber-400 font-bold text-lg">{caseItems.length}</p>
            </div>
          </div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Сетка кейсов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="group relative cursor-pointer animate-fade-in hover:scale-105 transition-all duration-500" 
              style={{ animationDelay: `${idx * 0.07}s` }}
              onClick={() => navigate(`/case/${caseData.id}`)}
            >
              {/* Карточка кейса в стиле GGDROP */}
              <div className="relative w-full h-80">
                {/* Убираем все фоны - оставляем только прозрачность */}
                
                {/* Изображение кейса с 3D эффектом */}
                {caseData.image_url ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={caseData.image_url} 
                      alt={caseData.name}
                      className="w-full h-full object-contain rounded-2xl transition-all duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    {/* Fallback иконка (скрыта по умолчанию) */}
                    <div className="hidden absolute inset-0 w-full h-full flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30">
                        <Gift className="w-12 h-12 text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Если нет изображения, показываем стилизованную иконку */
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/30">
                      <Gift className="w-12 h-12 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Информация о кейсе поверх изображения */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-b-2xl p-3">
                  {/* Название кейса */}
                  <div className="text-base font-bold text-white mb-1 drop-shadow-lg">
                    {caseData.name}
                  </div>
                  
                  {/* Игра */}
                  <div className="text-xs text-amber-300 mb-1 flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {caseData.game}
                  </div>
                  
                  {/* Цена */}
                  <div className="text-lg font-bold text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    {caseData.price}₴
                  </div>
                </div>
                
                {/* Декоративные элементы подсветки */}
                <div className="absolute top-2 right-2 w-2 h-2 bg-amber-400/60 rounded-full animate-ping"></div>
                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-amber-300/60 rounded-full animate-ping animation-delay-1000"></div>
                
                {/* Hover эффект - только легкая подсветка краев */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-amber-500/30 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Информация о кейсах */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-amber-400" />
                Как работают кейсы?
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>• Каждый кейс содержит случайные предметы из игры</p>
                <p>• Шансы выпадения указаны для каждого предмета</p>
                <p>• Предметы выдаются мгновенно после открытия</p>
                <p>• Все предметы официальные и лицензированные</p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-8">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-3 text-amber-400" />
                Советы по открытию
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>• Открывайте кейсы в хорошем настроении</p>
                <p>• Не увлекайтесь - играйте ответственно</p>
                <p>• Устанавливайте лимиты на траты</p>
                <p>• Помните, что это развлечение</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
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
