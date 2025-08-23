import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Package, X, Gift } from 'lucide-react';

interface CaseItem {
  id: string;
  name: string;
  rarity: string;
  image_url?: string;
  drop_after_cases?: number;
}

interface CaseRouletteProps {
  caseItems: CaseItem[];
  casePrice: number;
  onClose: () => void;
  onCaseOpened: (item: CaseItem) => void;
}

const CaseRoulette: React.FC<CaseRouletteProps> = ({ 
  caseItems, 
  casePrice, 
  onClose, 
  onCaseOpened 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerItem, setWinnerItem] = useState<CaseItem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const [spinCount, setSpinCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Cleanup анимации при размонтировании
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Функция для определения победного предмета на основе drop_after_cases
  const calculateWinner = (): CaseItem => {
    // Получаем текущий счетчик открытых кейсов
    const currentCaseCount = parseInt(localStorage.getItem('totalCasesOpened') || '0') + 1;
    
    // Группируем предметы по drop_after_cases
    const itemsByDropRate: { [key: number]: CaseItem[] } = {};
    
    caseItems.forEach(item => {
      const dropRate = item.drop_after_cases || 1;
      if (!itemsByDropRate[dropRate]) {
        itemsByDropRate[dropRate] = [];
      }
      itemsByDropRate[dropRate].push(item);
    });
    
    // Находим подходящие предметы для текущего кейса
    let eligibleItems: CaseItem[] = [];
    
    // Проверяем каждый drop_after_cases
    Object.keys(itemsByDropRate).forEach(dropRateStr => {
      const dropRate = parseInt(dropRateStr);
      if (currentCaseCount % dropRate === 0) {
        // Если текущий кейс кратен drop_after_cases, добавляем все предметы с этим значением
        eligibleItems = eligibleItems.concat(itemsByDropRate[dropRate]);
      }
    });
    
    // Если нет подходящих предметов, берем случайный из всех
    if (eligibleItems.length === 0) {
      eligibleItems = caseItems;
    }
    
    // Выбираем случайный предмет из подходящих
    const randomIndex = Math.floor(Math.random() * eligibleItems.length);
    const winner = eligibleItems[randomIndex];
    
    // Обновляем счетчик ТОЛЬКО после успешного открытия кейса
    // НЕ обновляем здесь, чтобы не сбивать логику
    setSpinCount(currentCaseCount);
    
    // Отладочная информация
    console.log('Winner calculation:', {
      currentCaseCount,
      itemsByDropRate,
      eligibleItems,
      winner: winner.name,
      winnerDropRate: winner.drop_after_cases
    });
    
    return winner;
  };

  const startSpin = () => {
    if (isSpinning) return;
    
    // Проверяем, что есть предметы для открытия
    if (caseItems.length === 0) {
      alert('В этом кейсе нет предметов для открытия');
      return;
    }

    // Определяем победный предмет
    const winner = calculateWinner();
    setWinnerItem(winner);
    
    // Анимация вращения как в HTML демо
    if (stripRef.current) {
      const strip = stripRef.current;
      const viewport = strip.parentElement;
      
             // Базовые параметры
       const REPEAT = 50; // длинная лента для бесконечных спинов
      let itemWidth = 0; // вычислим после вставки
      
      // Вычисляем ширину карточки
      const first = strip.querySelector('.item');
      if (first) {
        const gap = 10; // gap между предметами
        itemWidth = first.getBoundingClientRect().width + gap;
      }
      
      // Функции для работы с позицией
      let x = 0; // текущая позиция ленты (translateX)
      let v = 0; // скорость (px/frame)
      
      const setX = (val: number) => { 
        x = val; 
        strip.style.transform = `translate3d(${val}px,0,0)`; 
      };
      
      const centerOffset = () => {
        const vpW = viewport!.clientWidth;
        return vpW/2 - itemWidth/2; // чтобы середина карточки пришла под маркер
      };
      
      const indexToX = (index: number) => {
        // глобальный индекс по длинной ленте
        return -(index*itemWidth) + centerOffset();
      };
      
      const nowIndex = () => {
        // какой индекс примерно под маркером
        const idx = Math.round((centerOffset() - x) / itemWidth);
        return ((idx % (caseItems.length*REPEAT)) + (caseItems.length*REPEAT)) % (caseItems.length*REPEAT);
      };
      
      // Анимация
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate);
        setX(x + v);
        // немного трения
        v *= 0.985;
        // безопасность — бесконечная лента (за цикл)
        const totalW = caseItems.length * REPEAT * itemWidth;
        if (x < -totalW + centerOffset()) setX(x + totalW);
        if (x > centerOffset()) setX(x - totalW);
      };
      
      // Запускаем спин
      const spinToLocalIndex = (localIndex: number) => {
        if (isSpinning) {
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
        
        // стартовая скорость и разгон
        v = -40; // влево
        animate();
        
        // выберем сегмент, где остановимся (далее по ленте + несколько кругов)
        const currentGlobal = nowIndex();
        const loops = 3; // сколько кругов до остановки
        const stopGlobal = Math.floor(currentGlobal/caseItems.length)*caseItems.length + loops*caseItems.length + localIndex;
        const targetX = indexToX(stopGlobal);

        // Плавный довод с помощью встроенного аниматора
        const startX = x; 
        const dist = targetX - startX; 
        const D = 3200; // длительность в мс
        const startT = performance.now();
        
        const easeOutCubic = (t: number) => { 
          return 1 - Math.pow(1 - t, 3); 
        };

        const tween = () => {
          const t = (performance.now() - startT) / D;
          if (t >= 1){
            setX(targetX);
            setIsSpinning(false);
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
            const realLocal = stopGlobal % caseItems.length; 
            const it = caseItems[realLocal];
            setWinnerItem(it);
            setShowResult(true);
            
            // Анимация яркости viewport
            if (viewport) {
              viewport.animate([
                {filter:'brightness(1.0)'},
                {filter:'brightness(1.6)'},
                {filter:'brightness(1.0)'}
              ], {duration:500});
            }
            return;
          }
          setX(startX + dist * easeOutCubic(t));
          requestAnimationFrame(tween);
        };
        requestAnimationFrame(tween);
      };
      
      // Находим индекс победного предмета
      const winnerIndex = caseItems.findIndex(item => item.id === winner.id);
      spinToLocalIndex(winnerIndex);
      
      setIsSpinning(true);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'r-common';
      case 'rare': return 'r-rare';
      case 'epic': return 'r-epic';
      case 'legendary': return 'r-legend';
      default: return 'r-common';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'Обычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'legendary': return 'Легендарный';
      default: return 'Обычный';
    }
  };

  const getRarityTag = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'common';
      case 'rare': return 'rare';
      case 'epic': return 'epic';
      case 'legendary': return 'legend';
      default: return 'common';
    }
  };

  return (
    <>
      <style>{`
        .r-common {
          background: #1f1f1f !important;
          color: #d3d3d3 !important;
          border: 1px solid #333 !important;
        }
        .r-rare {
          background: #2a1d0f !important;
          color: #f0d59f !important;
          border: 1px solid #7d520e !important;
        }
        .r-epic {
          background: #33210f !important;
          color: #ffe5a3 !important;
          border: 1px solid #aa7c2f !important;
        }
        .r-legend {
          background: #3d2a0e !important;
          color: #fff4c3 !important;
          border: 1px solid #d4af37 !important;
        }
        .w-35 {
          width: 140px !important;
        }
        .h-30 {
          height: 120px !important;
        }
        .gap-2\.5 {
          gap: 10px !important;
        }
        .p-2\.5 {
          padding: 10px !important;
        }
        .mix-blend-mode-overlay {
          mix-blend-mode: overlay !important;
        }
        .filter-blur-sm {
          filter: blur(0.3px) !important;
        }
        .opacity-35 {
          opacity: 0.35 !important;
        }
      `}</style>
      
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900/95 rounded-3xl border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-6 border-b border-amber-500/30">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white flex items-center">
                <Package className="w-8 h-8 mr-3 text-amber-400" />
                Открытие кейса
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                disabled={isSpinning}
                className={`${
                  isSpinning 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <p className="text-gray-300 mt-2">Стоимость: {casePrice}₴</p>
          </div>

          {/* Рулетка */}
          <div className="p-8">
            {!showResult ? (
              <div className="space-y-8">
                {/* Кнопка запуска */}
                <div className="text-center">
                  <Button
                    onClick={startSpin}
                    disabled={isSpinning}
                    className={`px-12 py-6 text-2xl font-bold rounded-2xl transition-all duration-300 ${
                      isSpinning
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 hover:scale-105 shadow-2xl shadow-amber-500/30'
                    }`}
                  >
                    {isSpinning ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mr-3"></div>
                        Крутится...
                      </div>
                    ) : (
                      <>
                        <Package className="w-8 h-8 mr-3" />
                        Запустить рулетку
                      </>
                    )}
                  </Button>
                </div>

                {/* Рулетка */}
                <div className="relative">
                  {/* Контейнер рулетки */}
                  <div className="relative h-40 bg-gray-800/50 rounded-2xl border border-amber-500/30 overflow-hidden">
                    {/* Центральная линия с анимацией */}
                    <div className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-yellow-400 transform -translate-x-1/2 z-10 shadow-lg shadow-amber-400/50 ${
                      isSpinning ? 'animate-pulse' : ''
                    }`}>
                      {/* Дополнительная подсветка центра */}
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400 rounded-full opacity-50 animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    
                    {/* Лента с предметами */}
                    <div 
                      ref={stripRef}
                      className="flex gap-2.5 items-center p-4 h-full"
                      style={{ transform: 'translateX(300px)' }}
                    >
                                             {/* Дублируем предметы для бесконечной прокрутки */}
                       {Array.from({ length: 50 }, () => caseItems).flat().map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className={`flex-shrink-0 w-35 h-30 rounded-xl p-2.5 flex flex-col justify-end relative isolation isolate item ${
                            getRarityColor(item.rarity)
                          }`}
                        >
                          {/* Блеск */}
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/15 to-transparent mix-blend-mode-overlay filter-blur-sm"></div>
                          {/* Свечение */}
                          <div className="absolute inset-0 rounded-xl shadow-lg opacity-35" style={{ boxShadow: '0 0 40px currentColor' }}></div>
                          
                          {/* Название предмета */}
                          <div className="font-bold text-sm leading-tight relative z-10">
                            {item.name}
                          </div>
                          
                          {/* Тег редкости */}
                          <div className="opacity-80 text-xs relative z-10">
                            {getRarityTag(item.rarity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Подсказка и счетчик */}
                  <div className="text-center mt-4">
                    {isSpinning ? (
                      <div className="space-y-2">
                        <p className="text-amber-400 text-sm font-medium">🎰 Рулетка крутится...</p>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">Нажмите кнопку, чтобы запустить рулетку</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Результат */
              <div className="text-center space-y-6">
                <div className="text-8xl mb-6 animate-bounce">🎉</div>
                
                <h3 className="text-3xl font-bold text-white mb-4">
                  Поздравляем!
                </h3>
                
                {winnerItem && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-2xl p-8 border border-amber-500/30">
                    <div className={`w-32 h-32 mx-auto mb-4 rounded-xl border-4 ${getRarityColor(winnerItem.rarity)} bg-gray-700/80 flex items-center justify-center`}>
                      {winnerItem.image_url ? (
                        <img
                          src={winnerItem.image_url}
                          alt={winnerItem.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <Gift className="w-16 h-16 text-amber-400" />
                      )}
                    </div>
                    
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {winnerItem.name}
                    </h4>
                    
                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                      winnerItem.rarity.toLowerCase() === 'common' ? 'bg-gray-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'rare' ? 'bg-blue-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'epic' ? 'bg-purple-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'legendary' ? 'bg-yellow-500 text-black' :
                      'bg-gray-500 text-white'
                    }`}>
                      {getRarityName(winnerItem.rarity)}
                    </div>
                    
                    <p className="text-gray-300 mt-4">
                      Предмет добавлен в ваш инвентарь!
                    </p>
                  </div>
                )}
                
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      // Обновляем счетчик только когда кейс действительно открыт
                      const currentCaseCount = parseInt(localStorage.getItem('totalCasesOpened') || '0') + 1;
                      localStorage.setItem('totalCasesOpened', currentCaseCount.toString());
                      
                      onCaseOpened(winnerItem!);
                      onClose();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseRoulette;
