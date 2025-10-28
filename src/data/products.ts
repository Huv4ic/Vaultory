
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
    price: 11, // 450 грн / 42 = 10.7, округляем до 11
    originalPrice: 15, // 600 грн / 42 = 14.3, округляем до 15
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
    price: 5, // 199 грн / 42 = 4.7, округляем до 5
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
    price: 31, // 1299 грн / 42 = 30.9, округляем до 31
    originalPrice: 36, // 1499 грн / 42 = 35.7, округляем до 36
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
    name: 'Steam Wallet 1000$',
    price: 23, // 950 грн / 42 = 22.6, округляем до 23
    originalPrice: 24, // 1000 грн / 42 = 23.8, округляем до 24
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
    price: 60, // 2500 грн / 42 = 59.5, округляем до 60
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
    price: 29, // 1199 грн / 42 = 28.5, округляем до 29
    originalPrice: 34, // 1399 грн / 42 = 33.3, округляем до 34
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
    price: 15, // 599 грн / 42 = 14.3, округляем до 15
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
    price: 19, // 799 грн / 42 = 19.0, округляем до 19
    originalPrice: 24, // 999 грн / 42 = 23.8, округляем до 24
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
    price: 39, // 1599 грн / 42 = 38.1, округляем до 39
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
    price: 55, // 2299 грн / 42 = 54.7, округляем до 55
    originalPrice: 62, // 2599 грн / 42 = 61.9, округляем до 62
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
    price: 22, // 899 грн / 42 = 21.4, округляем до 22
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
    price: 86, // 3599 грн / 42 = 85.7, округляем до 86
    originalPrice: 96, // 3999 грн / 42 = 95.2, округляем до 96
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
    price: 162, // 6799 грн / 42 = 161.9, округляем до 162
    originalPrice: 191, // 7999 грн / 42 = 190.5, округляем до 191
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
    price: 70, // 2899 грн / 42 = 69.0, округляем до 70
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
    price: 46, // 1899 грн / 42 = 45.2, округляем до 46
    originalPrice: 57, // 2388 грн / 42 = 56.9, округляем до 57
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'Подписка',
    game: 'Spotify',
    rating: 4.9,
    sales: 1234,
    description: 'Годовая подписка Spotify Premium',
    features: ['Без рекламы', 'Офлайн прослушивание', 'Высокое качество']
  }
];
