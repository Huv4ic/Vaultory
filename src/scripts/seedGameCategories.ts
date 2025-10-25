import { supabase } from '../integrations/supabase/client';

// Все существующие категории из Index.tsx
const gameCategories = [
  {
    id: 'tiktok',
    name: 'TikTok',
    color: 'from-pink-500 to-purple-600',
    icon: '📱'
  },
  {
    id: 'standoff2',
    name: 'Standoff 2',
    color: 'from-blue-500 to-cyan-600',
    icon: '🔫'
  },
  {
    id: 'mobile_legends',
    name: 'Mobile Legends',
    color: 'from-orange-500 to-red-600',
    icon: '⚔️'
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    color: 'from-green-500 to-teal-600',
    icon: '🎯'
  },
  {
    id: 'free_fire',
    name: 'Free Fire',
    color: 'from-red-500 to-pink-600',
    icon: '🔥'
  },
  {
    id: 'steam',
    name: 'Steam',
    color: 'from-gray-500 to-blue-600',
    icon: '🎮'
  },
  {
    id: 'roblox',
    name: 'Roblox',
    color: 'from-purple-500 to-indigo-600',
    icon: '🧱'
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    color: 'from-yellow-500 to-orange-600',
    icon: '⭐'
  },
  {
    id: 'honkai',
    name: 'Honkai Star Rail',
    color: 'from-pink-500 to-purple-600',
    icon: '🚀'
  },
  {
    id: 'zenless',
    name: 'Zenless Zone Zero',
    color: 'from-cyan-500 to-blue-600',
    icon: '⚡'
  },
  {
    id: 'identity_v',
    name: 'Identity V',
    color: 'from-gray-600 to-purple-600',
    icon: '🎭'
  },
  {
    id: 'arena_breakout',
    name: 'Arena Breakout',
    color: 'from-green-600 to-blue-600',
    icon: '🛡️'
  },
  {
    id: 'epic_games',
    name: 'Epic Games',
    color: 'from-indigo-500 to-purple-600',
    icon: '🎯'
  },
  {
    id: 'brawl_stars',
    name: 'Brawl Stars',
    color: 'from-yellow-500 to-orange-600',
    icon: '⭐'
  },
  {
    id: 'gta',
    name: 'GTA',
    color: 'from-green-500 to-blue-600',
    icon: '🚗'
  },
  {
    id: 'rocket_league',
    name: 'Rocket League',
    color: 'from-blue-500 to-cyan-600',
    icon: '🚀'
  },
  {
    id: 'spotify',
    name: 'Spotify',
    color: 'from-green-500 to-emerald-600',
    icon: '🎵'
  },
  {
    id: 'world_of_tanks',
    name: 'World of Tanks Blitz',
    color: 'from-gray-600 to-yellow-600',
    icon: '🚗'
  },
  {
    id: 'telegram_stars',
    name: 'Звезды Telegram',
    color: 'from-blue-500 to-cyan-600',
    icon: '⭐'
  }
];

export const seedGameCategories = async () => {
  try {
    console.log('Начинаем добавление категорий игр...');
    
    // Проверяем, есть ли уже категории
    const { data: existingCategories, error: checkError } = await supabase
      .from('game_categories')
      .select('id');
    
    if (checkError) {
      console.error('Ошибка при проверке существующих категорий:', checkError);
      return;
    }
    
    if (existingCategories && existingCategories.length > 0) {
      console.log('Категории уже существуют. Пропускаем добавление.');
      return;
    }
    
    // Добавляем все категории
    const { data, error } = await supabase
      .from('game_categories')
      .insert(
        gameCategories.map(category => ({
          ...category,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      )
      .select();
    
    if (error) {
      console.error('Ошибка при добавлении категорий:', error);
      return;
    }
    
    console.log(`Успешно добавлено ${data?.length || 0} категорий игр!`);
    console.log('Добавленные категории:', data);
    
  } catch (err) {
    console.error('Ошибка при выполнении скрипта:', err);
  }
};

// Функция для запуска скрипта (можно вызвать из консоли браузера)
if (typeof window !== 'undefined') {
  (window as any).seedGameCategories = seedGameCategories;
}
