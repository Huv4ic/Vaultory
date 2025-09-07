import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Sparkles, ArrowLeft, Gift, Star, Zap, Crown, Flame, Shield, Trophy, Target, Rocket } from 'lucide-react';
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-90"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent animate-pulse"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-6 animate-spin-slow shadow-2xl shadow-cyan-500/30">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow">
              ИГРОВЫЕ КЕЙСЫ
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя мир <span className="text-cyan-400 font-bold">удивительных наград</span>! 
            Каждый кейс содержит <span className="text-purple-400 font-bold">уникальные предметы</span> 
            из ваших любимых игр. <span className="text-pink-400 font-bold">Попробуйте удачу</span> и получите эксклюзивные вещи.
          </p>
          
          {/* Статистика кейсов с крутыми анимациями */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Всего кейсов</p>
                <p className="text-3xl font-black text-cyan-400">{cases.length}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Игр доступно</p>
                <p className="text-3xl font-black text-purple-400">{new Set(cases.map(c => c.game)).size}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-yellow-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/80 backdrop-blur-xl rounded-2xl border border-pink-500/30 p-6 hover:border-pink-400/50 transition-all duration-500 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-yellow-600 rounded-full mx-auto mb-4 group-hover:rotate-12 transition-transform duration-500">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-400 text-sm mb-2">Уникальных предметов</p>
                <p className="text-3xl font-black text-pink-400">{caseItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            ВЫБЕРИТЕ КЕЙС
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
        </div>

        {/* Сетка кейсов с потрясающими анимациями */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="group relative cursor-pointer" 
              style={{ animationDelay: `${idx * 0.1}s` }}
              onClick={() => navigate(`/case/${caseData.id}`)}
            >
              {/* Светящийся фон */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              
              {/* Основная карточка */}
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-6 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                
                {/* Изображение кейса */}
                <div className="relative mb-6">
                  {caseData.image_url ? (
                    <div className="relative w-full h-48 rounded-2xl overflow-hidden">
                      <img 
                        src={caseData.image_url} 
                        alt={caseData.name}
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback иконка */}
                      <div className="hidden absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/30">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                  
                  {/* Светящиеся углы */}
                  <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
                  <div className="absolute bottom-2 left-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-80"></div>
                </div>
                
                {/* Информация о кейсе */}
                <div className="space-y-4">
                  {/* Название */}
                  <h3 className="text-xl font-black text-white group-hover:text-cyan-400 transition-colors duration-300">
                    {caseData.name}
                  </h3>
                  
                  {/* Игра */}
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <Package className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{caseData.game}</span>
                  </div>
                  
                  {/* Цена */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-400 text-sm">Цена</span>
                    </div>
                    <span className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      {caseData.price}₴
                    </span>
                  </div>
                  
                  {/* Кнопка открыть */}
                  <div className="pt-4">
                    <div className="w-full h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:from-cyan-400 group-hover:to-purple-500 transition-all duration-300 shadow-lg shadow-cyan-500/25">
                      <span className="text-white font-bold text-sm">ОТКРЫТЬ КЕЙС</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Информационные блоки */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              ИНФОРМАЦИЯ
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Как работают кейсы?</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Каждый кейс содержит <span className="text-cyan-400 font-bold">случайные предметы</span> из игры</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Шансы выпадения для каждого предмета <span className="text-purple-400 font-bold">случайные</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Предметы выдаются <span className="text-pink-400 font-bold">мгновенно</span> после открытия</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Все предметы <span className="text-yellow-400 font-bold">официальные</span> и лицензированные</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-500">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4 group-hover:rotate-12 transition-transform duration-500">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Советы по открытию</h3>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Открывайте кейсы в <span className="text-green-400 font-bold">хорошем настроении</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Не увлекайтесь - играйте <span className="text-orange-400 font-bold">ответственно</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Устанавливайте <span className="text-red-400 font-bold">лимиты</span> на траты</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Помните, что это <span className="text-blue-400 font-bold">развлечение</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Вернуться на главную</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cases;
