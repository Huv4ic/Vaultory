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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none transition-colors duration-200"
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </button>
        {winningIndex !== null && (
          <div className="flex flex-col items-center">
            <div className="text-6xl mb-4 animate-bounce">{caseData.icon}</div>
            <div className="text-2xl font-bold text-white mb-2 animate-fade-in">Поздравляем!</div>
            <div className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-black font-bold text-xl px-6 py-3 rounded-lg shadow-lg mb-4 animate-fade-in">
              {caseData.items[winningIndex].name}
            </div>
            <div className="flex space-x-4 mb-6">
              <span className="bg-gray-800 text-yellow-200 px-4 py-2 rounded-lg font-bold shadow">Шанс: {caseData.items[winningIndex].chance}%</span>
              <span className="bg-gray-800 text-green-300 px-4 py-2 rounded-lg font-bold shadow">Цена: {caseData.items[winningIndex].price}₽</span>
            </div>
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
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CaseOpeningModal;
