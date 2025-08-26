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

  // Получить все запросы пользователя
  const fetchUserRequests = async (userId: number) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
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
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select(`
          *,
          profiles!withdrawal_requests_user_id_fkey(username, telegram_id)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
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

      // Прямая вставка в таблицу
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
        console.error('Insert Error:', error);
        throw error;
      }

      console.log('Insert Response:', data);

      // Обновляем статус предмета в инвентаре (опционально)
      try {
        await supabase
          .from('user_inventory')
          .update({ status: 'withdrawal_requested' })
          .eq('id', itemId);
      } catch (updateError) {
        console.warn('Could not update inventory status:', updateError);
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

      const { error } = await supabase
        .from('withdrawal_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

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
