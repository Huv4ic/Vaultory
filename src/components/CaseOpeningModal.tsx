import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign, Package, Plus, User, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { refreshAchievements } from '@/utils/achievementUtils';

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
  const { telegramUser, balance, setBalance } = useAuth();
  const [isOpening, setIsOpening] = useState(false);
  const [results, setResults] = useState<CaseItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [soldOrAdded, setSoldOrAdded] = useState(false);

  console.log('CaseOpeningModal render:', { isOpen, caseData, winningIndex });

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

  const winningItem = (winningIndex !== null && rouletteItems && rouletteItems[winningIndex]) ? rouletteItems[winningIndex] : null;

  const handleAddToInventory = async () => {
    if (!telegramUser || soldOrAdded || !winningItem) return;
    try {
      setSoldOrAdded(true);
      onKeepItem(winningItem);
    } catch (error) {
      console.error('Ошибка при добавлении в инвентарь:', error);
      alert('Произошла ошибка при добавлении в инвентарь');
    }
  };

  const handleSell = async () => {
    if (!telegramUser || soldOrAdded || !winningItem) return;
    try {
      const sellPrice = Math.floor(winningItem.price * 0.7); // 70% от цены
      
      // Обновляем баланс через функцию
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_id: telegramUser.id,
        amount: sellPrice,
        description: 'Продажа предмета из кейса'
      });

      if (balanceError) {
        console.error('Ошибка при обновлении баланса:', balanceError);
        alert('Ошибка при обновлении баланса');
        return;
      }

      const newBalance = balance + sellPrice;
      setBalance(newBalance);
      setSoldOrAdded(true);
      onSellItem(winningItem, sellPrice);
      
      // Обновляем статистику проданных предметов
      try {
        const { error: statsError } = await supabase.rpc('increment_user_items_sold', {
          user_telegram_id: telegramUser.id
        });

        if (statsError) {
          console.error('Ошибка обновления статистики проданных предметов:', statsError);
        } else {
          console.log('Статистика проданных предметов обновлена');
        }
      } catch (error) {
        console.error('Ошибка при обновлении статистики:', error);
      }
      
      // Обновляем достижения
      await refreshAchievements();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-[#181818] rounded-2xl p-8 animate-fade-in z-50 border border-[#1c1c1c]">
        <DialogHeader>
          <DialogTitle>Результат открытия кейса</DialogTitle>
        </DialogHeader>
        <button
          className="absolute top-4 right-4 text-[#a0a0a0] hover:text-[#a31212] text-2xl font-bold focus:outline-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        {winningItem && (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4 animate-bounce">{caseData.icon}</div>
            <div className="text-2xl font-bold text-[#f0f0f0] mb-2 animate-fade-in">Поздравляем!</div>
            <div className="bg-[#a31212] text-white font-bold text-xl px-6 py-3 rounded-lg mb-4 animate-fade-in">
              {winningItem.name}
            </div>
            <div className="flex space-x-4 mb-6">
              <span className="bg-[#1c1c1c] text-[#a31212] px-4 py-2 rounded-lg font-bold">Шанс: {winningItem.chance}%</span>
              <span className="bg-[#1c1c1c] text-[#a31212] px-4 py-2 rounded-lg font-bold">Цена: ${winningItem.price}</span>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
              <button
                className={`w-full md:w-40 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg py-3 rounded-lg transition-all duration-200 mb-2 flex items-center justify-center gap-2 ${soldOrAdded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                onClick={handleAddToInventory}
                disabled={soldOrAdded}
              >
                <Package className="w-5 h-5" />
                Добавить в инвентарь
              </button>
              <button
                className={`w-full md:w-40 bg-[#1c1c1c] hover:bg-[#a31212] text-[#a0a0a0] hover:text-white font-bold text-lg py-3 rounded-lg transition-all duration-200 mb-2 flex items-center justify-center gap-2 ${soldOrAdded ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                onClick={handleSell}
                disabled={soldOrAdded}
              >
                <DollarSign className="w-5 h-5" />
                Продать
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CaseOpeningModal;
