import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';

interface CaseStats {
  case_id: number;
  case_name: string;
  opened_count: number;
  case_image_url?: string;
}

interface FavoriteCase {
  case_id: number;
  case_name: string;
  opened_count: number;
  case_image_url?: string;
}

interface CaseStatsContextType {
  caseStats: CaseStats[];
  favoriteCase: FavoriteCase | null;
  loading: boolean;
  error: string | null;
  incrementCaseOpened: (caseId: number, caseName: string, caseImageUrl?: string) => Promise<void>;
  getFavoriteCase: () => Promise<FavoriteCase | null>;
  refreshStats: () => Promise<void>;
}

const CaseStatsContext = createContext<CaseStatsContextType | undefined>(undefined);

export const CaseStatsProvider = ({ children }: { children: React.ReactNode }) => {
  const { telegramUser } = useAuth();
  const [caseStats, setCaseStats] = useState<CaseStats[]>([]);
  const [favoriteCase, setFavoriteCase] = useState<FavoriteCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Временная загрузка статистики пользователя (пока таблица не создана)
  const loadUserCaseStats = async () => {
    if (!telegramUser) return;

    try {
      setLoading(true);
      setError(null);

      // Временно используем localStorage для демонстрации
      const savedStats = localStorage.getItem(`vaultory_case_stats_${telegramUser.id}`);
      const stats: CaseStats[] = savedStats ? JSON.parse(savedStats) : [];

      setCaseStats(stats);

      // Определяем любимый кейс
      if (stats.length > 0) {
        const favorite = stats.sort((a, b) => b.opened_count - a.opened_count)[0];
        setFavoriteCase({
          case_id: favorite.case_id,
          case_name: favorite.case_name,
          opened_count: favorite.opened_count,
          case_image_url: favorite.case_image_url
        });
      }

    } catch (err) {
      console.error('Ошибка загрузки статистики кейсов:', err);
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  // Увеличение счетчика открытий кейса (временная реализация)
  const incrementCaseOpened = async (caseId: number, caseName: string, caseImageUrl?: string) => {
    if (!telegramUser) return;

    try {
      console.log(`Увеличиваем счетчик для кейса ${caseId} (${caseName})`);
      
      // Временно используем localStorage
      const savedStats = localStorage.getItem(`vaultory_case_stats_${telegramUser.id}`);
      const stats: CaseStats[] = savedStats ? JSON.parse(savedStats) : [];

      // Ищем существующую запись
      const existingIndex = stats.findIndex(stat => stat.case_id === caseId);

      if (existingIndex >= 0) {
        // Обновляем существующую запись
        stats[existingIndex].opened_count += 1;
        console.log(`Обновлен существующий кейс: ${caseName}, новый счетчик: ${stats[existingIndex].opened_count}`);
      } else {
        // Создаем новую запись
        stats.push({
          case_id: caseId,
          case_name: caseName,
          opened_count: 1,
          case_image_url: caseImageUrl
        });
        console.log(`Создан новый кейс: ${caseName}, счетчик: 1`);
      }

      // Сохраняем в localStorage
      localStorage.setItem(`vaultory_case_stats_${telegramUser.id}`, JSON.stringify(stats));
      console.log('Данные сохранены в localStorage:', stats);

      // Принудительно обновляем локальное состояние
      setCaseStats([...stats]);

      // Определяем любимый кейс
      if (stats.length > 0) {
        const favorite = stats.sort((a, b) => b.opened_count - a.opened_count)[0];
        const newFavoriteCase = {
          case_id: favorite.case_id,
          case_name: favorite.case_name,
          opened_count: favorite.opened_count,
          case_image_url: favorite.case_image_url
        };
        setFavoriteCase(newFavoriteCase);
        console.log('Новый любимый кейс:', newFavoriteCase);
      }

      console.log('Статистика открытий кейса обновлена (временно в localStorage)');

    } catch (err) {
      console.error('Ошибка обновления статистики кейса:', err);
      setError('Ошибка обновления статистики');
    }
  };

  // Получение любимого кейса (временная реализация)
  const getFavoriteCase = async (): Promise<FavoriteCase | null> => {
    if (!telegramUser) return null;

    try {
      // Временно используем localStorage
      const savedStats = localStorage.getItem(`vaultory_case_stats_${telegramUser.id}`);
      const stats: CaseStats[] = savedStats ? JSON.parse(savedStats) : [];

      if (stats.length > 0) {
        const favorite = stats.sort((a, b) => b.opened_count - a.opened_count)[0];
        return {
          case_id: favorite.case_id,
          case_name: favorite.case_name,
          opened_count: favorite.opened_count,
          case_image_url: favorite.case_image_url
        };
      }

      return null;
    } catch (err) {
      console.error('Ошибка получения любимого кейса:', err);
      return null;
    }
  };

  // Обновление статистики
  const refreshStats = async () => {
    await loadUserCaseStats();
  };

  // Загружаем статистику при изменении пользователя
  useEffect(() => {
    if (telegramUser) {
      loadUserCaseStats();
    } else {
      setCaseStats([]);
      setFavoriteCase(null);
    }
  }, [telegramUser]);

  return (
    <CaseStatsContext.Provider value={{
      caseStats,
      favoriteCase,
      loading,
      error,
      incrementCaseOpened,
      getFavoriteCase,
      refreshStats
    }}>
      {children}
    </CaseStatsContext.Provider>
  );
};

export const useCaseStats = () => {
  const context = useContext(CaseStatsContext);
  if (!context) {
    throw new Error('useCaseStats must be used within CaseStatsProvider');
  }
  return context;
};
