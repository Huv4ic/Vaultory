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

  // Создать запрос на вывод
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

      // Используем RPC функцию для создания запроса
      const { data, error } = await supabase.rpc('create_withdrawal_request', {
        p_user_id: userId,
        p_item_id: itemId,
        p_item_name: itemName,
        p_telegram_username: formattedUsername
      });

      if (error) {
        console.error('RPC Error:', error);
        throw error;
      }

      console.log('RPC Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Не удалось создать запрос на вывод');
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
