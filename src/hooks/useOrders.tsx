import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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
    console.log('🚀 НАЧИНАЕМ СОЗДАНИЕ ЗАКАЗА');
    console.log('👤 TelegramUser:', telegramUser);
    console.log('📋 Items:', items);
    console.log('💰 TotalAmount:', totalAmount);
    
    if (!telegramUser?.id) {
      console.log('❌ Пользователь не авторизован');
      return { success: false, error: 'Пользователь не авторизован' };
    }

    setIsProcessing(true);

    try {
      // Генерируем ID заказа
      const orderId = crypto.randomUUID();
      console.log('🆔 Сгенерирован OrderId:', orderId);

      // Отправляем уведомление в Telegram бота
      console.log('🔔 Вызываем sendOrderNotification...');
      await sendOrderNotification(items, totalAmount, orderId);
      console.log('✅ sendOrderNotification завершена');

      console.log('🎉 ЗАКАЗ УСПЕШНО СОЗДАН!');
      return { success: true, orderId };
    } catch (error) {
      console.error('❌ ОШИБКА ПРИ ОФОРМЛЕНИИ ЗАКАЗА:', error);
      return { success: false, error: 'Неожиданная ошибка' };
    } finally {
      setIsProcessing(false);
    }
  };

  // Отправка уведомления в бота
  const sendOrderNotification = async (items: OrderItem[], totalAmount: number, orderId: string) => {
    try {
      console.log('🔔 НАЧИНАЕМ ОТПРАВКУ УВЕДОМЛЕНИЯ В TELEGRAM');
      console.log('📦 OrderId:', orderId);
      console.log('💰 TotalAmount:', totalAmount);
      console.log('📋 Items:', items);
      console.log('👤 TelegramUser:', telegramUser);
      
      const botToken = '8017714761:AAH9xTX_9fNUPGKuLaxqJWf85W7AixO2rEU';
      const chatId = '5931400368'; // Попробуйте также: '@vaultorysell' или '-1001234567890'
      
      console.log('🤖 Bot Token:', botToken);
      console.log('💬 Chat ID:', chatId);

      const itemsList = items.map(item => 
        `• ${item.name} x${item.quantity} - ${item.price * item.quantity}₴`
      ).join('\n');

      const message = `🛒 *Новый заказ!*\n\n` +
        `👤 Пользователь: ${telegramUser?.username || 'Без username'}\n` +
        `🆔 Telegram ID: ${telegramUser?.id}\n` +
        `📦 Номер заказа: \`${orderId}\`\n` +
        `💰 Сумма: ${totalAmount}₴\n\n` +
        `📋 Товары:\n${itemsList}\n\n` +
        `⚠️ *Свяжитесь с пользователем для передачи товаров!*`;

      console.log('📝 Сообщение для отправки:', message);
      console.log('🔗 URL:', `https://api.telegram.org/bot${botToken}/sendMessage`);
      
      // Тестируем бота перед отправкой
      try {
        const testResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        const testData = await testResponse.json();
        console.log('🤖 Тест бота:', testData);
      } catch (testError) {
        console.error('❌ Ошибка тестирования бота:', testError);
      }

      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      console.log('📡 Ответ от Telegram API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ ОШИБКА ОТПРАВКИ УВЕДОМЛЕНИЯ:', response.statusText, errorText);
      } else {
        const responseData = await response.json();
        console.log('📄 Полный ответ от Telegram API:', responseData);
        
        if (responseData.ok) {
          console.log('✅ УВЕДОМЛЕНИЕ УСПЕШНО ОТПРАВЛЕНО В TELEGRAM!');
          console.log('📨 Message ID:', responseData.result?.message_id);
          console.log('💬 Chat ID:', responseData.result?.chat?.id);
        } else {
          console.error('❌ TELEGRAM API ВЕРНУЛ ОШИБКУ:', responseData.description);
        }
      }
    } catch (error) {
      console.error('❌ ОШИБКА ПРИ ОТПРАВКЕ УВЕДОМЛЕНИЯ:', error);
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
