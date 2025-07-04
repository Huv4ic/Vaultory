import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

// Пример данных кейсов (лучше вынести в отдельный файл или получать из API)
const cases = [
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

const CasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openingCount, setOpeningCount] = useState(1);
  const [balance, setBalance] = useState(1250);

  const caseData = cases.find(c => c.id === id);

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Кейс не найден</h1>
          <Button onClick={() => navigate(-1)}>Назад</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-full md:w-1/3">
            <img src={caseData.image} alt={caseData.name} className="rounded-xl w-full object-cover mb-4" />
            <h2 className="text-3xl font-bold mb-2">{caseData.name}</h2>
            <p className="text-gray-400 mb-2">{caseData.game}</p>
            <div className="text-2xl font-bold text-white mb-4">{caseData.price}₽</div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-gray-300">Количество</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <Button
                    key={count}
                    variant={openingCount === count ? "default" : "outline"}
                    size="sm"
                    onClick={() => setOpeningCount(count)}
                    className={openingCount === count ? "bg-purple-500 hover:bg-purple-600" : "border-gray-600 text-gray-300"}
                  >
                    {count}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-lg font-semibold text-yellow-400 mb-4">
              Общая стоимость: {caseData.price * openingCount}₽
            </div>
            <Button 
              className={`w-full bg-gradient-to-r ${caseData.gradient} hover:opacity-90 text-white border-none transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={balance < caseData.price * openingCount}
            >
              Открыть {openingCount} {openingCount === 1 ? 'кейс' : 'кейса'}
            </Button>
          </div>
          <div className="w-full md:w-2/3">
            <h3 className="text-xl font-semibold mb-4">Возможные предметы:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {caseData.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/60 p-4 rounded-lg">
                  <span className="font-semibold capitalize text-white">{item.name}</span>
                  <span className="text-green-400 font-bold">{item.price}₽</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${item.rarity === 'common' ? 'bg-gray-600' : item.rarity === 'rare' ? 'bg-blue-600' : item.rarity === 'epic' ? 'bg-purple-600' : 'bg-yellow-600'} text-white`}>{item.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CasePage; 