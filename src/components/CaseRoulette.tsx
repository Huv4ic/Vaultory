import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Package, X, Gift, DollarSign } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

// CSS стили для анимаций уведомлений
const notificationStyles = `
  @keyframes slideInFromRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-in.slide-in-from-right-2 {
    animation: slideInFromRight 0.3s ease-out;
  }
`;

interface CaseItem {
  id: string;
  name: string;
  rarity: string;
  image_url?: string;
  drop_after_cases?: number;
  price?: number; // Добавляем поле для цены
}

interface CaseRouletteProps {
  caseItems: CaseItem[];
  casePrice: number;
  caseName: string; // Добавляем название кейса
  telegramId: number; // Добавляем telegram_id для продажи
  onClose: () => void;
  onCaseOpened: (item: CaseItem) => void;
}

const CaseRoulette: React.FC<CaseRouletteProps> = ({ 
  caseItems, 
  casePrice, 
  caseName, // Добавляем в деструктуризацию
  telegramId, // Добавляем в деструктуризацию
  onClose, 
  onCaseOpened 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winnerItem, setWinnerItem] = useState<CaseItem | null>(null);
  const [soldOrAdded, setSoldOrAdded] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const [spinCount, setSpinCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  
  // Состояние для красивых уведомлений
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
  }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Отладка изменений состояний
  useEffect(() => {
    console.log('State changed - isSpinning:', isSpinning, 'showResult:', showResult);
    
    // Дополнительная проверка: если showResult стал false, сбрасываем winnerItem
    if (!showResult && winnerItem) {
      console.log('showResult became false, resetting winnerItem');
      setWinnerItem(null);
    }
  }, [isSpinning, showResult, winnerItem]);

  // Отладка всех изменений состояний
  useEffect(() => {
    console.log('=== STATE CHANGE DEBUG ===');
    console.log('isSpinning:', isSpinning);
    console.log('showResult:', showResult);
    console.log('winnerItem:', winnerItem ? winnerItem.name : 'null');
    console.log('animationRef.current:', animationRef.current);
    console.log('========================');
  }, [isSpinning, showResult, winnerItem, animationRef.current]);

  // Отладка вызовов onClose
  useEffect(() => {
    console.log('=== COMPONENT MOUNTED ===');
    return () => {
      console.log('=== COMPONENT UNMOUNTING ===');
      console.log('Final state - isSpinning:', isSpinning, 'showResult:', showResult, 'winnerItem:', winnerItem);
    };
  }, []);

  // Отслеживаем все вызовы onClose
  const handleClose = () => {
    console.log('=== ONCLOSE CALLED ===');
    console.log('Stack trace:', new Error().stack);
    console.log('Current state - isSpinning:', isSpinning, 'showResult:', showResult, 'winnerItem:', winnerItem);
    console.log('Component props:', { caseItems: caseItems.length, casePrice, onClose: typeof onClose, onCaseOpened: typeof onCaseOpened });
    
    // Сбрасываем состояние при закрытии
    setSoldOrAdded(false);
    
    onClose();
  };

  // Функция для показа красивых уведомлений
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Функция для продажи предмета сразу после открытия кейса
  const handleImmediateSell = async (item: CaseItem) => {
    try {
      console.log('💰 Продаем предмет сразу после открытия кейса:', item);
      console.log('💵 Цена предмета:', item.price);
      
      // Добавляем деньги на баланс пользователя
      const { data: currentProfile, error: fetchBalanceError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', telegramId)
        .single();

      if (fetchBalanceError || !currentProfile) {
        console.error('❌ Error fetching current balance:', fetchBalanceError);
        alert('Ошибка при получении баланса!');
        return;
      }

      const newBalance = (currentProfile.balance || 0) + item.price;
      console.log('💰 Обновляем баланс:', { old: currentProfile.balance, new: newBalance });

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance 
        })
        .eq('telegram_id', telegramId);

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError);
        alert('Ошибка при обновлении баланса!');
        return;
      }

      console.log('✅ Баланс успешно обновлен');
      showNotification(`Предмет продан за ${item.price}₴! Деньги добавлены на баланс.`, 'success');
      
    } catch (error) {
      console.error('❌ Failed to sell item immediately:', error);
      showNotification('Ошибка при продаже предмета!', 'error');
    }
  };

  // Cleanup анимации при размонтировании и изменении состояний
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        console.log('Cleanup: cancelling animation on unmount');
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);
  
  // Дополнительная очистка при изменении состояний
  useEffect(() => {
    if (!isSpinning && animationRef.current) {
      console.log('Cleanup: cancelling animation when spinning stops');
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [isSpinning]);

  // Функция для определения победного предмета на основе drop_after_cases
  const calculateWinner = (): CaseItem => {
    // Получаем текущий счетчик открытых кейсов (БЕЗ +1)
    const currentCaseCount = parseInt(localStorage.getItem('totalCasesOpened') || '0');
    
    console.log('=== CALCULATE WINNER START ===');
    console.log('Current case count from localStorage:', currentCaseCount);
    console.log('All case items:', caseItems.map(item => ({ name: item.name, drop_after_cases: item.drop_after_cases })));
    
    // Группируем предметы по drop_after_cases
    const itemsByDropRate: { [key: number]: CaseItem[] } = {};
    
    caseItems.forEach(item => {
      const dropRate = item.drop_after_cases || 1;
      if (!itemsByDropRate[dropRate]) {
        itemsByDropRate[dropRate] = [];
      }
      itemsByDropRate[dropRate].push(item);
    });
    
    console.log('Items grouped by drop rate:', itemsByDropRate);
    
    // Находим подходящие предметы для текущего кейса
    let eligibleItems: CaseItem[] = [];
    
    // Проверяем каждый drop_after_cases
    Object.keys(itemsByDropRate).forEach(dropRateStr => {
      const dropRate = parseInt(dropRateStr);
      const nextCaseNumber = currentCaseCount + 1;
      const isEligible = nextCaseNumber % dropRate === 0;
      
      console.log(`Checking drop rate ${dropRate}: next case ${nextCaseNumber} % ${dropRate} = ${nextCaseNumber % dropRate}, eligible: ${isEligible}`);
      
      if (isEligible) {
        // Если текущий кейс кратен drop_after_cases, добавляем все предметы с этим значением
        eligibleItems = eligibleItems.concat(itemsByDropRate[dropRate]);
        console.log(`Added items with drop rate ${dropRate}:`, itemsByDropRate[dropRate].map(item => item.name));
      }
    });
    
    console.log('Final eligible items:', eligibleItems.map(item => ({ name: item.name, drop_after_cases: item.drop_after_cases })));
    
    // Если нет подходящих предметов, берем случайный из всех
    if (eligibleItems.length === 0) {
      console.log('No eligible items found, using all case items');
      eligibleItems = caseItems;
    }
    
    // Выбираем случайный предмет из подходящих
    const randomIndex = Math.floor(Math.random() * eligibleItems.length);
    const winner = eligibleItems[randomIndex];
    
    console.log('Selected winner:', { name: winner.name, rarity: winner.rarity, drop_after_cases: winner.drop_after_cases });
    
    // Показываем текущий счетчик (БЕЗ обновления)
    setSpinCount(currentCaseCount + 1);
    
    // Отладочная информация
    console.log('Winner calculation result:', {
      currentCaseCount,
      nextCaseCount: currentCaseCount + 1,
      itemsByDropRate,
      eligibleItems: eligibleItems.map(item => ({ name: item.name, drop_after_cases: item.drop_after_cases })),
      winner: winner.name,
      winnerDropRate: winner.drop_after_cases
    });
    
    console.log('=== CALCULATE WINNER END ===');
    
    return winner;
  };

  const startSpin = () => {
    console.log('=== START SPIN START ===');
    console.log('isSpinning state:', isSpinning);
    console.log('showResult state:', showResult);
    console.log('animationRef.current:', animationRef.current);
    
    // ПОЛНАЯ ОЧИСТКА АНИМАЦИИ ПЕРЕД НОВЫМ ЗАПУСКОМ
    if (animationRef.current) {
      console.log('Cancelling previous animation before new spin');
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    // СБРАСЫВАЕМ СОСТОЯНИЯ ПРИ КАЖДОМ НОВОМ ЗАПУСКЕ
    if (showResult) {
      console.log('Resetting states for new spin...');
      setShowResult(false);
      setWinnerItem(null);
      setSoldOrAdded(false); // Сбрасываем состояние при новом открытии
    }
    
    if (isSpinning) {
      console.log('Already spinning, returning early');
      return;
    }
    
    // Проверяем, что есть предметы для открытия
    if (caseItems.length === 0) {
      alert('В этом кейсе нет предметов для открытия');
      return;
    }

    // Определяем победный предмет
    const winner = calculateWinner();
    setWinnerItem(winner);
    
    // ДОПОЛНИТЕЛЬНАЯ ОТЛАДКА: проверяем, что winner не null
    if (!winner) {
      console.error('Winner is null! This should not happen.');
      alert('Ошибка: не удалось определить победителя');
      return;
    }
    
    console.log('Starting spin with winner:', winner.name, 'rarity:', winner.rarity);
    
    // Анимация вращения как в HTML демо
    if (stripRef.current) {
      const strip = stripRef.current;
      const viewport = strip.parentElement;
      
      console.log('Strip element found, starting animation...');
      
      // Базовые параметры
      const REPEAT = 50; // длинная лента для бесконечных спинов
      let itemWidth = 0; // вычислим после вставки
      
      // Вычисляем ширину карточки
      const first = strip.querySelector('.item');
      if (first) {
        const gap = 10; // gap между предметами
        itemWidth = first.getBoundingClientRect().width + gap;
        console.log('Item width calculated:', itemWidth);
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
        console.log('spinToLocalIndex called with index:', localIndex);
        
        if (isSpinning) {
          console.log('Already spinning, cancelling previous animation');
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
        }
        
        // стартовая скорость и разгон
        v = -40; // влево
        console.log('Starting animation with velocity:', v);
        
        // выберем сегмент, где остановимся (далее по ленте + несколько кругов)
        const currentGlobal = nowIndex();
        const loops = 3; // сколько кругов до остановки
        const stopGlobal = Math.floor(currentGlobal/caseItems.length)*caseItems.length + loops*caseItems.length + localIndex;
        const targetX = indexToX(stopGlobal);

        console.log('Animation target:', { currentGlobal, loops, stopGlobal, targetX });

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
          console.log('Tween called, t:', t, 'target:', targetX, 'startT:', startT, 'D:', D);
          
          if (t >= 1){
            console.log('Tween animation completed, setting result');
            setX(targetX);
            
            // ОБЯЗАТЕЛЬНО обновляем состояния в правильном порядке
            console.log('Setting isSpinning to false...');
            setIsSpinning(false);
            console.log('Setting showResult to true...');
            setShowResult(true);
            
            // Находим правильный предмет для показа
            const realLocal = stopGlobal % caseItems.length; 
            const it = caseItems[realLocal];
            console.log('Setting winnerItem to:', it.name);
            setWinnerItem(it);
            
            // Останавливаем анимацию
            if (animationRef.current) {
              console.log('Cancelling animation in tween completion');
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
            
            // Анимация яркости viewport
            if (viewport) {
              viewport.animate([
                {filter:'brightness(1.0)'},
                {filter:'brightness(1.6)'},
                {filter:'brightness(1.0)'}
              ], {duration:500});
            }
            
            console.log('States updated: isSpinning=false, showResult=true, winnerItem set');
            return;
          }
          setX(startX + dist * easeOutCubic(t));
          requestAnimationFrame(tween);
        };
        
        // Запускаем основную анимацию на короткое время, потом переключаемся на tween
        let frameCount = 0;
        const maxFrames = 60; // примерно 1 секунда при 60fps
        
        const mainAnimation = () => {
          frameCount++;
          console.log('Main animation frame:', frameCount, 'of', maxFrames);
          
          if (frameCount >= maxFrames) {
            // Переключаемся на плавную остановку
            console.log('Switching to tween animation');
            console.log('Final position before tween - x:', x, 'v:', v);
            requestAnimationFrame(tween);
            return;
          }
          
          animationRef.current = requestAnimationFrame(mainAnimation);
          setX(x + v);
          v *= 0.985;
          
          // безопасность — бесконечная лента (за цикл)
          const totalW = caseItems.length * REPEAT * itemWidth;
          if (x < -totalW + centerOffset()) setX(x + totalW);
          if (x > centerOffset()) setX(x - totalW);
        };
        
        console.log('Starting main animation...');
        mainAnimation();
      };
      
      // Находим индекс победного предмета
      const winnerIndex = caseItems.findIndex(item => item.id === winner.id);
      
      // ДОПОЛНИТЕЛЬНАЯ ОТЛАДКА: проверяем индекс
      if (winnerIndex === -1) {
        console.error('Winner index not found! Winner:', winner, 'Case items:', caseItems);
        alert('Ошибка: не удалось найти индекс победителя');
        return;
      }
      
      console.log('Spinning to index:', winnerIndex, 'for winner:', winner.name);
      spinToLocalIndex(winnerIndex);
      
      setIsSpinning(true);
      console.log('=== START SPIN END ===');
    } else {
      console.error('Strip element not found!');
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
          width: 120px !important;
        }
        @media (min-width: 640px) {
          .w-35 {
            width: 140px !important;
          }
        }
        .h-30 {
          height: 100px !important;
        }
        @media (min-width: 640px) {
          .h-30 {
            height: 120px !important;
          }
        }
        .gap-2\.5 {
          gap: 8px !important;
        }
        @media (min-width: 640px) {
          .gap-2\.5 {
            gap: 10px !important;
          }
        }
        .p-2\.5 {
          padding: 8px !important;
        }
        @media (min-width: 640px) {
          .p-2\.5 {
            padding: 10px !important;
          }
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
        ${notificationStyles}
      `}</style>
      
      <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-gray-900/95 rounded-2xl sm:rounded-3xl border-2 border-amber-500/50 shadow-2xl shadow-amber-500/30 max-w-4xl sm:max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 p-4 sm:p-6 border-b border-amber-500/30">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3 text-amber-400" />
                Открытие кейса
              </h2>
              <Button
                onClick={() => {
                  console.log('Close button clicked!');
                  console.log('Current state - isSpinning:', isSpinning, 'showResult:', showResult);
                  handleClose();
                }}
                variant="ghost"
                size="sm"
                disabled={isSpinning}
                className={`${
                  isSpinning 
                    ? 'text-gray-600 cursor-not-allowed' 
                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">Стоимость: {casePrice}₴</p>
          </div>

          {/* Рулетка */}
          <div className="p-4 sm:p-6 md:p-8">
            {!showResult ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Кнопка запуска */}
                <div className="text-center">
                  <Button
                    onClick={startSpin}
                    disabled={isSpinning}
                    className={`px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 text-lg sm:text-xl md:text-2xl font-bold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                      isSpinning
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 hover:scale-105 shadow-2xl shadow-amber-500/30'
                    }`}
                  >
                    {isSpinning ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 border-b-2 border-white mr-2 sm:mr-3"></div>
                        <span className="text-sm sm:text-base md:text-lg">Крутится...</span>
                      </div>
                    ) : (
                      <>
                        <Package className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mr-2 sm:mr-3" />
                        Запустить рулетку
                      </>
                    )}
                  </Button>
                </div>

                {/* Рулетка */}
                <div className="relative">
                  {/* Контейнер рулетки */}
                  <div className="relative h-32 sm:h-36 md:h-40 bg-gray-800/50 rounded-xl sm:rounded-2xl border border-amber-500/30 overflow-hidden">
                    {/* Центральная линия с анимацией */}
                    <div className={`absolute left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-amber-400 to-yellow-400 transform -translate-x-1/2 z-10 shadow-lg shadow-amber-400/50 ${
                      isSpinning ? 'animate-pulse' : ''
                    }`}>
                      {/* Дополнительная подсветка центра */}
                      <div className="absolute -top-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full opacity-50 animate-ping"></div>
                      <div className="absolute -bottom-1 -left-1 w-2 h-2 sm:w-3 sm:h-3 bg-amber-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    </div>
                    
                    {/* Лента с предметами */}
                    <div 
                      ref={stripRef}
                      className="flex gap-2.5 items-center p-3 sm:p-4 h-full"
                      style={{ transform: 'translateX(300px)' }}
                    >
                      {/* Дублируем предметы для бесконечной прокрутки */}
                      {Array.from({ length: 50 }, () => caseItems).flat().map((item, index) => (
                        <div
                          key={`${item.id}-${index}`}
                          className={`flex-shrink-0 w-35 h-30 rounded-lg sm:rounded-xl p-2.5 flex flex-col justify-end relative isolation isolate item ${
                            getRarityColor(item.rarity)
                          }`}
                        >
                          {/* Блеск */}
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/15 to-transparent mix-blend-mode-overlay filter-blur-sm"></div>
                          {/* Свечение */}
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl shadow-lg opacity-35" style={{ boxShadow: '0 0 40px currentColor' }}></div>
                          
                          {/* Название предмета */}
                          <div className="font-bold text-xs sm:text-sm leading-tight relative z-10">
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
                  <div className="text-center mt-3 sm:mt-4">
                    {isSpinning ? (
                      <div className="space-y-2">
                        <p className="text-amber-400 text-xs sm:text-sm font-medium">🎰 Рулетка крутится...</p>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs sm:text-sm">Нажмите кнопку, чтобы запустить рулетку</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Результат */
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🎉</div>
                
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
                  Поздравляем!
                </h3>
                
                {winnerItem && (
                  <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-amber-500/30">
                    <div className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl border-4 ${getRarityColor(winnerItem.rarity)} bg-gray-700/80 flex items-center justify-center`}>
                      {winnerItem.image_url ? (
                        <img
                          src={winnerItem.image_url}
                          alt={winnerItem.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-24 md:h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <Gift className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-amber-400" />
                      )}
                    </div>
                    
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {winnerItem.name}
                    </h4>
                    
                    {/* Отображение цены предмета */}
                    <div className="text-lg sm:text-xl font-bold text-green-400 mb-3">
                      Цена: {winnerItem.price || 0}₴
                    </div>
                    
                    <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${
                      winnerItem.rarity.toLowerCase() === 'common' ? 'bg-gray-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'rare' ? 'bg-blue-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'epic' ? 'bg-purple-500 text-white' :
                      winnerItem.rarity.toLowerCase() === 'legendary' ? 'bg-yellow-500 text-black' :
                      'bg-gray-500 text-white'
                    }`}>
                      {getRarityName(winnerItem.rarity)}
                    </div>
                    
                    <p className="text-gray-300 mt-3 sm:mt-4 text-sm sm:text-base">
                      Предмет добавлен в ваш инвентарь!
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-4">
                  <Button
                    onClick={() => {
                      if (winnerItem && !soldOrAdded) {
                        console.log('🎁 Нажата кнопка "Добавить в инвентарь"');
                        console.log('💵 Цена предмета из админки:', winnerItem.price);
                        
                        // Устанавливаем состояние что действие выполнено
                        setSoldOrAdded(true);
                        
                        // Добавляем предмет в инвентарь с правильной ценой из админки
                        const inventoryItem = {
                          id: Date.now().toString(),
                          name: winnerItem.name,
                          price: winnerItem.price || 0, // Используем цену из админки
                          rarity: winnerItem.rarity,
                          type: 'Кейс',
                          case_name: caseName, // Используем caseName из пропсов
                          image_url: winnerItem.image_url,
                          obtained_at: new Date().toISOString(),
                          status: 'new' as const
                        };
                        
                        console.log('✅ Предмет подготовлен для инвентаря:', inventoryItem);
                        
                        // Вызываем onCaseOpened для добавления в инвентарь
                        console.log('🔧 Вызываем onCaseOpened для добавления в инвентарь');
                        onCaseOpened(winnerItem);
                        
                        // Показываем красивое уведомление
                        showNotification('Предмет добавлен в инвентарь!', 'success');
                        
                        // Закрываем окно через небольшую задержку
                        setTimeout(() => {
                          handleClose();
                        }, 1500);
                      }
                    }}
                    disabled={soldOrAdded}
                    className={`px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                      soldOrAdded 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:scale-105'
                    }`}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Добавить в инвентарь
                  </Button>
                  
                  <Button
                    onClick={() => {
                      if (winnerItem && !soldOrAdded) {
                        console.log('💰 Нажата кнопка "Продать"');
                        console.log('💵 Цена предмета из админки:', winnerItem.price);
                        
                        // Устанавливаем состояние что действие выполнено
                        setSoldOrAdded(true);
                        
                        // Продаем предмет по полной цене из админки (без скидок)
                        const sellPrice = winnerItem.price || 0;
                        console.log('💵 Цена продажи (полная):', sellPrice);
                        
                        // ВАЖНО: НЕ вызываем onCaseOpened при продаже
                        // Предмет не должен попадать в инвентарь, если он сразу продается
                        console.log('❌ onCaseOpened НЕ вызывается при продаже');
                        
                        // Продаем предмет сразу и добавляем деньги на баланс
                        handleImmediateSell(winnerItem);
                        
                        // Закрываем окно после продажи
                        handleClose();
                      }
                    }}
                    disabled={soldOrAdded}
                    className={`px-6 sm:px-8 py-3 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base ${
                      soldOrAdded 
                        ? 'bg-gray-500 text-gray-500 cursor-not-allowed opacity-50' 
                        : 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white hover:scale-105'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Продать
                  </Button>
                </div>
                
                {/* Убираем кнопку "Закрыть" - окно закрывается автоматически после действия */}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Красивое уведомление */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[9999] animate-in slide-in-from-right-2 duration-300">
          <div className={`px-6 py-4 rounded-lg shadow-2xl border-l-4 ${
            notification.type === 'success' 
              ? 'bg-green-600 border-green-400 text-white' 
              : notification.type === 'error'
              ? 'bg-red-600 border-red-400 text-white'
              : notification.type === 'warning'
              ? 'bg-yellow-600 border-yellow-400 text-white'
              : 'bg-blue-600 border-blue-400 text-white'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {notification.type === 'success' && (
                  <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {notification.type === 'error' && (
                  <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {notification.type === 'warning' && (
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {notification.type === 'info' && (
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-800" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm opacity-90">vaultory.pro</p>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="flex-shrink-0 ml-2 text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* CSS стили для анимаций */}
      <style>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-in.slide-in-from-right-2 {
          animation: slideInFromRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CaseRoulette;
