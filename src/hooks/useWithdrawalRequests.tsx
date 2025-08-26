import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useNotification } from './useNotification';

export interface WithdrawalRequest {
  id: string;
  user_id: number;
  item_id: string;
  item_name: string;
  telegram_username: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  created_at: string;
  updated_at: string;
  processed_at: string | null;
  admin_notes: string | null;
}

export const useWithdrawalRequests = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  // Проверяем существование таблицы при инициализации
  useEffect(() => {
    const checkTable = async () => {
      try {
        console.log('🔍 Проверяем существование таблицы withdrawal_requests...');
        const { data, error } = await supabase
          .from('withdrawal_requests')
          .select('count(*)', { count: 'exact', head: true });
        
        if (error) {
          console.error('❌ Таблица withdrawal_requests не найдена:', error);
          showError('Таблица withdrawal_requests не создана в базе данных. Выполните SQL скрипт.');
        } else {
          console.log('✅ Таблица withdrawal_requests существует');
        }
      } catch (err) {
        console.error('❌ Ошибка при проверке таблицы:', err);
      }
    };
    
    checkTable();
  }, []);

  // Получить все запросы пользователя
  const fetchUserRequests = async (userId: number) => {
    try {
      setLoading(true);
      console.log('🔍 Загружаем запросы для пользователя:', userId);
      
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching requests:', error);
        throw error;
      }
      
      console.log('✅ Запросы загружены:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching withdrawal requests:', error);
      showError('Ошибка при загрузке запросов на вывод');
    } finally {
      setLoading(false);
    }
  };

  // Получить все запросы (для админов)
  const fetchAllRequests = async () => {
    try {
      setLoading(true);
      console.log('🔍 Загружаем все запросы (админ)...');
      
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching all requests:', error);
        throw error;
      }
      
      console.log('✅ Все запросы загружены:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching all withdrawal requests:', error);
      showError('Ошибка при загрузке всех запросов на вывод');
    } finally {
      setLoading(false);
    }
  };

  // Создать запрос на вывод (упрощенная версия)
  const createWithdrawalRequest = async (
    userId: number,
    itemId: string,
    itemName: string,
    telegramUsername: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Проверяем формат username (должен начинаться с @)
      const formattedUsername = telegramUsername.startsWith('@') 
        ? telegramUsername 
        : `@${telegramUsername}`;

      console.log('Creating withdrawal request:', {
        userId,
        itemId,
        itemName,
        telegramUsername: formattedUsername
      });

      // Проверим, существует ли таблица
      console.log('🔍 Проверяем подключение к Supabase...');
      
      // Прямая вставка в таблицу
      console.log('📝 Данные для вставки:', {
        user_id: userId,
        item_id: itemId,
        item_name: itemName,
        telegram_username: formattedUsername,
        status: 'pending'
      });

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .insert({
          user_id: userId,
          item_id: itemId,
          item_name: itemName,
          telegram_username: formattedUsername,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Insert Error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('✅ Insert Response:', data);

      // Обновляем статус предмета в инвентаре на 'withdrawal_requested'
      try {
        console.log('🔄 Обновляем статус предмета в инвентаре...');
        const { error: updateError } = await supabase
          .from('user_inventory')
          .update({ withdrawal_status: 'withdrawal_requested' })
          .eq('id', itemId);

        if (updateError) {
          console.warn('⚠️ Could not update inventory status:', updateError);
        } else {
          console.log('✅ Статус предмета в инвентаре обновлен на withdrawal_requested');
        }
      } catch (updateError) {
        console.warn('⚠️ Error updating inventory status:', updateError);
      }

      showSuccess('Запрос на вывод создан успешно!');
      return true;

    } catch (error: any) {
      console.error('Error creating withdrawal request:', error);
      showError(error.message || 'Ошибка при создании запроса на вывод');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Обновить статус запроса (для админов)
  const updateRequestStatus = async (
    requestId: string,
    status: WithdrawalRequest['status'],
    adminNotes?: string
  ): Promise<boolean> => {
    try {
      setLoading(true);

      // Сначала получаем информацию о запросе
      const { data: requestData, error: fetchError } = await supabase
        .from('withdrawal_requests')
        .select('item_id')
        .eq('id', requestId)
        .single();

      if (fetchError || !requestData) {
        throw new Error('Запрос не найден');
      }

      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      if (adminNotes) {
        updateData.admin_notes = adminNotes;
      }

      if (status === 'completed' || status === 'rejected') {
        updateData.processed_at = new Date().toISOString();
      }

      // Обновляем статус запроса
      const { error } = await supabase
        .from('withdrawal_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      // Обновляем статус предмета в инвентаре в зависимости от решения админа
      try {
        let inventoryStatus: string;
        
        if (status === 'rejected') {
          // Если запрос отклонен - возвращаем предмет в инвентарь
          inventoryStatus = 'available';
          console.log('🔄 Возвращаем предмет в инвентарь (запрос отклонен)');
        } else if (status === 'completed') {
          // Если запрос выполнен - предмет выведен
          inventoryStatus = 'withdrawn';
          console.log('🔄 Предмет выведен из инвентаря (запрос выполнен)');
        } else {
          // Для других статусов оставляем как есть
          console.log('🔄 Статус предмета не изменяется');
          showSuccess('Статус запроса обновлен');
          return true;
        }

        const { error: inventoryError } = await supabase
          .from('user_inventory')
          .update({ withdrawal_status: inventoryStatus })
          .eq('id', requestData.item_id);

        if (inventoryError) {
          console.warn('⚠️ Could not update inventory status:', inventoryError);
        } else {
          console.log(`✅ Статус предмета обновлен на: ${inventoryStatus}`);
        }
      } catch (inventoryError) {
        console.warn('⚠️ Error updating inventory status:', inventoryError);
      }

      showSuccess('Статус запроса обновлен');
      return true;

    } catch (error: any) {
      console.error('Error updating request status:', error);
      showError('Ошибка при обновлении статуса запроса');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    requests,
    loading,
    fetchUserRequests,
    fetchAllRequests,
    createWithdrawalRequest,
    updateRequestStatus
  };
};
