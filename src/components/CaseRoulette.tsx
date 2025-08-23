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
  const rouletteRef = useRef<HTMLDivElement>(null);
  const [spinCount, setSpinCount] = useState(0);

  // Функция для определения победного предмета на основе drop_after_cases
  const calculateWinner = (): CaseItem => {
    // Получаем текущий счетчик открытых кейсов (можно хранить в localStorage или базе)
    const currentCaseCount = parseInt(localStorage.getItem('totalCasesOpened') || '0') + 1;
    
    // Находим предмет, который должен выпасть на текущем счетчике
    let winner = caseItems[0]; // По умолчанию первый предмет
    
    for (const item of caseItems) {
      if (item.drop_after_cases && currentCaseCount >= item.drop_after_cases) {
        winner = item;
        break;
      }
    }
    
    // Обновляем счетчик
    localStorage.setItem('totalCasesOpened', currentCaseCount.toString());
    setSpinCount(currentCaseCount);
    
    return winner;
  };

  const startSpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setWinnerItem(null);
    setShowResult(false);
    
    // Определяем победный предмет
    const winner = calculateWinner();
    setWinnerItem(winner);
    
    // Анимация вращения
    if (rouletteRef.current) {
      const roulette = rouletteRef.current;
      const items = roulette.children;
      const itemWidth = 120; // Ширина каждого предмета
      const centerOffset = 300; // Смещение центра
      
      // Позиция победного предмета
      const winnerIndex = caseItems.findIndex(item => item.id === winner.id);
      const targetPosition = -(winnerIndex * itemWidth) + centerOffset;
      
      // Добавляем случайность для реалистичности
      const randomOffset = Math.random() * 100 - 50;
      const finalPosition = targetPosition + randomOffset;
      
      // Анимация
      roulette.style.transition = 'transform 4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      roulette.style.transform = `translateX(${finalPosition}px)`;
      
      // Останавливаем анимацию через 4 секунды
      setTimeout(() => {
        setIsSpinning(false);
        setShowResult(true);
        onCaseOpened(winner);
      }, 4000);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
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

  return (
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
              className="text-gray-400 hover:text-white hover:bg-white/10"
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
                {/* Центральная линия */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-yellow-400 transform -translate-x-1/2 z-10 shadow-lg shadow-amber-400/50"></div>
                
                {/* Контейнер рулетки */}
                <div className="relative h-40 bg-gray-800/50 rounded-2xl border border-amber-500/30 overflow-hidden">
                  <div 
                    ref={rouletteRef}
                    className="flex items-center h-full transition-transform duration-1000 ease-out"
                    style={{ transform: 'translateX(300px)' }}
                  >
                    {/* Дублируем предметы для бесконечной прокрутки */}
                    {[...caseItems, ...caseItems, ...caseItems].map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className={`flex-shrink-0 w-28 h-28 mx-2 rounded-xl border-2 ${getRarityColor(item.rarity)} bg-gray-700/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 transition-all duration-300 hover:scale-110`}
                      >
                        {/* Изображение предмета */}
                        <div className="w-16 h-16 mb-2 rounded-lg overflow-hidden bg-gray-600 flex items-center justify-center">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        
                        {/* Название предмета */}
                        <p className="text-white text-xs font-medium text-center leading-tight">
                          {item.name}
                        </p>
                        
                        {/* Редкость */}
                        <span className={`text-xs px-2 py-1 rounded-full mt-1 ${
                          item.rarity.toLowerCase() === 'common' ? 'bg-gray-500 text-white' :
                          item.rarity.toLowerCase() === 'rare' ? 'bg-blue-500 text-white' :
                          item.rarity.toLowerCase() === 'epic' ? 'bg-purple-500 text-white' :
                          item.rarity.toLowerCase() === 'legendary' ? 'bg-yellow-500 text-black' :
                          'bg-gray-500 text-white'
                        }`}>
                          {getRarityName(item.rarity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Подсказка */}
                <p className="text-center text-gray-400 mt-4 text-sm">
                  {isSpinning ? 'Рулетка крутится...' : 'Нажмите кнопку, чтобы запустить рулетку'}
                </p>
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
                  onClick={onClose}
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
  );
};

export default CaseRoulette;
