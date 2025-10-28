import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { refreshAchievements } from '../utils/achievementUtils';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export const useOrders = () => {
  const { telegramUser } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Оформление заказа
  const createOrder = async (items: OrderItem[], totalAmount: number): Promise<{ success: boolean; orderId?: string; error?: string }> => {
    if (!telegramUser?.id) {
      return { success: false, error: 'Пользователь не авторизован' };
    }

    setIsProcessing(true);

    try {
      // Генерируем ID заказа
      const orderId = crypto.randomUUID();

      // Списываем средства с баланса
      const { error: balanceError } = await supabase.rpc('update_user_balance', {
        user_id: telegramUser.id,
        amount: -totalAmount,
        description: 'Оформление заказа'
      });

      if (balanceError) {
        console.error('Ошибка списания средств:', balanceError);
        return { success: false, error: 'Ошибка списания средств' };
      }

      // Отправляем уведомление в Telegram бота
      await sendOrderNotification(items, totalAmount, orderId);

      // Обновляем достижения
      await refreshAchievements();

      return { success: true, orderId };
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      return { success: false, error: 'Неожиданная ошибка' };
    } finally {
      setIsProcessing(false);
    }
  };

  // Отправка уведомления в бота
  const sendOrderNotification = async (items: OrderItem[], totalAmount: number, orderId: string) => {
    try {
      const botToken = '8017714761:AAH9xTX_9fNUPGKuLaxqJWf85W7AixO2rEU';
      const chatId = '5931400368';

      const itemsList = items.map(item => 
        `• ${item.name} x${item.quantity} - $${item.price * item.quantity}`
      ).join('\n');

      const message = `🛒 Новый заказ!\n\n` +
        `👤 Пользователь: ${telegramUser?.username || 'Без username'}\n` +
        `🆔 Telegram ID: ${telegramUser?.id}\n` +
        `📦 Номер заказа: ${orderId}\n` +
        `💰 Сумма: $${totalAmount}\n\n` +
        `📋 Товары:\n${itemsList}\n\n` +
        `⚠️ Свяжитесь с пользователем для передачи товаров!`;

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      });

      if (!response.ok) {
        console.error('Ошибка отправки уведомления о заказе:', response.statusText);
      }
    } catch (error) {
      console.error('Ошибка при отправке уведомления о заказе:', error);
    }
  };

  // Получение заказов пользователя
  const getUserOrders = async (): Promise<Order[]> => {
    if (!telegramUser?.id) return [];

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', telegramUser.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ошибка получения заказов:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Ошибка при получении заказов:', error);
      return [];
    }
  };

  // Получение статистики пользователя
  const getUserStatistics = async () => {
    if (!telegramUser?.id) return null;

    try {
      const { data, error } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('telegram_id', telegramUser.id)
        .single();

      if (error) {
        console.error('Ошибка получения статистики:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Ошибка при получении статистики:', error);
      return null;
    }
  };

  return {
    createOrder,
    getUserOrders,
    getUserStatistics,
    isProcessing
  };
};
