import React from 'react';
import { useTelegramStats } from '../hooks/useTelegramStats';

interface TelegramStatsProps {
  channelUsername?: string;
  showLastUpdated?: boolean;
  className?: string;
}

export const TelegramStats: React.FC<TelegramStatsProps> = ({ 
  channelUsername = 'vaultorysell',
  showLastUpdated = false,
  className = ''
}) => {
  const { stats, loading, error, subscribersCount, lastUpdated } = useTelegramStats(channelUsername);

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-gray-400">Загрузка...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-400 text-sm ${className}`}>
        Ошибка загрузки статистики
      </div>
    );
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatLastUpdated = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'только что';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} мин назад`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ч назад`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} дн назад`;
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="text-2xl font-bold text-cyan-400">
        {formatNumber(subscribersCount)}
      </div>
      <div className="text-sm text-gray-300">
        ПОДПИСЧИКОВ
      </div>
      {showLastUpdated && lastUpdated && (
        <div className="text-xs text-gray-500 mt-1">
          Обновлено {formatLastUpdated(lastUpdated)}
        </div>
      )}
    </div>
  );
};

export default TelegramStats;
