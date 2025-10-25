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
      <div className="min-h-screen bg-[#0e0e0e] text-[#f0f0f0] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 border-4 border-[#a31212] mx-auto"></div>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-[#a0a0a0]">{t('Загрузка кейсов...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-[#f0f0f0] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-[#181818] rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-[#1c1c1c]">
            <span className="text-[#a31212] text-2xl sm:text-3xl">⚠️</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-[#a31212]">{t('Ошибка загрузки')}</h1>
          <p className="text-lg sm:text-xl mb-4 sm:mb-6 text-[#a0a0a0] px-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl transition-all duration-300 hover:scale-105"
          >
            {t('Попробовать снова')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] relative">

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-[#181818] rounded-full mb-6 border border-[#1c1c1c]">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-[#a31212]" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[#f0f0f0]">
              ИГРОВЫЕ КЕЙСЫ
            </h1>
            <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Откройте для себя мир <span className="text-[#a31212] font-bold">удивительных наград</span>! 
            Каждый кейс содержит <span className="text-[#f0f0f0] font-bold">уникальные предметы</span> 
            из ваших любимых игр. <span className="text-[#a31212] font-bold">Попробуйте удачу</span> и получите эксклюзивные вещи.
          </p>
          
          {/* Статистика кейсов */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Всего кейсов</p>
                <p className="text-3xl font-black text-[#a31212]">{cases.length}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Игр доступно</p>
                <p className="text-3xl font-black text-[#a31212]">{new Set(cases.map(c => c.game)).size}</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-6 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center w-16 h-16 bg-[#a31212] rounded-full mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <p className="text-[#a0a0a0] text-sm mb-2">Уникальных предметов</p>
                <p className="text-3xl font-black text-[#a31212]">{caseItems.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#f0f0f0]">
            ВЫБЕРИТЕ КЕЙС
          </h2>
          <div className="w-24 h-1 bg-[#a31212] mx-auto rounded-full"></div>
        </div>

        {/* Сетка кейсов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="group relative cursor-pointer" 
              onClick={() => navigate(`/case/${caseData.id}`)}
            >
              {/* Основная карточка */}
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-4 hover:border-[#a31212] transition-all duration-300 hover:scale-105">
                
                {/* Изображение кейса */}
                <div className="relative mb-4">
                  {caseData.image_url ? (
                    <div className="relative w-full h-64 rounded-2xl overflow-hidden">
                      <img 
                        src={caseData.image_url} 
                        alt={caseData.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      {/* Fallback иконка */}
                      <div className="hidden absolute inset-0 w-full h-full flex items-center justify-center bg-[#1c1c1c]">
                        <div className="w-16 h-16 bg-[#a31212] rounded-full flex items-center justify-center">
                          <Gift className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 rounded-2xl bg-[#1c1c1c] flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#a31212] rounded-full flex items-center justify-center">
                        <Gift className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Информация о кейсе */}
                <div className="space-y-2">
                  {/* Название */}
                  <h3 className="text-lg font-black text-[#f0f0f0] text-center">
                    {caseData.name}
                  </h3>
                  
                  {/* Игра и цена в одной строке */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#a0a0a0]">
                      <div className="w-5 h-5 bg-[#a31212] rounded-full flex items-center justify-center">
                        <Package className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-xs font-medium">{caseData.game}</span>
                    </div>
                    <span className="text-xl font-black text-[#f0f0f0]">
                      {caseData.price}₴
                    </span>
                  </div>
                  
                  {/* Кнопка открыть */}
                  <div className="pt-1">
                    <div className="w-full h-10 bg-[#a31212] hover:bg-[#8a0f0f] rounded-xl flex items-center justify-center transition-all duration-300">
                      <span className="text-white font-bold text-xs">ОТКРЫТЬ КЕЙС</span>
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
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-[#f0f0f0]">
              ИНФОРМАЦИЯ
            </h2>
            <div className="w-24 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#a31212] rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#f0f0f0]">Как работают кейсы?</h3>
                </div>
                <div className="space-y-4 text-[#a0a0a0]">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Каждый кейс содержит <span className="text-[#f0f0f0] font-bold">случайные предметы</span> из игры</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Шансы выпадения для каждого предмета <span className="text-[#f0f0f0] font-bold">случайные</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Предметы выдаются <span className="text-[#f0f0f0] font-bold">мгновенно</span> после открытия</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Все предметы <span className="text-[#f0f0f0] font-bold">официальные</span> и лицензированные</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="relative bg-[#181818] rounded-2xl border border-[#1c1c1c] p-8 hover:border-[#a31212] transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#a31212] rounded-full flex items-center justify-center mr-4">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-[#f0f0f0]">Советы по открытию</h3>
                </div>
                <div className="space-y-4 text-[#a0a0a0]">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Открывайте кейсы в <span className="text-[#f0f0f0] font-bold">хорошем настроении</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Не увлекайтесь - играйте <span className="text-[#f0f0f0] font-bold">ответственно</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Устанавливайте <span className="text-[#f0f0f0] font-bold">лимиты</span> на траты</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#a31212] rounded-full mt-2 flex-shrink-0"></div>
                    <p>Помните, что это <span className="text-[#f0f0f0] font-bold">развлечение</span></p>
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
            className="px-8 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center gap-3">
              <ArrowLeft className="w-5 h-5" />
              <span>Вернуться на главную</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cases;
