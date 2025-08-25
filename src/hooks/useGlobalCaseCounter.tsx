import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useGlobalCaseCounter = () => {
  const [totalCasesOpened, setTotalCasesOpened] = useState(0);
  const [loading, setLoading] = useState(true);

  // Получаем текущий глобальный счетчик
  const getGlobalCounter = async (): Promise<number> => {
    try {
      const { data: counterData, error: fetchError } = await supabase
        .from('admin_logs')
        .select('details')
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .eq('target_id', 'main')
        .single();

      if (fetchError || !counterData) {
        return 0;
      }

      const details = counterData.details as any;
      return details?.total_cases_opened || 0;
    } catch (err) {
      console.error('Ошибка при получении глобального счетчика:', err);
      return 0;
    }
  };

  // Увеличиваем глобальный счетчик на 1
  const incrementGlobalCounter = async (): Promise<boolean> => {
    try {
      const currentCount = await getGlobalCounter();
      const newCount = currentCount + 1;

      const { error: updateError } = await supabase
        .from('admin_logs')
        .update({
          details: { 
            total_cases_opened: newCount, 
            last_reset_at: new Date().toISOString() 
          }
        })
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .eq('target_id', 'main');

      if (updateError) {
        console.error('Не удалось обновить глобальный счетчик:', updateError);
        return false;
      }

      // Обновляем локальное состояние
      setTotalCasesOpened(newCount);
      
      // Также обновляем localStorage для совместимости
      localStorage.setItem('totalCasesOpened', newCount.toString());
      
      return true;
    } catch (err) {
      console.error('Ошибка при увеличении глобального счетчика:', err);
      return false;
    }
  };

  // Сбрасываем глобальный счетчик
  const resetGlobalCounter = async (): Promise<boolean> => {
    try {
      const { error: updateError } = await supabase
        .from('admin_logs')
        .update({
          details: { 
            total_cases_opened: 0, 
            last_reset_at: new Date().toISOString() 
          }
        })
        .eq('action', 'global_case_counter')
        .eq('target_type', 'counter')
        .eq('target_id', 'main');

      if (updateError) {
        console.error('Не удалось сбросить глобальный счетчик:', updateError);
        return false;
      }

      // Обновляем локальное состояние
      setTotalCasesOpened(0);
      
      // Также обновляем localStorage для совместимости
      localStorage.setItem('totalCasesOpened', '0');
      
      return true;
    } catch (err) {
      console.error('Ошибка при сбросе глобального счетчика:', err);
      return false;
    }
  };

  // Загружаем счетчик при инициализации
  useEffect(() => {
    const loadCounter = async () => {
      setLoading(true);
      try {
        const count = await getGlobalCounter();
        setTotalCasesOpened(count);
        
        // Также обновляем localStorage для совместимости
        localStorage.setItem('totalCasesOpened', count.toString());
      } catch (err) {
        console.error('Ошибка при загрузке глобального счетчика:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCounter();
  }, []);

  return {
    totalCasesOpened,
    loading,
    getGlobalCounter,
    incrementGlobalCounter,
    resetGlobalCounter
  };
};
