import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useInventory } from '@/hooks/useInventory';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import CaseOpeningModal from '@/components/CaseOpeningModal';

// Пример данных кейсов (лучше вынести в отдельный файл или получать из API)
const cases = [
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

const rarityColors = {
  legendary: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900',
  epic: 'bg-gradient-to-r from-purple-400 to-purple-700 text-purple-100',
  rare: 'bg-gradient-to-r from-blue-400 to-blue-700 text-blue-100',
  common: 'bg-gradient-to-r from-gray-500 to-gray-700 text-gray-100',
};

const CasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { balance, setBalance, telegramUser, refreshTelegramProfile } = useAuth();
  const { addItem } = useInventory();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [openingCount, setOpeningCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCase, setCurrentCase] = useState(null);

  // Автоматически обновляем профиль при загрузке страницы
  useEffect(() => {
    if (telegramUser) {
      refreshTelegramProfile();
    }
  }, [telegramUser, refreshTelegramProfile]);

  const caseData = cases.find(c => c.id === id);

  const openCase = () => {
    console.log('openCase called:', { caseData, telegramUser, balance, openingCount });
    
    if (!caseData) return;
    if (!telegramUser) {
      toast({
        title: t("Требуется авторизация"),
        description: t("Войдите через Telegram для открытия кейсов"),
      });
      return;
    }
    if (balance < caseData.price * openingCount) {
      toast({
        title: t("Недостаточно средств"),
        description: `${t("Для открытия")} ${openingCount} ${t("кейса(ов) нужно")} ${caseData.price * openingCount}₴, ${t("у вас")} ${balance}₴`,
      });
      return;
    }
    
    console.log('Opening case, setting modal to true');
    setBalance(balance - caseData.price * openingCount);
    setCurrentCase(caseData);
    setIsModalOpen(true);
  };

  const handleSellItem = (item, price) => {
    setBalance(balance + price);
    toast({
      title: t("Предмет продан!"),
      description: `${t("Вы получили")} ${price}₴ ${t("за продажу предмета")}`,
    });
  };

  const handleKeepItem = (item) => {
    addItem({
      ...item,
      caseId: caseData.id,
      status: 'new'
    });
    toast({
      title: t("Предмет добавлен в инвентарь!"),
      description: `${t("Предмет")} "${item.name}" ${t("добавлен в ваш инвентарь")}`,
    });
  };

  const handleAddToProfile = (item) => {
    addItem({
      ...item,
      caseId: caseData.id,
      status: 'withdrawn'
    });
    toast({
      title: t("Заявка на вывод отправлена!"),
      description: `${t("Предмет")} "${item.name}" ${t("будет обработан и выдан в ближайшее время")}`,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCase(null);
  };

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">{t('Кейс не найден')}</h1>
          <Button onClick={() => navigate(-1)}>{t('Назад')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center">
        <div className="bg-gray-800/80 rounded-2xl shadow-xl p-8 max-w-md w-full text-center mb-8 border border-gray-700">
          <img src={caseData.image} alt={caseData.name} className="rounded-xl w-32 h-32 object-cover mx-auto mb-4 border-4 border-gray-700" />
          <h2 className="text-3xl font-bold mb-2">{caseData.name}</h2>
          <div className="text-gray-400 mb-2">{caseData.game}</div>
          <div className="text-2xl font-bold text-green-400 mb-4">{caseData.price * openingCount}₴</div>
          <div className="mb-4 flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((count) => (
              <Button
                key={count}
                variant={openingCount === count ? "default" : "outline"}
                size="sm"
                onClick={() => setOpeningCount(count)}
                className={
                  (openingCount === count
                    ? "bg-gray-700 text-white border-gray-500"
                    : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800") +
                  " rounded-md px-4 py-2 text-base font-semibold transition-all duration-200"
                }
              >
                {count}
              </Button>
            ))}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
            onClick={openCase}
          >
            {t('Открыть')} {openingCount === 1 ? t('кейс') : `${openingCount} ${t('кейса')}`}
          </Button>
        </div>
        <div className="bg-gray-800/80 rounded-2xl shadow-xl p-8 max-w-2xl w-full text-center border border-gray-700">
          <h3 className="text-2xl font-bold mb-6 text-white">{t('Содержимое кейса')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {caseData.items.map((item, idx) => (
              <div key={idx} className={`rounded-xl p-4 flex flex-col items-center ${rarityColors[item.rarity]} shadow-md`}>
                <div className="font-bold text-lg mb-2">{item.name}</div>
                <div className="text-sm text-gray-200 mb-1">{t('Редкость:')} <span className="capitalize">{t(item.rarity)}</span></div>
                <div className="text-green-200 font-bold">{item.price}₴</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CaseOpeningModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        caseData={currentCase}
        openingCount={openingCount}
        onSellItem={handleSellItem}
        onKeepItem={handleKeepItem}
        onAddToProfile={handleAddToProfile}
      />
    </div>
  );
};

export default CasePage; 