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
      id: 'brawl-stars',
      name: 'Мега Бокс',
      game: 'Brawl Stars',
      price: 299,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      icon: '🎮',
      items: [
        { name: 'Гемы x100', price: 150, rarity: 'common', chance: 30 },
        { name: 'Гемы x500', price: 750, rarity: 'rare', chance: 20 },
        { name: 'Гемы x1000', price: 1500, rarity: 'epic', chance: 15 },
        { name: 'Легендарный Бойец', price: 5000, rarity: 'legendary', chance: 5 },
      ]
    },
    {
      id: 'csgo',
      name: 'Operation Case',
      game: 'CS:GO',
      price: 499,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      icon: '🔫',
      items: [
        { name: 'AK-47 Redline', price: 400, rarity: 'common', chance: 35 },
        { name: 'AWP Dragon Lore', price: 2500, rarity: 'rare', chance: 25 },
        { name: 'Knife Karambit', price: 8000, rarity: 'epic', chance: 10 },
        { name: 'StatTrak™ AK-47', price: 15000, rarity: 'legendary', chance: 3 },
      ]
    },
    {
      id: 'pubg',
      name: 'Военный Кейс',
      game: 'PUBG Mobile',
      price: 199,
      image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=400&h=300&fit=crop',
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      icon: '🪖',
      items: [
        { name: 'UC x100', price: 150, rarity: 'common', chance: 40 },
        { name: 'UC x500', price: 750, rarity: 'rare', chance: 25 },
        { name: 'UC x1000', price: 1500, rarity: 'epic', chance: 12 },
        { name: 'Эксклюзивный Скин', price: 4000, rarity: 'legendary', chance: 7 },
      ]
    },
    {
      id: 'roblox',
      name: 'Robux Сундук',
      game: 'Roblox',
      price: 399,
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
      icon: '🎲',
      items: [
        { name: 'Robux x100', price: 200, rarity: 'common', chance: 30 },
        { name: 'Robux x500', price: 1000, rarity: 'rare', chance: 20 },
        { name: 'Robux x1000', price: 2000, rarity: 'epic', chance: 15 },
        { name: 'Robux x5000', price: 10000, rarity: 'legendary', chance: 2 },
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
