import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useInventory } from './useInventory';
import { Shield, Gift, TrendingUp, Star, Crown, Trophy } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  requirement: number;
  current: number;
  completed: boolean;
  type: 'first_purchase' | 'cases_opened' | 'money_spent' | 'items_collected' | 'rare_items';
}

export const useAchievements = () => {
  const { profile } = useAuth();
  const { items, getCasesOpened } = useInventory();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Определяем список достижений
  const achievementDefinitions: Omit<Achievement, 'current' | 'completed'>[] = [
    {
      id: 'first_purchase',
      title: 'Первая покупка',
      description: 'Совершите свою первую покупку',
      icon: <Shield className="w-4 h-4 text-amber-400" />,
      requirement: 1,
      type: 'first_purchase'
    },
    {
      id: 'open_10_cases',
      title: 'Открыть 10 кейсов',
      description: 'Откройте 10 кейсов',
      icon: <Gift className="w-4 h-4 text-amber-400" />,
      requirement: 10,
      type: 'cases_opened'
    },
    {
      id: 'open_50_cases',
      title: 'Открыть 50 кейсов',
      description: 'Откройте 50 кейсов',
      icon: <Gift className="w-4 h-4 text-purple-400" />,
      requirement: 50,
      type: 'cases_opened'
    },
    {
      id: 'spend_1000',
      title: 'Потратить 1000₴',
      description: 'Потратьте 1000₴ на покупки',
      icon: <TrendingUp className="w-4 h-4 text-amber-400" />,
      requirement: 1000,
      type: 'money_spent'
    },
    {
      id: 'spend_10000',
      title: 'Потратить 10000₴',
      description: 'Потратьте 10000₴ на покупки',
      icon: <TrendingUp className="w-4 h-4 text-green-400" />,
      requirement: 10000,
      type: 'money_spent'
    },
    {
      id: 'collect_100_items',
      title: 'Собрать 100 предметов',
      description: 'Соберите 100 предметов в инвентарь',
      icon: <Star className="w-4 h-4 text-blue-400" />,
      requirement: 100,
      type: 'items_collected'
    },
    {
      id: 'get_legendary',
      title: 'Получить легендарный предмет',
      description: 'Получите свой первый легендарный предмет',
      icon: <Crown className="w-4 h-4 text-yellow-400" />,
      requirement: 1,
      type: 'rare_items'
    }
  ];

  // Функция для вычисления прогресса достижения
  const calculateProgress = async (achievement: Omit<Achievement, 'current' | 'completed'>) => {
    let current = 0;

    switch (achievement.type) {
      case 'first_purchase':
        // Проверяем, есть ли у пользователя покупки (total_spent > 0)
        current = (profile?.total_spent || 0) > 0 ? 1 : 0;
        break;

      case 'cases_opened':
        // Получаем количество открытых кейсов
        try {
          current = await getCasesOpened();
        } catch (error) {
          console.error('Error getting cases opened:', error);
          current = profile?.cases_opened || 0;
        }
        break;

      case 'money_spent':
        // Используем total_spent из профиля
        current = profile?.total_spent || 0;
        break;

      case 'items_collected':
        // Считаем общее количество предметов в инвентаре
        current = items.length;
        break;

      case 'rare_items':
        // Считаем количество легендарных предметов
        current = items.filter(item => item.rarity === 'legendary').length;
        break;

      default:
        current = 0;
    }

    return {
      ...achievement,
      current,
      completed: current >= achievement.requirement
    };
  };

  // Загружаем и обновляем достижения
  const loadAchievements = async () => {
    if (!profile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const updatedAchievements = await Promise.all(
        achievementDefinitions.map(achievement => calculateProgress(achievement))
      );
      setAchievements(updatedAchievements);
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  // Загружаем достижения при изменении профиля или предметов
  useEffect(() => {
    loadAchievements();
  }, [profile, items]);

  // Функция для получения статуса достижения
  const getAchievementStatus = (achievement: Achievement) => {
    if (achievement.completed) {
      return {
        label: 'Получено',
        className: 'bg-green-500/20 text-green-400 border-green-500/30'
      };
    }

    if (achievement.current > 0) {
      return {
        label: 'В процессе',
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      };
    }

    return {
      label: 'Заблокировано',
      className: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
  };

  // Функция для получения прогресса в процентах
  const getProgress = (achievement: Achievement) => {
    return Math.min((achievement.current / achievement.requirement) * 100, 100);
  };

  // Функция для форматирования прогресса
  const formatProgress = (achievement: Achievement) => {
    if (achievement.type === 'money_spent') {
      return `${achievement.current.toFixed(0)}₴ / ${achievement.requirement}₴`;
    }
    return `${achievement.current} / ${achievement.requirement}`;
  };

  return {
    achievements,
    loading,
    getAchievementStatus,
    getProgress,
    formatProgress,
    refreshAchievements: loadAchievements
  };
};
