import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, DollarSign, Package } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
  // Массив состояний для каждой рулетки
  const [spins, setSpins] = useState([]);
  // Отслеживаем обработанные предметы (проданные или добавленные в инвентарь)
  const [processedItems, setProcessedItems] = useState(new Set());

  const ITEM_WIDTH = 112; // px
  const GAP = 8; // px (gap-2)
  const CONTAINER_WIDTH = 700; // px

  // refs для рулеток и элементов
  const rouletteRefs = useRef([]);
  const itemRefs = useRef([]);

  const { addItem } = useInventory();
  const { setBalance, balance } = useAuth();
  const { toast } = useToast();

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

  const generateRouletteItems = (caseData: GameCase, winningItem: CaseItem, winningIndex: number) => {
    const items: CaseItem[] = [];
    for (let i = 0; i < 50; i++) {
      if (i === winningIndex) {
        items.push(winningItem);
      } else {
        // Случайный предмет (но не обязательно выигрышный)
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
    }
    return items;
  };

  useEffect(() => {
    if (isOpen && caseData) {
      // Сбрасываем обработанные предметы при открытии нового модального окна
      setProcessedItems(new Set());
      
      // Для каждого открытия генерируем своё состояние
      const newSpins = Array.from({ length: openingCount }).map(() => {
        // Выбираем выигрышный предмет заранее
        const random = Math.random() * 100;
        let cumulativeChance = 0;
        let winningItem = caseData.items[0];
        for (const item of caseData.items) {
          cumulativeChance += item.chance;
          if (random <= cumulativeChance) {
            winningItem = item;
            break;
          }
        }
        // Индекс по центру
        const winIndex = Math.floor(Math.random() * 10) + 20;
        // Генерируем рулетку
        const roulette = generateRouletteItems(caseData, winningItem, winIndex);
        return {
          isOpening: true,
          isSpinning: false,
          showResults: false,
          winningIndex: winIndex,
          winningItem,
          rouletteItems: roulette,
          result: null,
        };
      });
      setSpins(newSpins);

      // Запускаем анимацию для каждой рулетки
      setTimeout(() => {
        setSpins(spins => spins.map(s => ({ ...s, isSpinning: true })));
      }, 100);
      setTimeout(() => {
        setSpins(spins => spins.map(s => ({ ...s, isSpinning: false })));
        setTimeout(() => {
          // После остановки анимации определяем результат через DOM
          setSpins(spins => spins.map((s, idx) => {
            let resultItem = null;
            if (rouletteRefs.current[idx] && itemRefs.current[idx]) {
              const containerRect = rouletteRefs.current[idx].getBoundingClientRect();
              const pointerX = containerRect.left + containerRect.width / 2;
              let minDist = Infinity;
              let foundIndex = 0;
              for (let i = 0; i < itemRefs.current[idx].length; i++) {
                const el = itemRefs.current[idx][i];
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                const elCenter = rect.left + rect.width / 2;
                const dist = Math.abs(elCenter - pointerX);
                if (dist < minDist) {
                  minDist = dist;
                  foundIndex = i;
                }
              }
              resultItem = s.rouletteItems[foundIndex];
            }
            return { ...s, isOpening: false, showResults: true, result: resultItem };
          }));
        }, 800);
      }, 3000);
    } else if (!isOpen) {
      setSpins([]);
    }
  }, [isOpen, caseData, openingCount]);

  const getContainerStyle = (count) => {
    if (count === 1) {
      return { width: '100%', minWidth: 350, margin: '0 auto', display: 'flex', justifyContent: 'center' };
    }
    return { maxWidth: 700, margin: '0 auto' };
  };

  if (!caseData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Открытие {caseData.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {spins.map((spin, idx) => {
              const pointerOffset = CONTAINER_WIDTH / 2;
              const currentTranslateX = spin.isSpinning && spin.winningIndex !== null
                ? (spin.winningIndex * ITEM_WIDTH) - (CONTAINER_WIDTH / 2) + (ITEM_WIDTH / 2)
                : 0;
              const pointerIndex = Math.round((pointerOffset + currentTranslateX) / ITEM_WIDTH);
              const itemKey = `${idx}-${spin.result?.name}`;
              const isProcessed = processedItems.has(itemKey);
              return (
                <div key={idx}>
                  {/* Рулетка */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6">
                    <h3 className="text-xl font-bold mb-4 text-center">🎰 Рулетка #{idx + 1}</h3>
                    <div className="relative mb-4">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="w-1 h-8 bg-red-500 shadow-lg shadow-red-500/50"></div>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-red-500 mx-auto"></div>
                      </div>
                      <div
                        className="overflow-x-auto bg-gray-700/50 rounded-lg p-2"
                        style={getContainerStyle(openingCount)}
                        ref={el => rouletteRefs.current[idx] = el}
                      >
                        <div
                          className="flex gap-2"
                          style={{
                            width: spin.rouletteItems.length * ITEM_WIDTH,
                            transition: spin.isSpinning ? 'transform 3s cubic-bezier(0.22, 1, 0.36, 1)' : undefined,
                            transform: spin.isSpinning && spin.winningIndex !== null
                              ? `translateX(-${(spin.winningIndex * ITEM_WIDTH) - (CONTAINER_WIDTH / 2) + (ITEM_WIDTH / 2)}px)`
                              : 'translateX(0px)',
                          }}
                        >
                          {spin.rouletteItems.map((item, i) => (
                            <div
                              key={i}
                              ref={el => {
                                if (!itemRefs.current[idx]) itemRefs.current[idx] = [];
                                itemRefs.current[idx][i] = el;
                              }}
                              className={`rounded-lg px-4 py-2 flex flex-col items-center justify-center min-w-[112px] max-w-[112px] ${i === spin.winningIndex ? 'ring-4 ring-yellow-400' : ''}`}
                              style={{ background: '#23272f' }}
                            >
                              <span className="font-bold text-white text-sm mb-1">{item.name}</span>
                              <span className="text-green-400 font-semibold text-xs">{item.price}₽</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* После остановки — показать результат и кнопки */}
                    {spin.showResults && spin.result && (
                      <div className="mt-4 flex flex-col items-center">
                        <div className="text-lg font-bold text-white mb-2">
                          Выпал предмет: <span className="text-yellow-400">{spin.result.name}</span>
                        </div>
                        <div className="flex gap-4">
                          <Button 
                            onClick={() => {
                              if (isProcessed) return;
                              const sellPrice = Math.floor(spin.result.price * 0.8);
                              setBalance(balance + sellPrice);
                              onSellItem(spin.result, sellPrice);
                              setProcessedItems(prev => new Set([...prev, itemKey]));
                              toast({
                                title: "Предмет продан!",
                                description: `Вы получили ${sellPrice}₽ за продажу ${spin.result.name}`,
                              });
                            }} 
                            disabled={isProcessed}
                            className={`${isProcessed ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-red-600 hover:bg-red-700'}`}
                          >
                            {isProcessed ? 'Продан' : `Продать (${Math.floor(spin.result.price * 0.8)}₽)`}
                          </Button>
                          <Button 
                            onClick={() => {
                              if (isProcessed) return;
                              addItem({
                                name: spin.result.name,
                                price: spin.result.price,
                                rarity: spin.result.rarity,
                                caseId: caseData?.id,
                                image: caseData?.image
                              });
                              onKeepItem(spin.result);
                              setProcessedItems(prev => new Set([...prev, itemKey]));
                              toast({
                                title: "Предмет добавлен в инвентарь!",
                                description: `${spin.result.name} добавлен в ваш профиль`,
                              });
                            }} 
                            disabled={isProcessed}
                            className={`${isProcessed ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-green-600 hover:bg-green-700'}`}
                          >
                            {isProcessed ? 'Добавлен' : 'В профиль'}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseOpeningModal;
