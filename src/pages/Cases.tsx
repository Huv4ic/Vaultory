import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CaseOpeningModal from '@/components/CaseOpeningModal';
import CaseGrid from '@/components/CaseGrid';
import BalanceDisplay from '@/components/BalanceDisplay';
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

const Cases = () => {
  const { user, profile, balance, setBalance, refreshProfile } = useAuth();
  const [selectedCase, setSelectedCase] = useState<GameCase | null>(null);
  const [openingCount, setOpeningCount] = useState(1);
  const [totalSiteRevenue, setTotalSiteRevenue] = useState(50000);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cases: GameCase[] = [
    {
      id: 'vaultory-premium',
      name: 'Vaultory Premium',
      game: 'Все игры',
      price: 999,
      image: '/public/placeholder.svg',
      gradient: 'from-yellow-400 via-pink-500 to-purple-600',
      icon: '💎',
      items: [
        { name: 'Steam ключ AAA', price: 2500, rarity: 'legendary', chance: 2 },
        { name: 'Скин CS:GO (редкий)', price: 1200, rarity: 'epic', chance: 8 },
        { name: 'Подписка Spotify', price: 500, rarity: 'rare', chance: 15 },
        { name: '1000 Robux', price: 800, rarity: 'rare', chance: 15 },
        { name: 'Случайная игра Steam', price: 300, rarity: 'common', chance: 30 },
        { name: '50 UC PUBG', price: 150, rarity: 'common', chance: 30 }
      ]
    },
    {
      id: 'csgo-knife',
      name: 'CS:GO Ножи',
      game: 'CS:GO',
      price: 1499,
      image: '/public/placeholder.svg',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      icon: '🔪',
      items: [
        { name: 'Karambit | Doppler', price: 15000, rarity: 'legendary', chance: 1 },
        { name: 'Butterfly Knife | Fade', price: 9000, rarity: 'epic', chance: 4 },
        { name: 'M9 Bayonet | Marble Fade', price: 7000, rarity: 'epic', chance: 5 },
        { name: 'Flip Knife | Tiger Tooth', price: 3500, rarity: 'rare', chance: 10 },
        { name: 'Shadow Daggers | Slaughter', price: 2000, rarity: 'rare', chance: 15 },
        { name: 'Наклейка CS:GO', price: 300, rarity: 'common', chance: 65 }
      ]
    },
    {
      id: 'brawl-stars-mega',
      name: 'Brawl Stars Мега',
      game: 'Brawl Stars',
      price: 499,
      image: '/public/placeholder.svg',
      gradient: 'from-cyan-400 via-blue-500 to-purple-500',
      icon: '⭐',
      items: [
        { name: 'Легендарный боец', price: 5000, rarity: 'legendary', chance: 2 },
        { name: 'Гемы x1000', price: 1500, rarity: 'epic', chance: 8 },
        { name: 'Гемы x500', price: 750, rarity: 'rare', chance: 15 },
        { name: 'Гемы x100', price: 150, rarity: 'common', chance: 75 }
      ]
    },
    {
      id: 'roblox-royale',
      name: 'Roblox Royale',
      game: 'Roblox',
      price: 399,
      image: '/public/placeholder.svg',
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      icon: '🎲',
      items: [
        { name: 'Robux x5000', price: 10000, rarity: 'legendary', chance: 1 },
        { name: 'Robux x1000', price: 2000, rarity: 'epic', chance: 4 },
        { name: 'Robux x500', price: 1000, rarity: 'rare', chance: 10 },
        { name: 'Robux x100', price: 200, rarity: 'common', chance: 85 }
      ]
    },
    {
      id: 'pubg-elite',
      name: 'PUBG Elite',
      game: 'PUBG Mobile',
      price: 599,
      image: '/public/placeholder.svg',
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      icon: '🪖',
      items: [
        { name: 'Эксклюзивный скин', price: 4000, rarity: 'legendary', chance: 2 },
        { name: 'UC x1000', price: 1500, rarity: 'epic', chance: 8 },
        { name: 'UC x500', price: 750, rarity: 'rare', chance: 15 },
        { name: 'UC x100', price: 150, rarity: 'common', chance: 75 }
      ]
    }
  ];

  const openCase = async (caseData: GameCase) => {
    if (!user) {
      alert('Необходимо войти в систему!');
      return;
    }

    if (balance < caseData.price * openingCount) {
      alert('Недостаточно средств!');
      return;
    }
    
    try {
      // Обновляем баланс в базе данных
      const newBalance = balance - (caseData.price * openingCount);
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (balanceError) throw balanceError;

      // Обновляем счетчик открытых кейсов
      const currentCasesOpened = profile?.cases_opened || 0;
      const { error: casesError } = await supabase
        .from('profiles')
        .update({ cases_opened: currentCasesOpened + openingCount })
        .eq('id', user.id);

      if (casesError) throw casesError;

      // Обновляем локальное состояние
      setBalance(newBalance);
      await refreshProfile();
      
      setSelectedCase(caseData);
      setIsModalOpen(true);
      setTotalSiteRevenue(totalSiteRevenue + (caseData.price * openingCount));
    } catch (error) {
      console.error('Ошибка при открытии кейса:', error);
      alert('Произошла ошибка при открытии кейса');
    }
  };

  const handleSellItem = (item: CaseItem, sellPrice: number) => {
    setBalance(prev => prev + sellPrice);
  };

  const handleKeepItem = (item: CaseItem) => {
    console.log('Предмет сохранен в профиль:', item);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCase(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Игровые Кейсы
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-slide-up">
            Открывай кейсы и получай редкие предметы для своих любимых игр!
          </p>
          <div className="mt-4 flex items-center justify-center space-x-4">
            <BalanceDisplay balance={balance} />
          </div>
        </div>

        <CaseGrid
          cases={cases}
          openingCount={openingCount}
          balance={balance}
          onOpeningCountChange={setOpeningCount}
          onOpenCase={openCase}
        />
      </div>

      <CaseOpeningModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        caseData={selectedCase}
        openingCount={openingCount}
        onSellItem={handleSellItem}
        onKeepItem={handleKeepItem}
      />
      
      <Footer />
    </div>
  );
};

export default Cases;
