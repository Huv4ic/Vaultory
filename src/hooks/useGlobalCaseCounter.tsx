import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useGlobalCaseCounter = () => {
  const [totalCasesOpened, setTotalCasesOpened] = useState(0);
  const [loading, setLoading] = useState(true);

  // Получаем текущий глобальный счетчик
  const getGlobalCounter = async (): Promise<number> => {
    try {
      const { data: counterData, error: fetchError } = await supabase
        .from('admin_cases')
        .select('description')
        .eq('name', '__GLOBAL_COUNTER__')
        .single();

      if (fetchError || !counterData) {
        return 0;
      }

      try {
        const details = JSON.parse(counterData.description || '{}');
        return details.total_cases_opened || 0;
      } catch (parseError) {
        console.error('Ошибка парсинга описания счетчика:', parseError);
        return 0;
      }
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
        .from('admin_cases')
        .update({
          description: JSON.stringify({ 
            total_cases_opened: newCount, 
            last_reset_at: new Date().toISOString() 
          }),
          updated_at: new Date().toISOString()
        })
        .eq('name', '__GLOBAL_COUNTER__');

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
        .from('admin_cases')
        .update({
          description: JSON.stringify({ 
            total_cases_opened: 0, 
            last_reset_at: new Date().toISOString() 
          }),
          updated_at: new Date().toISOString()
        })
        .eq('name', '__GLOBAL_COUNTER__');

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

  // Функция для создания глобального счетчика кейсов
  const ensureGlobalCounter = async () => {
    try {
      // Проверяем, есть ли запись о глобальном счетчике в admin_cases
      const { data: counterData, error: fetchError } = await supabase
        .from('admin_cases')
        .select('*')
        .eq('name', '__GLOBAL_COUNTER__')
        .single();

      if (fetchError || !counterData) {
        // Создаем начальную запись о глобальном счетчике
        const { error: insertError } = await supabase
          .from('admin_cases')
          .insert({
            id: `counter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Генерируем уникальный ID
            name: '__GLOBAL_COUNTER__',
            game: 'system',
            price: 0,
            image_url: '',
            description: JSON.stringify({ total_cases_opened: 0, last_reset_at: new Date().toISOString() }),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Не удалось создать начальную запись счетчика:', insertError);
          return false;
        }
      }

      return true;
    } catch (err) {
      console.error('Ошибка при создании глобального счетчика:', err);
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
