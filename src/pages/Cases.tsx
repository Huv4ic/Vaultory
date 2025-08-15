import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package, Sparkles } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();
  const cases: GameCase[] = [
    {
      id: 'vaultory-premium',
      name: 'Vaultory Premium',
      game: t('Все игры'),
      price: 999,
      image: '/public/placeholder.svg',
      gradient: 'from-yellow-400 via-pink-500 to-purple-600',
      icon: '💎',
      items: [
        { name: t('Steam ключ AAA'), price: 2500, rarity: 'legendary', chance: 2 },
        { name: t('Скин CS:GO (редкий)'), price: 1200, rarity: 'epic', chance: 8 },
        { name: t('Подписка Spotify'), price: 500, rarity: 'rare', chance: 15 },
        { name: t('1000 Robux'), price: 800, rarity: 'rare', chance: 15 },
        { name: t('Случайная игра Steam'), price: 300, rarity: 'common', chance: 30 },
        { name: t('50 UC PUBG'), price: 150, rarity: 'common', chance: 30 }
      ]
    },
    {
      id: 'csgo-knife',
      name: t('CS:GO Ножи'),
      game: 'CS:GO',
      price: 1499,
      image: '/public/placeholder.svg',
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      icon: '🔪',
      items: [
        { name: t('Karambit | Doppler'), price: 15000, rarity: 'legendary', chance: 1 },
        { name: t('Butterfly Knife | Fade'), price: 9000, rarity: 'epic', chance: 4 },
        { name: t('M9 Bayonet | Marble Fade'), price: 7000, rarity: 'epic', chance: 5 },
        { name: t('Flip Knife | Tiger Tooth'), price: 3500, rarity: 'rare', chance: 10 },
        { name: t('Shadow Daggers | Slaughter'), price: 2000, rarity: 'rare', chance: 15 },
        { name: t('Наклейка CS:GO'), price: 300, rarity: 'common', chance: 65 }
      ]
    },
    {
      id: 'brawl-stars-mega',
      name: t('Brawl Stars Мега'),
      game: 'Brawl Stars',
      price: 499,
      image: '/public/placeholder.svg',
      gradient: 'from-cyan-400 via-blue-500 to-purple-500',
      icon: '⭐',
      items: [
        { name: t('Легендарный боец'), price: 5000, rarity: 'legendary', chance: 2 },
        { name: t('Гемы x1000'), price: 1500, rarity: 'epic', chance: 8 },
        { name: t('Гемы x500'), price: 750, rarity: 'rare', chance: 15 },
        { name: t('Гемы x100'), price: 150, rarity: 'common', chance: 75 }
      ]
    },
    {
      id: 'roblox-royale',
      name: t('Roblox Royale'),
      game: 'Roblox',
      price: 399,
      image: '/public/placeholder.svg',
      gradient: 'from-green-400 via-emerald-500 to-teal-500',
      icon: '🎲',
      items: [
        { name: t('Robux x5000'), price: 10000, rarity: 'legendary', chance: 1 },
        { name: t('Robux x1000'), price: 2000, rarity: 'epic', chance: 4 },
        { name: t('Robux x500'), price: 1000, rarity: 'rare', chance: 10 },
        { name: t('Robux x100'), price: 200, rarity: 'common', chance: 85 }
      ]
    },
    {
      id: 'pubg-elite',
      name: t('PUBG Elite'),
      game: 'PUBG Mobile',
      price: 599,
      image: '/public/placeholder.svg',
      gradient: 'from-orange-400 via-red-500 to-pink-500',
      icon: '🪖',
      items: [
        { name: t('Эксклюзивный скин'), price: 4000, rarity: 'legendary', chance: 2 },
        { name: t('UC x1000'), price: 1500, rarity: 'epic', chance: 8 },
        { name: t('UC x500'), price: 750, rarity: 'rare', chance: 15 },
        { name: t('UC x100'), price: 150, rarity: 'common', chance: 75 }
      ]
    }
  ];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in text-center">
          {t('Игровые Кейсы')}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {cases.map((caseData, idx) => (
            <div 
              key={caseData.id} 
              className="bg-gray-800/70 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center animate-fade-in hover:scale-105 hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-red-500/50" 
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className="relative w-full h-40 mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${caseData.gradient} rounded-xl opacity-20`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl drop-shadow-lg">{caseData.icon}</span>
                </div>
              </div>
              <div className="text-xl font-bold mb-1 text-white drop-shadow-lg animate-fade-in">{caseData.name}</div>
              <div className="text-base text-gray-100 mb-4 animate-fade-in flex items-center gap-1">
                <Package className="w-4 h-4" />
                {caseData.game}
              </div>
              <div className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {caseData.price}₴
              </div>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                onClick={() => navigate(`/case/${caseData.id}`)}
              >
                {t('Открыть')}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cases;
