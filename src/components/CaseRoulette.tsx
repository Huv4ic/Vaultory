import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Package, X, Gift, DollarSign } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { useNotification } from '../hooks/useNotification';
import { useGlobalCaseCounter } from '../hooks/useGlobalCaseCounter';
import { useAuth } from '../hooks/useAuth';
import Notification from './ui/Notification';

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
  onCaseOpened: (item: CaseItem, action: 'add' | 'sell') => void; // Добавляем тип действия
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
  
  // Используем новый хук для уведомлений
  const { showSuccess, showError, showWarning, showInfo, notification, hideNotification } = useNotification();
  const { totalCasesOpened, incrementGlobalCounter } = useGlobalCaseCounter();
  const { profile, refreshProfile } = useAuth();

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
    console.log('soldOrAdded:', soldOrAdded);
    
    // Если есть выигрышный предмет и пользователь ничего не выбрал - добавляем в инвентарь
    if (winnerItem && !soldOrAdded) {
      console.log('🎁 Пользователь закрыл окно без выбора - автоматически добавляем предмет в инвентарь:', winnerItem.name);
      onCaseOpened(winnerItem, 'add');
    }
    
    // Сбрасываем состояние при закрытии
    setSoldOrAdded(false);
    setShowResult(false);
    setWinnerItem(null);
    setIsSpinning(false);
    setRouletteItems([]); // Очищаем рулетку
    
    // Очищаем анимацию
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    onClose();
  };

  // Функция для показа красивых уведомлений
  const showNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    if (type === 'success') {
      showSuccess(message);
    } else if (type === 'error') {
      showError(message);
    } else if (type === 'warning') {
      showWarning(message);
    } else {
      showInfo(message);
    }
  };

  // Функция для продажи предмета сразу после открытия кейса
  const handleImmediateSell = async (item: CaseItem) => {
    try {
      console.log('💰 Продаем предмет сразу после открытия кейса:', item);
      console.log('💵 Цена предмета:', item.price);
      
      const { data: currentProfile, error: fetchBalanceError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', telegramId)
        .single();
  
      if (fetchBalanceError || !currentProfile) {
        console.error('❌ Error fetching current balance:', fetchBalanceError);
        showError('Ошибка при получении баланса!');
        return;
      }
  
      const newBalance = (currentProfile.balance || 0) + (item.price || 0);
      console.log('💰 Обновляем баланс:', { old: currentProfile.balance, new: newBalance });
  
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance 
        })
        .eq('telegram_id', telegramId);
  
      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError);
        showError('Ошибка при обновлении баланса!');
        return;
      }
  
      // Обновляем статистику проданных предметов
      const { error: statsError } = await supabase.rpc('increment_user_items_sold', {
        user_telegram_id: telegramId
      });

      if (statsError) {
        console.error('❌ Error updating items sold stats:', statsError);
      } else {
        console.log('✅ Статистика проданных предметов обновлена');
      }

      console.log('✅ Баланс успешно обновлен');
      showSuccess(`Предмет "${item.name}" продан за ${item.price || 0}₴! Деньги добавлены на баланс.`);
      
      // Закрываем окно только после успешной продажи
      setTimeout(() => {
        handleClose();
      }, 2000); // Даем время пользователю увидеть уведомление
      
    } catch (error) {
      console.error('❌ Failed to sell item immediately:', error);
      showError('Ошибка при продаже предмета!');
    }
  };

  const handleConfirmSell = async () => {
    if (winnerItem) {
      await handleImmediateSell(winnerItem);
      setSoldOrAdded(true);
      handleClose();
    }
  };

  const handleCancelSell = () => {
    // setShowConfirmSell(false); // Удалено
    // setItemToSell(null); // Удалено
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
    const currentCaseCount = totalCasesOpened;
    const nextCaseNumber = currentCaseCount + 1;
    
    console.log('=== CALCULATE WINNER START ===');
    console.log('Current case count from DB:', currentCaseCount);
    console.log('Next case number:', nextCaseNumber);
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
      
      // ПРАВИЛЬНАЯ ЛОГИКА: предмет выпадает периодически через каждые N кейсов
      // Например: drop_after_cases = 100 означает выпадение на 100-м, 200-м, 300-м кейсе
      // drop_after_cases = 1000 означает выпадение на 1000-м, 2000-м, 3000-м кейсе
      const isEligible = dropRate > 0 && (nextCaseNumber % dropRate === 0);
      
      console.log(`Checking drop rate ${dropRate}: next case ${nextCaseNumber} % ${dropRate} = ${nextCaseNumber % dropRate}, eligible: ${isEligible}`);
      
      if (isEligible) {
        // Если текущий кейс кратен drop_after_cases, добавляем все предметы с этим значением
        eligibleItems = eligibleItems.concat(itemsByDropRate[dropRate]);
        console.log(`✅ Added items with drop rate ${dropRate}:`, itemsByDropRate[dropRate].map(item => item.name));
      } else {
        console.log(`❌ Case ${nextCaseNumber} is not eligible for drop rate ${dropRate}`);
      }
    });
    
    console.log('Final eligible items:', eligibleItems.map(item => ({ name: item.name, drop_after_cases: item.drop_after_cases })));
    
    // Если нет подходящих предметов, берем предметы с drop_after_cases = 1 (базовые предметы)
    if (eligibleItems.length === 0) {
      console.log('⚠️ No eligible items found for case', nextCaseNumber, ', looking for items with drop_after_cases = 1');
      
      // Ищем предметы с drop_after_cases = 1 (базовые предметы)
      const baseItems = caseItems.filter(item => (item.drop_after_cases || 1) === 1);
      
      if (baseItems.length > 0) {
        eligibleItems = baseItems;
        console.log('✅ Found base items with drop_after_cases = 1:', baseItems.map(item => item.name));
      } else {
        // Если даже базовых предметов нет, берем все (fallback)
        console.log('⚠️ No base items found, using all case items as fallback');
        eligibleItems = caseItems;
      }
    }
    
    // Выбираем случайный предмет из подходящих
    const randomIndex = Math.floor(Math.random() * eligibleItems.length);
    const winner = eligibleItems[randomIndex];
    
    console.log('🎯 Selected winner:', { name: winner.name, rarity: winner.rarity, drop_after_cases: winner.drop_after_cases });
    
    // Показываем текущий счетчик (БЕЗ обновления)
    setSpinCount(nextCaseNumber);
    
    // Отладочная информация
    console.log('Winner calculation result:', {
      currentCaseCount,
      nextCaseCount: nextCaseNumber,
      itemsByDropRate,
      eligibleItems: eligibleItems.map(item => ({ name: item.name, drop_after_cases: item.drop_after_cases })),
      winner: winner.name,
      winnerDropRate: winner.drop_after_cases
    });
    
    console.log('=== CALCULATE WINNER END ===');
    
    return winner;
  };

  // Функция для анимации рулетки
  // Состояние для хранения рандомизированных предметов рулетки
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);

  // Создаем рандомизированный массив предметов для рулетки
  const createRandomizedStrip = (winner: CaseItem) => {
    const BASE_ITEMS = 50; // Базовое количество предметов
    const SPINS = 4; // Количество полных оборотов
    const TOTAL_ITEMS = BASE_ITEMS + (SPINS * caseItems.length); // Общее количество для красивой анимации
    
    const randomItems: CaseItem[] = [];
    
    // Заполняем массив случайными предметами
    for (let i = 0; i < TOTAL_ITEMS; i++) {
      const randomItem = caseItems[Math.floor(Math.random() * caseItems.length)];
      randomItems.push(randomItem);
    }
    
    // Рассчитываем позицию для победного предмета
    // Он должен оказаться в конце анимации под центральной линией
    const winnerPosition = BASE_ITEMS + Math.floor((SPINS * caseItems.length) / 2);
    randomItems[winnerPosition] = winner;
    
    console.log('Created strip:', {
      totalItems: TOTAL_ITEMS,
      winnerPosition,
      winnerName: winner.name,
      itemAtWinnerPosition: randomItems[winnerPosition].name
    });
    
    return { items: randomItems, winnerIndex: winnerPosition };
  };

  const spinToLocalIndex = (winner: CaseItem) => {
    if (!stripRef.current) return;
    
    const strip = stripRef.current;
    const viewport = strip.parentElement;
    
    if (!viewport) return;
    
    console.log('Starting smooth animation for winner:', winner.name);
    
    // Создаем рандомизированную ленту с победным предметом в нужной позиции
    const stripData = createRandomizedStrip(winner);
    const randomizedItems = stripData.items;
    const actualWinnerIndex = stripData.winnerIndex;
    
    // Обновляем состояние React для отображения новых предметов
    setRouletteItems(randomizedItems);
    
    // Параметры анимации - рассчитываем реальную ширину элемента
    const isDesktop = window.innerWidth >= 640;
    const itemWidth = isDesktop ? 150 : 128; // 140px + 10px gap на десктопе, 120px + 8px gap на мобильном
    const viewportWidth = viewport.clientWidth;
    const centerOffset = viewportWidth / 2 - itemWidth / 2;
    
    // Используем фактический индекс победного предмета из созданной ленты
    const winnerIndexInStrip = actualWinnerIndex;
    
    // Начальная позиция - показываем начало ленты
    const startX = centerOffset;
    
    // Конечная позиция - победный предмет точно в центре красной линии
    const targetX = -(winnerIndexInStrip * itemWidth) + centerOffset;
    
    // Устанавливаем начальную позицию
    strip.style.transform = `translate3d(${startX}px, 0, 0)`;
    
    console.log('Animation parameters:', {
      itemWidth,
      isDesktop,
      totalItems: randomizedItems.length,
      winnerIndexInStrip,
      startX,
      targetX,
      distance: targetX - startX,
      centerOffset,
      viewportWidth,
      winnerName: winner.name,
      itemAtIndex: randomizedItems[actualWinnerIndex]?.name
    });
    
    // Гладкая анимация с использованием CSS transition
    setTimeout(() => {
      console.log('Starting CSS animation...');
      strip.style.transition = 'transform 5s cubic-bezier(0.23, 1, 0.32, 1)';
      strip.style.transform = `translate3d(${targetX}px, 0, 0)`;

      // Ждем ПОЛНОГО завершения CSS анимации
      setTimeout(() => {
        console.log('CSS animation completed - 5 seconds passed');

        // Убираем состояние спина - рулетка остановлена
        setIsSpinning(false);
        
        // Сбрасываем transition для следующих спинов
        strip.style.transition = '';

        console.log('Roulette is now completely stopped');

        // БОЛЬШАЯ задержка чтобы пользователь увидел что рулетка остановилась
        setTimeout(() => {
          console.log('Now showing the result modal');
          
          // Проверяем какой предмет реально находится под красной линией
          // Рассчитываем индекс на основе финальной позиции
          const currentTransform = strip.style.transform;
          const translateX = parseFloat(currentTransform.match(/translate3d\(([^,]+)/)?.[1] || '0');
          const calculatedIndex = Math.round((-translateX + centerOffset) / itemWidth);
          
          console.log('Final position check:', {
            currentTransform,
            translateX,
            centerOffset,
            itemWidth,
            calculatedIndex,
            expectedIndex: actualWinnerIndex,
            itemAtCalculatedIndex: randomizedItems[calculatedIndex]?.name,
            itemAtExpectedIndex: randomizedItems[actualWinnerIndex]?.name
          });
          
          // Используем рассчитанный индекс для более точного результата
          const finalIndex = calculatedIndex >= 0 && calculatedIndex < randomizedItems.length ? calculatedIndex : actualWinnerIndex;
          const actualWinnerItem = randomizedItems[finalIndex];
          
          console.log('Item under red line:', {
            finalIndex,
            name: actualWinnerItem.name,
            originalWinner: winner.name,
            match: actualWinnerItem.name === winner.name
          });
          
          // Показываем результат с предметом который реально под красной линией
          setShowResult(true);
          setWinnerItem(actualWinnerItem);

          // Анимация яркости viewport
          if (viewport) {
            viewport.animate([
              {filter:'brightness(1.0)'},
              {filter:'brightness(1.6)'},
              {filter:'brightness(1.0)'}
            ], {duration:500});
          }

          console.log('Result modal displayed with actual winner:', actualWinnerItem.name);
        }, 1000); // 1 секунда после остановки рулетки

        // Очищаем анимацию
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

      }, 5000); // Точно 5 секунд - время CSS анимации

    }, 200); // Небольшая задержка для применения начальной позиции
  };

  const startSpin = async () => {
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
      console.error('No case items available for spinning');
      showError('Нет предметов для открытия в этом кейсе');
      return;
    }

    try {
      // Проверяем баланс и списываем стоимость кейса
      console.log('💰 Проверяем баланс и списываем стоимость кейса:', casePrice);
      
      if (!profile?.telegram_id) {
        showError('Пользователь не авторизован');
        return;
      }

      // Получаем текущий баланс
      const { data: currentProfile, error: fetchBalanceError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('telegram_id', profile.telegram_id)
        .single();

      if (fetchBalanceError || !currentProfile) {
        console.error('❌ Error fetching current balance:', fetchBalanceError);
        showError('Ошибка при получении баланса');
        return;
      }

      const currentBalance = currentProfile.balance || 0;
      console.log('💰 Текущий баланс:', currentBalance, 'Стоимость кейса:', casePrice);

      // Проверяем, достаточно ли средств
      if (currentBalance < casePrice) {
        showError(`Недостаточно средств! Нужно: ${casePrice}₴, доступно: ${currentBalance}₴`);
        return;
      }

      // Списываем стоимость кейса
      const newBalance = currentBalance - casePrice;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ 
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('telegram_id', profile.telegram_id);

      if (balanceError) {
        console.error('❌ Error updating balance:', balanceError);
        showError('Ошибка при списании средств');
        return;
      }

      console.log('✅ Средства успешно списаны. Новый баланс:', newBalance);
      
      // Создаем транзакцию списания
      try {
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            user_id: profile.telegram_id,
            type: 'case_opening',
            amount: -casePrice,
            description: `Открытие кейса "${caseName}"`,
            created_at: new Date().toISOString()
          });

        if (transactionError) {
          console.error('❌ Error creating transaction:', transactionError);
          // Не прерываем процесс, если транзакция не создалась
        } else {
          console.log('✅ Транзакция создана');
        }
      } catch (error) {
        console.error('❌ Failed to create transaction:', error);
      }

      showInfo(`Списано ${casePrice}₴ за открытие кейса`);
      
      // Обновляем статистику трат пользователя (кейсы считаются как покупки)
      try {
        const { error: statsError } = await supabase.rpc('update_user_purchase_stats', {
          user_telegram_id: profile.telegram_id,
          order_amount: casePrice
        });

        if (statsError) {
          console.error('❌ Error updating user purchase stats:', statsError);
        } else {
          console.log('✅ Статистика трат пользователя обновлена');
        }
      } catch (error) {
        console.error('❌ Failed to update user purchase stats:', error);
      }

      // Обновляем профиль в контексте
      await refreshProfile();

      // Увеличиваем глобальный счетчик открытых кейсов
      console.log('Увеличиваем глобальный счетчик кейсов...');
      const success = await incrementGlobalCounter();
      
      if (!success) {
        console.warn('Не удалось увеличить глобальный счетчик, продолжаем с текущим значением');
      } else {
        console.log('✅ Глобальный счетчик успешно увеличен');
        
        // Обновляем индивидуальную статистику открытых кейсов пользователя
        if (profile?.telegram_id) {
          try {
            console.log('🔄 Обновляем индивидуальную статистику кейсов для пользователя:', profile.telegram_id);
            
            const { error: statsError } = await supabase.rpc('increment_user_cases_opened', {
              user_telegram_id: profile.telegram_id
            });

            if (statsError) {
              console.error('❌ Error updating user cases statistics:', statsError);
            } else {
              console.log('✅ Индивидуальная статистика кейсов пользователя обновлена');
              // Обновляем профиль в контексте
              await refreshProfile();
            }
          } catch (error) {
            console.error('❌ Failed to update user cases statistics:', error);
          }
        }
      }

      // Определяем победный предмет
      const winner = calculateWinner();
      console.log('Winner calculated:', winner.name);
      
      // Запускаем анимацию
      if (stripRef.current) {
        spinToLocalIndex(winner);
        setIsSpinning(true);
        console.log('=== START SPIN END ===');
      } else {
        console.error('Strip element not found!');
      }
    } catch (err) {
      console.error('Ошибка при запуске спина:', err);
      showError('Ошибка при открытии кейса');
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
            
            {/* Кнопка запуска рулетки */}
            {!showResult ? (
              <div className="space-y-6 sm:space-y-8">
                {/* Заголовок */}
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Открытие кейса
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Нажмите кнопку ниже, чтобы открыть кейс и получить случайный предмет
                  </p>
                </div>
                
                {/* Кнопка запуска */}
                <div className="text-center">
                  <Button
                    onClick={startSpin}
                    disabled={isSpinning}
                    className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold text-lg sm:text-xl px-8 sm:px-12 py-4 sm:py-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSpinning ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-3"></div>
                        Открытие...
                      </>
                    ) : (
                      <>
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
                        Открыть кейс
                      </>
                    )}
                  </Button>
                </div>

                {/* Рулетка */}
                <div className="relative">
                  {/* Контейнер рулетки */}
                  <div className="relative h-36 sm:h-40 md:h-44 bg-gradient-to-br from-gray-900/90 to-gray-800/80 rounded-2xl border-2 border-amber-500/50 overflow-hidden shadow-2xl shadow-amber-500/20 backdrop-blur-xl">
                    {/* Анимированный фон */}
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-500/10 to-amber-500/5 opacity-50" style={{
                      backgroundSize: '200% 100%',
                      animation: 'gradient-shift 3s ease-in-out infinite'
                    }}></div>
                    
                    {/* Центральная линия с анимацией */}
                    <div className={`absolute left-1/2 top-0 bottom-0 w-1 sm:w-1.5 bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-300 transform -translate-x-1/2 z-20 shadow-2xl shadow-amber-400/80 rounded-full ${
                      isSpinning ? 'animate-pulse' : ''
                    }`}>
                      {/* Светящиеся точки */}
                      <div className="absolute -top-2 -left-1.5 w-4 h-4 bg-amber-400 rounded-full opacity-80 animate-ping shadow-lg shadow-amber-400/60"></div>
                      <div className="absolute -bottom-2 -left-1.5 w-4 h-4 bg-amber-400 rounded-full opacity-80 animate-ping shadow-lg shadow-amber-400/60" style={{ animationDelay: '0.5s' }}></div>
                      
                      {/* Центральный индикатор */}
                      <div className="absolute top-1/2 -left-2 w-5 h-5 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transform -translate-y-1/2 animate-pulse shadow-xl shadow-amber-400/80 border-2 border-white/20"></div>
                    </div>
                    
                    {/* Лента с предметами */}
                    <div 
                      ref={stripRef}
                      className="flex gap-2.5 items-center p-3 sm:p-4 h-full"
                      style={{ transform: 'translateX(0px)' }}
                    >
                      {/* Показываем рандомизированные предметы при спине или превью */}
                      {(isSpinning ? rouletteItems : caseItems).map((item, index) => (
                        <div
                          key={`${isSpinning ? 'roulette' : 'preview'}-${item.id}-${index}`}
                          className={`flex-shrink-0 w-35 h-30 rounded-lg sm:rounded-xl p-2 flex flex-col relative isolation isolate item ${
                            getRarityColor(item.rarity)
                          } overflow-hidden group`}
                        >
                          {/* Блеск */}
                          <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-60"></div>
                          {/* Свечение */}
                          <div className="absolute -inset-1 rounded-lg sm:rounded-xl opacity-30 blur-sm" style={{ 
                            background: item.rarity.toLowerCase() === 'legendary' ? 'linear-gradient(45deg, #FFD700, #FFA500)' :
                                      item.rarity.toLowerCase() === 'epic' ? 'linear-gradient(45deg, #9B59B6, #8E44AD)' :
                                      item.rarity.toLowerCase() === 'rare' ? 'linear-gradient(45deg, #3498DB, #2980B9)' :
                                      'linear-gradient(45deg, #95A5A6, #7F8C8D)'
                          }}></div>
                          
                          {/* Изображение предмета */}
                          <div className="flex-1 flex items-center justify-center relative z-10 mb-1">
                            {item.image_url ? (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-md group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700/50 rounded-md flex items-center justify-center">
                                <Gift className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                              </div>
                            )}
                          </div>
                          
                          {/* Информация о предмете */}
                          <div className="relative z-10 text-center">
                            {/* Название предмета */}
                            <div className="font-bold text-xs leading-tight mb-1 line-clamp-2">
                              {item.name}
                            </div>
                            
                            {/* Тег редкости */}
                            <div className="opacity-80 text-xs uppercase font-bold">
                              {getRarityTag(item.rarity)}
                            </div>
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
              <div className="text-center space-y-4 sm:space-y-6 relative">
                {/* Фоновые анимированные частицы */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full opacity-60 animate-ping"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        animationDuration: `${2 + Math.random() * 2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Заголовок с анимацией */}
                <div className="relative z-10">
                  <div className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 animate-bounce">🎉</div>
                  
                  <h3 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 mb-3 sm:mb-4 animate-pulse">
                    Поздравляем!
                  </h3>
                </div>
                
                {winnerItem && (
                  <div className="relative z-10 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 shadow-2xl backdrop-blur-xl overflow-hidden" style={{
                    borderColor: winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700' :
                                winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6' :
                                winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB' :
                                '#95A5A6',
                    boxShadow: `0 0 60px ${
                      winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700' :
                      winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6' :
                      winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB' :
                      '#95A5A6'
                    }40`
                  }}>
                    {/* Анимированный фон */}
                    <div className="absolute inset-0 opacity-10" style={{
                      background: `linear-gradient(45deg, ${
                        winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700, #FFA500' :
                        winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6, #8E44AD' :
                        winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB, #2980B9' :
                        '#95A5A6, #7F8C8D'
                      })`,
                      backgroundSize: '400% 400%',
                      animation: 'gradient-shift 4s ease-in-out infinite'
                    }}></div>
                    
                    {/* Изображение предмета с эффектами */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mx-auto relative">
                        {/* Светящийся фон */}
                        <div className="absolute inset-0 rounded-2xl opacity-30 blur-xl animate-pulse" style={{
                          background: `radial-gradient(circle, ${
                            winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700' :
                            winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6' :
                            winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB' :
                            '#95A5A6'
                          }, transparent)`
                        }}></div>
                        
                        {/* Вращающееся кольцо */}
                        <div className="absolute inset-0 border-4 border-transparent rounded-2xl animate-spin" style={{
                          borderTopColor: winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700' :
                                        winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6' :
                                        winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB' :
                                        '#95A5A6',
                          animationDuration: '3s'
                        }}></div>
                        
                        {/* Изображение */}
                        <div className="relative z-10 w-full h-full bg-gray-800/60 rounded-2xl border-2 flex items-center justify-center backdrop-blur-sm" style={{
                          borderColor: winnerItem.rarity.toLowerCase() === 'legendary' ? '#FFD700' :
                                      winnerItem.rarity.toLowerCase() === 'epic' ? '#9B59B6' :
                                      winnerItem.rarity.toLowerCase() === 'rare' ? '#3498DB' :
                                      '#95A5A6'
                        }}>
                          {winnerItem.image_url ? (
                            <img
                              src={winnerItem.image_url}
                              alt={winnerItem.name}
                              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain rounded-xl animate-pulse"
                            />
                          ) : (
                            <Gift className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-amber-400 animate-bounce" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Информация о предмете */}
                    <div className="relative z-10 space-y-4">
                      <h4 className="text-2xl sm:text-3xl font-black text-white drop-shadow-lg">
                        {winnerItem.name}
                      </h4>
                      
                      {/* Цена с анимацией */}
                      <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse">
                        {winnerItem.price || 0}₴
                      </div>
                      
                      {/* Значок редкости */}
                      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider shadow-lg animate-bounce ${
                        winnerItem.rarity.toLowerCase() === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-yellow-500/50' :
                        winnerItem.rarity.toLowerCase() === 'epic' ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-purple-500/50' :
                        winnerItem.rarity.toLowerCase() === 'rare' ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-blue-500/50' :
                        'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-gray-500/50'
                      }`}>
                        ✨ {getRarityName(winnerItem.rarity)}
                      </div>
                      
                      <p className="text-gray-300 text-base sm:text-lg font-medium">
                        Предмет добавлен в ваш инвентарь!
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Кнопки действий */}
                <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-4">
                  <Button
                    onClick={async () => {
                      if (winnerItem && !soldOrAdded) {
                        console.log('💵 Добавляем предмет в инвентарь:', winnerItem.name);
                        
                        // Добавляем предмет в инвентарь через callback
                        onCaseOpened(winnerItem, 'add');
                        
                        // Отмечаем, что предмет добавлен
                        setSoldOrAdded(true);
                        
                        // Показываем уведомление
                        showSuccess(`Предмет "${winnerItem.name}" добавлен в инвентарь!`);
                        
                        // Закрываем окно через некоторое время
                        setTimeout(() => {
                          handleClose();
                        }, 2000);
                      }
                    }}
                    disabled={soldOrAdded}
                    className="group relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white px-8 py-4 text-base font-bold rounded-2xl transition-all duration-500 hover:scale-110 hover:rotate-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 border border-green-400/30"
                  >
                    {/* Анимированный фон */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Блеск */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 flex items-center justify-center">
                      <Package className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                      Добавить в инвентарь
                    </div>
                  </Button>
                  
                  <Button
                    onClick={async () => {
                      if (winnerItem && !soldOrAdded) {
                        console.log('🔄 Нажата кнопка "Продать" для предмета:', winnerItem);
                        
                        // Продаем предмет сразу (без добавления в инвентарь)
                        await handleImmediateSell(winnerItem);
                        
                        // Отмечаем, что предмет продан
                        setSoldOrAdded(true);
                      }
                    }}
                    disabled={soldOrAdded}
                    className="group relative overflow-hidden bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white px-8 py-4 text-base font-bold rounded-2xl transition-all duration-500 hover:scale-110 hover:-rotate-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 border border-red-400/30"
                  >
                    {/* Анимированный фон */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Блеск */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 mr-3 group-hover:animate-spin" />
                      Продать
                    </div>
                  </Button>
                </div>
                
                {/* Убираем кнопку "Закрыть" - окно закрывается автоматически после действия */}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Красивое уведомление */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />

      {/* Модальное окно подтверждения продажи */}
      {/* Удалено */}
      
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
