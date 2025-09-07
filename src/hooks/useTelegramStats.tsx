import { useState, useEffect } from 'react';
import { TelegramStatsService, TelegramChannelStats } from '../services/telegramStatsService';

export const useTelegramStats = (channelUsername: string = 'vaultorysell') => {
  const [stats, setStats] = useState<TelegramChannelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем статистику
  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const channelStats = await TelegramStatsService.getChannelStats(channelUsername);
      setStats(channelStats);
    } catch (err) {
      console.error('Error fetching telegram stats:', err);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  // Обновляем статистику
  const updateStats = async (subscribersCount: number) => {
    try {
      const success = await TelegramStatsService.updateChannelStats(channelUsername, subscribersCount);
      if (success) {
        await fetchStats(); // Перезагружаем статистику
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating telegram stats:', err);
      return false;
    }
  };

  // Автоматическое обновление каждые 5 минут
  useEffect(() => {
    fetchStats();

    const interval = setInterval(() => {
      fetchStats();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, [channelUsername]);

  return {
    stats,
    loading,
    error,
    fetchStats,
    updateStats,
    subscribersCount: stats?.subscribers_count || 0,
    lastUpdated: stats?.last_updated
  };
};
