import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../integrations/supabase/client';

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

  // Загрузка статистики пользователя из базы данных
  const loadUserCaseStats = async () => {
    if (!telegramUser) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Загружаем статистику для пользователя:', telegramUser.id);

      // Используем any для обхода проблем с типами
      const { data: stats, error: statsError } = await (supabase as any)
        .from('user_case_stats')
        .select(`
          case_id,
          opened_count,
          last_opened_at,
          cases!inner(
            name,
            image
          )
        `)
        .eq('user_id', telegramUser.id)
        .order('opened_count', { ascending: false });

      if (statsError) {
        console.error('Ошибка загрузки статистики:', statsError);
        throw statsError;
      }

      console.log('Получена статистика с сервера:', stats);

      const formattedStats: CaseStats[] = (stats || []).map((stat: any) => ({
        case_id: stat.case_id,
        case_name: stat.cases.name,
        opened_count: stat.opened_count,
        case_image_url: stat.cases.image
      }));

      setCaseStats(formattedStats);

      // Определяем любимый кейс
      if (formattedStats.length > 0) {
        const favorite = formattedStats[0]; // Уже отсортировано по opened_count
        setFavoriteCase({
          case_id: favorite.case_id,
          case_name: favorite.case_name,
          opened_count: favorite.opened_count,
          case_image_url: favorite.case_image_url
        });
        console.log('Установлен любимый кейс:', favorite);
      } else {
        setFavoriteCase(null);
        console.log('У пользователя нет статистики кейсов');
      }

    } catch (err) {
      console.error('Ошибка загрузки статистики кейсов:', err);
      setError('Ошибка загрузки статистики');
    } finally {
      setLoading(false);
    }
  };

  // Увеличение счетчика открытий кейса через прямые SQL запросы
  const incrementCaseOpened = async (caseId: number, caseName: string, caseImageUrl?: string) => {
    if (!telegramUser) return;

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
  const getFavoriteCase = async (): Promise<FavoriteCase | null> => {
    if (!telegramUser) return null;

    try {
      const { data, error } = await (supabase as any)
        .from('user_case_stats')
        .select(`
          case_id,
          opened_count,
          last_opened_at,
          cases!inner(
            name,
            image
          )
        `)
        .eq('user_id', telegramUser.id)
        .order('opened_count', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Ошибка получения любимого кейса:', error);
        return null;
      }

      if (data) {
        return {
          case_id: data.case_id,
          case_name: data.cases.name,
          opened_count: data.opened_count,
          case_image_url: data.cases.image
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
