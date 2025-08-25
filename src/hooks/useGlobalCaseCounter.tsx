import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGlobalCaseCounter = () => {
  const [totalCasesOpened, setTotalCasesOpened] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Получаем текущий счетчик из базы данных
  const getGlobalCounter = async (): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from('global_case_counter')
        .select('total_cases_opened')
        .eq('counter_name', 'total_cases_opened')
        .single();

      if (error) {
        console.error('❌ Error fetching global counter:', error);
        return 0;
      }

      return data?.total_cases_opened || 0;
    } catch (err) {
      console.error('❌ Failed to get global counter:', err);
      return 0;
    }
  };

  // Увеличиваем счетчик на 1
  const incrementGlobalCounter = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('global_case_counter')
        .update({ 
          total_cases_opened: totalCasesOpened + 1,
          last_reset_at: new Date().toISOString()
        })
        .eq('counter_name', 'total_cases_opened')
        .select();

      if (error) {
        console.error('❌ Error incrementing global counter:', error);
        return false;
      }

      if (data && data.length > 0) {
        setTotalCasesOpened(data[0].total_cases_opened);
        // Синхронизируем с localStorage для совместимости
        localStorage.setItem('totalCasesOpened', data[0].total_cases_opened.toString());
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Failed to increment global counter:', err);
      return false;
    }
  };

  // Сбрасываем счетчик
  const resetGlobalCounter = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('global_case_counter')
        .update({ 
          total_cases_opened: 0,
          last_reset_at: new Date().toISOString()
        })
        .eq('counter_name', 'total_cases_opened')
        .select();

      if (error) {
        console.error('❌ Error resetting global counter:', error);
        return false;
      }

      if (data && data.length > 0) {
        setTotalCasesOpened(0);
        // Синхронизируем с localStorage для совместимости
        localStorage.setItem('totalCasesOpened', '0');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Failed to reset global counter:', err);
      return false;
    }
  };

  // Создаем счетчик если его нет
  const ensureGlobalCounter = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('global_case_counter')
        .select('*')
        .eq('counter_name', 'total_cases_opened')
        .single();

      if (error && error.code === 'PGRST116') {
        // Счетчик не существует, создаем его
        console.log('🔄 Creating global counter...');
        const { data: newCounter, error: createError } = await supabase
          .from('global_case_counter')
          .insert({
            counter_name: 'total_cases_opened',
            total_cases_opened: 0,
            last_reset_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('❌ Failed to create global counter:', createError);
          return false;
        }

        setTotalCasesOpened(newCounter.total_cases_opened);
        return true;
      }

      if (data) {
        setTotalCasesOpened(data.total_cases_opened);
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Failed to ensure global counter:', err);
      return false;
    }
  };

  // Загружаем счетчик при инициализации
  useEffect(() => {
    const loadCounter = async () => {
      setIsLoading(true);
      try {
        await ensureGlobalCounter();
      } catch (err) {
        console.error('❌ Failed to load global counter:', err);
        // Fallback к localStorage
        const localCount = localStorage.getItem('totalCasesOpened');
        if (localCount) {
          setTotalCasesOpened(parseInt(localCount, 10));
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadCounter();
  }, []);

  return {
    totalCasesOpened,
    isLoading,
    getGlobalCounter,
    incrementGlobalCounter,
    resetGlobalCounter,
    ensureGlobalCounter
  };
};
