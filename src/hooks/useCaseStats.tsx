import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from './useAuth';

// Интерфейсы для типизации
interface CaseStats {
  case_id: string; // Изменено с number на string
  case_name: string;
  opened_count: number;
  case_image_url?: string;
}

interface FavoriteCase {
  case_id: string; // Изменено с number на string
  case_name: string;
  opened_count: number;
  case_image_url?: string;
}

interface CaseStatsContextType {
  caseStats: CaseStats[];
  favoriteCase: FavoriteCase | null;
  loading: boolean;
  error: string | null;
  loadUserCaseStats: () => Promise<void>;
  incrementCaseOpened: (caseId: string, caseName: string, caseImageUrl?: string) => Promise<void>; // Изменено с number на string
  getFavoriteCase: () => Promise<void>;
  refreshStats: () => void;
}

const CaseStatsContext = createContext<CaseStatsContextType | undefined>(undefined);

export const useCaseStats = () => {
  const context = useContext(CaseStatsContext);
  if (context === undefined) {
    throw new Error('useCaseStats must be used within a CaseStatsProvider');
  }
  return context;
};

interface CaseStatsProviderProps {
  children: ReactNode;
}

export const CaseStatsProvider: React.FC<CaseStatsProviderProps> = ({ children }) => {
  const { telegramUser } = useAuth();
  const [caseStats, setCaseStats] = useState<CaseStats[]>([]);
  const [favoriteCase, setFavoriteCase] = useState<FavoriteCase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка статистики пользователя
  const loadUserCaseStats = async () => {
    if (!telegramUser) return;

    setLoading(true);
    setError(null);

    try {
      console.log('Загружаем статистику для пользователя:', telegramUser.id);
      
      // Простой запрос без сложных JOIN
      const { data: stats, error: fetchError } = await (supabase as any)
        .from('user_case_stats')
        .select('*')
        .eq('user_id', telegramUser.id);

      if (fetchError) {
        console.error('Ошибка загрузки статистики:', fetchError);
        throw fetchError;
      }

      if (stats && stats.length > 0) {
        // Получаем данные кейсов отдельно
        const caseIds = stats.map((stat: any) => stat.case_id);
        const { data: casesData, error: casesError } = await (supabase as any)
          .from('cases')
          .select('id, name, image')
          .in('id', caseIds);

        if (casesError) {
          console.error('Ошибка загрузки данных кейсов:', casesError);
          throw casesError;
        }

        // Создаем мапу кейсов для быстрого поиска
        const casesMap = new Map();
        casesData?.forEach((caseItem: any) => {
          casesMap.set(caseItem.id, caseItem);
        });

        const formattedStats: CaseStats[] = stats.map((stat: any) => {
          const caseData = casesMap.get(stat.case_id);
          return {
            case_id: stat.case_id,
            case_name: caseData?.name || 'Неизвестный кейс',
            opened_count: stat.opened_count,
            case_image_url: caseData?.image
          };
        });

        console.log('Загруженная статистика:', formattedStats);
        setCaseStats([...formattedStats]);
      } else {
        console.log('Статистика не найдена, устанавливаем пустой массив');
        setCaseStats([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  // Увеличение счетчика открытий кейса через прямые SQL запросы
  const incrementCaseOpened = async (caseId: string, caseName: string, caseImageUrl?: string) => { // Изменено с number на string
    if (!telegramUser) return;

    // Проверяем валидность caseId
    if (!caseId || caseId.trim() === '') {
      console.error('Некорректный caseId:', caseId);
      setError('Некорректный ID кейса');
      return;
    }

    try {
      console.log(`Увеличиваем счетчик для кейса ${caseId} (${caseName}) пользователя ${telegramUser.id}`);
      
      // Используем any для обхода проблем с типами
      const { data: existingRecord, error: checkError } = await (supabase as any)
        .from('user_case_stats')
        .select('*')
        .eq('user_id', telegramUser.id)
        .eq('case_id', caseId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Ошибка проверки существующей записи:', checkError);
        throw checkError;
      }

      if (existingRecord) {
        // Обновляем существующую запись
        const { error: updateError } = await (supabase as any)
          .from('user_case_stats')
          .update({ 
            opened_count: existingRecord.opened_count + 1,
            last_opened_at: new Date().toISOString()
          })
          .eq('user_id', telegramUser.id)
          .eq('case_id', caseId);

        if (updateError) {
          console.error('Ошибка обновления записи:', updateError);
          throw updateError;
        }

        console.log(`Обновлен счетчик кейса ${caseName}: ${existingRecord.opened_count + 1}`);
      } else {
        // Создаем новую запись
        const { error: insertError } = await (supabase as any)
          .from('user_case_stats')
          .insert({
            user_id: telegramUser.id,
            case_id: caseId,
            opened_count: 1,
            last_opened_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Ошибка создания записи:', insertError);
          throw insertError;
        }

        console.log(`Создана новая запись для кейса ${caseName}`);
      }

      console.log('Счетчик кейса успешно обновлен на сервере');

      // Перезагружаем статистику для обновления UI
      await loadUserCaseStats();

    } catch (err) {
      console.error('Ошибка обновления статистики кейса:', err);
      setError('Ошибка обновления статистики');
    }
  };

  // Получение любимого кейса
  const getFavoriteCase = async () => {
    if (!telegramUser) return;

    try {
      console.log('Получаем любимый кейс для пользователя:', telegramUser.id);
      
      // Простой запрос без сложных JOIN
      const { data: stats, error: fetchError } = await (supabase as any)
        .from('user_case_stats')
        .select('*')
        .eq('user_id', telegramUser.id)
        .order('opened_count', { ascending: false })
        .order('last_opened_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Ошибка получения любимого кейса:', fetchError);
        throw fetchError;
      }

      if (stats && stats.length > 0) {
        const favoriteStat = stats[0];
        
        // Получаем данные кейса отдельно
        const { data: caseData, error: caseError } = await (supabase as any)
          .from('cases')
          .select('id, name, image')
          .eq('id', favoriteStat.case_id)
          .single();

        if (caseError) {
          console.error('Ошибка загрузки данных кейса:', caseError);
          throw caseError;
        }

        const formattedFavorite: FavoriteCase = {
          case_id: favoriteStat.case_id,
          case_name: caseData?.name || 'Неизвестный кейс',
          opened_count: favoriteStat.opened_count,
          case_image_url: caseData?.image
        };

        console.log('Найден любимый кейс:', formattedFavorite);
        setFavoriteCase(formattedFavorite);
      } else {
        console.log('Любимый кейс не найден');
        setFavoriteCase(null);
      }
    } catch (err) {
      console.error('Ошибка получения любимого кейса:', err);
      setError('Ошибка получения любимого кейса');
    }
  };

  // Обновление статистики
  const refreshStats = () => {
    loadUserCaseStats();
    getFavoriteCase();
  };

  // Загружаем статистику при изменении пользователя
  useEffect(() => {
    if (telegramUser) {
      loadUserCaseStats();
      getFavoriteCase();
    } else {
      setCaseStats([]);
      setFavoriteCase(null);
    }
  }, [telegramUser]);

  const value: CaseStatsContextType = {
    caseStats,
    favoriteCase,
    loading,
    error,
    loadUserCaseStats,
    incrementCaseOpened,
    getFavoriteCase,
    refreshStats
  };

  return (
    <CaseStatsContext.Provider value={value}>
      {children}
    </CaseStatsContext.Provider>
  );
};
