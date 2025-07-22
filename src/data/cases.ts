export interface CaseItem {
  name: string;
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  chance: number;
}

export interface GameCase {
  id: string;
  name: string;
  game: string;
  price: number;
  image: string;
  items: CaseItem[];
  gradient: string;
  icon: string;
}

export const cases: GameCase[] = [
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