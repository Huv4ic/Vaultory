import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign, Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface CaseItem {
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  chance: number;
}

interface GameCase {
  id: string;
  name: string;
  game: string;
  price: number;
  image: string;
  items: CaseItem[];
  gradient: string;
  icon: string;
}

interface CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: GameCase | null;
  openingCount: number;
  onSellItem: (item: CaseItem, price: number) => void;
  onKeepItem: (item: CaseItem) => void;
}

const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({
  isOpen,
  onClose,
  caseData,
  openingCount,
  onSellItem,
  onKeepItem,
}) => {
  const { user, balance, setBalance, refreshProfile } = useAuth();
  const [isOpening, setIsOpening] = useState(false);
  const [results, setResults] = useState<CaseItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soldOrAdded, setSoldOrAdded] = useState(false);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-600';
      case 'rare': return 'bg-blue-600';
      case 'epic': return 'bg-purple-600';
      case 'legendary': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-500 to-gray-700';
      case 'rare': return 'from-blue-500 to-blue-700';
      case 'epic': return 'from-purple-500 to-purple-700';
      case 'legendary': return 'from-yellow-400 to-orange-600';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const generateRouletteItems = (caseData: GameCase) => {
    const items: CaseItem[] = [];
    for (let i = 0; i < 50; i++) {
      const random = Math.random() * 100;
      let cumulativeChance = 0;
      let selectedItem = caseData.items[0];

      for (const item of caseData.items) {
        cumulativeChance += item.chance;
        if (random <= cumulativeChance) {
          selectedItem = item;
          break;
        }
      }
      items.push(selectedItem);
    }
    return items;
  };

  const openCase = () => {
    if (!caseData) return;
    
    setIsOpening(true);
    setResults([]);
    setShowResults(false);
    setWinningIndex(null);
    setIsSpinning(false);

    // Генерируем предметы для рулетки
    const roulette = generateRouletteItems(caseData);
    setRouletteItems(roulette);

    // Определяем выигрышный индекс
    const winIndex = Math.floor(Math.random() * 10) + 20;
    setWinningIndex(winIndex);

    // Запускаем анимацию
    setTimeout(() => {
      setIsSpinning(true);
    }, 100);

    // Показываем результат
    setTimeout(() => {
      const newResults: CaseItem[] = [];
      
      for (let i = 0; i < openingCount; i++) {
        const random = Math.random() * 100;
        let cumulativeChance = 0;
        let selectedItem = caseData.items[0];

        for (const item of caseData.items) {
          cumulativeChance += item.chance;
          if (random <= cumulativeChance) {
            selectedItem = item;
            break;
          }
        }
        newResults.push(selectedItem);
      }
      
      setResults(newResults);
      setIsOpening(false);
      setShowResults(true);
    }, 3500);
  };

  const handleSellItem = (item: CaseItem, index: number) => {
    const sellPrice = Math.floor(item.price * 0.8);
    onSellItem(item, sellPrice);
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeepItem = (item: CaseItem, index: number) => {
    onKeepItem(item);
    setResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    setIsOpening(false);
    setResults([]);
    setShowResults(false);
    setWinningIndex(null);
    setIsSpinning(false);
    onClose();
  };

  const handleAddToInventory = async () => {
    if (!user || soldOrAdded) return;
    
    try {
      // Пока просто сохраняем в локальное состояние
      setSoldOrAdded(true);
      onKeepItem(caseData.items[winningIndex]);
    } catch (error) {
      console.error('Ошибка при добавлении в инвентарь:', error);
      alert('Произошла ошибка при добавлении в инвентарь');
    }
  };

  const handleSell = async () => {
    if (!user || soldOrAdded) return;
    
    try {
      const sellPrice = Math.floor(caseData.items[winningIndex].price * 0.7); // 70% от цены
      const newBalance = balance + sellPrice;
      
      // Обновляем баланс в базе данных
      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (error) throw error;

      // Обновляем локальное состояние
      setBalance(newBalance);
      await refreshProfile();
      
      setSoldOrAdded(true);
      onSellItem(caseData.items[winningIndex], sellPrice);
    } catch (error) {
      console.error('Ошибка при продаже предмета:', error);
      alert('Произошла ошибка при продаже предмета');
    }
  };

  useEffect(() => {
    if (isOpen && caseData) {
      openCase();
    }
  }, [isOpen, caseData]);

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl min-h-[60vh] bg-gray-900 border-gray-700 text-white p-8 md:p-12 rounded-2xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Открытие {caseData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Рулетка */}
          {isOpening && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
              <h3 className="text-xl font-bold mb-4 text-center">🎰 Рулетка</h3>
              
              {/* Указатель */}
              <div className="relative mb-4">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="w-1 h-8 bg-red-500 shadow-lg shadow-red-500/50"></div>
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500 mx-auto"></div>
                </div>
                
                {/* Рулетка */}
                <div className="overflow-hidden bg-gray-700/50 rounded-lg p-2">
                  <div 
                    className={`flex gap-2 transition-transform duration-[3000ms] ease-out ${
                      isSpinning ? 'animate-none' : ''
                    }`}
                    style={{
                      transform: isSpinning && winningIndex !== null 
                        ? `translateX(-${(winningIndex * 112) - 300}px)` 
                        : 'translateX(0px)',
                    }}
                  >
                    {rouletteItems.map((item, index) => (
                      <div 
                        key={index}
                        className={`min-w-[110px] h-24 bg-gradient-to-br ${getRarityGradient(item.rarity)} rounded-lg flex flex-col items-center justify-center text-xs text-white font-bold text-center p-2 border-2 ${
                          winningIndex === index && isSpinning ? 'border-yellow-400 shadow-lg shadow-yellow-400/50' : 'border-white/20'
                        } flex-shrink-0`}
                      >
                        <div className="truncate w-full mb-1">{item.name}</div>
                        <div className="text-green-300">{item.price}₽</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-400">
                <div className="animate-spin inline-block">🎯</div>
                <p className="mt-2">Определяем победителя...</p>
              </div>
            </div>
          )}

          {/* Результаты */}
          {showResults && results.length > 0 && (
            <div className="animate-scale-in">
              <h4 className="text-2xl font-bold mb-6 text-center">🎉 Поздравляем! Вы выиграли:</h4>
              <div className="grid gap-4">
                {results.map((result, index) => (
                  <div key={index} className={`bg-gradient-to-br ${getRarityGradient(result.rarity)} p-6 rounded-xl border-2 border-white/20`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getRarityColor(result.rarity)} text-white`}>
                          {result.rarity}
                        </Badge>
                        <span className="text-white font-bold text-lg">{result.name}</span>
                      </div>
                      <div className="text-white font-bold text-xl">{result.price}₽</div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleSellItem(result, index)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Продать за {Math.floor(result.price * 0.8)}₽
                      </Button>
                      <Button
                        onClick={() => handleKeepItem(result, index)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Package className="w-4 h-4 mr-2" />
                        В профиль
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {results.length === 0 && (
                <div className="text-center mt-6">
                  <Button onClick={handleClose} className="bg-gray-600 hover:bg-gray-700">
                    Закрыть
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
          <button
            className={`w-full md:w-48 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 mb-2 ${soldOrAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddToInventory}
            disabled={soldOrAdded}
          >
            Добавить в инвентарь
          </button>
          <button
            className={`w-full md:w-48 bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 mb-2 ${soldOrAdded ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSell}
            disabled={soldOrAdded}
          >
            Продать
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseOpeningModal;
