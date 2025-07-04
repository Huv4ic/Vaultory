
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  game: string;
  rating: number;
  sales: number;
  description: string;
  features: string[];
}

export const gameCategories = [
  { id: 'brawl-stars', name: 'Brawl Stars', icon: '🌟' },
  { id: 'steam', name: 'Steam', icon: '🎮' },
  { id: 'pubg-mobile', name: 'PUBG Mobile', icon: '🔫' },
  { id: 'standoff-2', name: 'Standoff 2', icon: '💥' },
  { id: 'wot-blitz', name: 'WoT Blitz', icon: '🚗' },
  { id: 'war-thunder', name: 'War Thunder', icon: '✈️' },
  { id: 'telegram-stars', name: 'Звёзды Telegram', icon: '⭐' },
  { id: 'gta-v', name: 'GTA V', icon: '🏎️' },
  { id: 'epic-games', name: 'Epic Games', icon: '🎯' },
  { id: 'roblox', name: 'Roblox', icon: '🎲' },
  { id: 'spotify', name: 'Spotify', icon: '🎵' },
];

export const products: Product[] = [
  // Brawl Stars
  {
    id: '1',
    name: 'Мега бокс x10',
    price: 450,
    originalPrice: 600,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    category: 'Боксы',
    game: 'Brawl Stars',
    rating: 4.8,
    sales: 1247,
    description: 'Набор из 10 мега боксов для быстрого прокачивания бойцов',
    features: ['Гарантированный легендарный боец', 'Мгновенная доставка', 'Официальная покупка']
  },
  {
    id: '2',
    name: 'Пропуск на сезон',
    price: 199,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'Пропуски',
    game: 'Brawl Stars',
    rating: 4.9,
    sales: 2341,
    description: 'Боевой пропуск текущего сезона со всеми наградами',
    features: ['Эксклюзивные скины', '90+ наград', 'Дополнительные квесты']
  },
  {
    id: '3',
    name: 'Гемы 2000 шт',
    price: 1299,
    originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'Brawl Stars',
    rating: 4.7,
    sales: 856,
    description: 'Премиум валюта для покупок в игре',
    features: ['Лучшая цена', 'Мгновенное зачисление', 'Без комиссии']
  },

  // Steam
  {
    id: '4',
    name: 'Steam Wallet 1000₽',
    price: 950,
    originalPrice: 1000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'Пополнение',
    game: 'Steam',
    rating: 4.9,
    sales: 3421,
    description: 'Пополнение кошелька Steam на 1000 рублей',
    features: ['Мгновенное зачисление', 'Без региональных ограничений', 'Официальный код']
  },
  {
    id: '5',
    name: 'Counter-Strike 2 Скины',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
    category: 'Скины',
    game: 'Steam',
    rating: 4.6,
    sales: 567,
    description: 'Набор популярных скинов для CS2',
    features: ['Редкие предметы', 'Trade-lock снят', 'Проверенные продавцы']
  },

  // PUBG Mobile
  {
    id: '6',
    name: 'UC 1800 + 300 бонус',
    price: 1199,
    originalPrice: 1399,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'PUBG Mobile',
    rating: 4.8,
    sales: 1876,
    description: 'Unknown Cash для покупок в PUBG Mobile с бонусом',
    features: ['Дополнительные UC в подарок', 'Для всех серверов', 'Быстрое зачисление']
  },
  {
    id: '7',
    name: 'Королевский пропуск',
    price: 599,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'Пропуски',
    game: 'PUBG Mobile',
    rating: 4.7,
    sales: 2145,
    description: 'Элитный королевский пропуск с эксклюзивными наградами',
    features: ['100 уровней наград', 'Эксклюзивные скины', 'Премиум задания']
  },

  // Standoff 2
  {
    id: '8',
    name: 'Золото 10000',
    price: 799,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'Standoff 2',
    rating: 4.5,
    sales: 432,
    description: 'Внутриигровая валюта для покупок в Standoff 2',
    features: ['Быстрое зачисление', 'Без блокировок', 'Лучший курс']
  },

  // WoT Blitz
  {
    id: '9',
    name: 'Золото 6500 + Премиум',
    price: 1599,
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'WoT Blitz',
    rating: 4.8,
    sales: 789,
    description: 'Золото + премиум аккаунт на месяц',
    features: ['Премиум аккаунт 30 дней', 'Увеличенный доход', 'Эксклюзивные танки']
  },

  // War Thunder
  {
    id: '10',
    name: 'Золотые орлы 5000',
    price: 2299,
    originalPrice: 2599,
    image: 'https://images.unsplash.com/photo-1544306094-e2dcbcb4e5fc?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'War Thunder',
    rating: 4.6,
    sales: 345,
    description: 'Премиум валюта War Thunder для покупок техники',
    features: ['Все нации', 'Премиум техника', 'Ускоренное исследование']
  },

  // Telegram Stars
  {
    id: '11',
    name: 'Звёзды Telegram 1000',
    price: 899,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'Telegram',
    rating: 4.9,
    sales: 1567,
    description: 'Звёзды для покупок в Telegram боте и каналах',
    features: ['Мгновенное зачисление', 'Работает везде', 'Без ограничений']
  },

  // GTA V
  {
    id: '12',
    name: 'Shark Card 8,000,000$',
    price: 3599,
    originalPrice: 3999,
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'GTA V',
    rating: 4.7,
    sales: 456,
    description: 'Карта акулы на 8 миллионов долларов GTA',
    features: ['Максимальная сумма', 'Для GTA Online', 'Быстрая активация']
  },

  // Epic Games
  {
    id: '13',
    name: 'V-Bucks 13,500',
    price: 6799,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'Fortnite',
    rating: 4.8,
    sales: 2890,
    description: 'V-Bucks для покупок в Fortnite',
    features: ['Эксклюзивные скины', 'Боевые пропуска', 'Эмоции и танцы']
  },

  // Roblox
  {
    id: '14',
    name: 'Robux 4,500',
    price: 2899,
    image: 'https://images.unsplash.com/photo-1567593810070-7a3d471af022?w=400&h=300&fit=crop',
    category: 'Валюта',
    game: 'Roblox',
    rating: 4.9,
    sales: 3456,
    description: 'Robux для покупок аватара и игровых предметов',
    features: ['Все игры Roblox', 'Кастомизация аватара', 'Премиум доступ']
  },

  // Spotify
  {
    id: '15',
    name: 'Spotify Premium 12 мес',
    price: 1899,
    originalPrice: 2388,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'Подписка',
    game: 'Spotify',
    rating: 4.9,
    sales: 1234,
    description: 'Годовая подписка Spotify Premium',
    features: ['Без рекламы', 'Офлайн прослушивание', 'Высокое качество']
  }
];
