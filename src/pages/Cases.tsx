import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-center">
          Игровые Кейсы
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cases.map((caseData, idx) => (
            <div key={caseData.id} className="bg-gray-800/70 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: `${idx * 0.07}s` }}>
              <img src={caseData.image} alt={caseData.name} className="w-full h-40 object-cover rounded-xl mb-4" />
              <div className="text-xl font-bold mb-1 text-white drop-shadow-lg animate-fade-in">{caseData.name}</div>
              <div className="text-base text-gray-100 mb-4 animate-fade-in">{caseData.game}</div>
              <div className="text-2xl font-bold text-green-400 mb-4">{caseData.price}₽</div>
              <Button
                className="w-full bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-900 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
                onClick={() => navigate(`/case/${caseData.id}`)}
              >
                Открыть
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cases;
