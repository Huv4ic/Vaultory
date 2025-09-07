// API для обновления статистики Telegram канала
// Этот файл можно использовать для создания webhook или cron job

export interface TelegramBotResponse {
  ok: boolean;
  result?: {
    id: number;
    title: string;
    username: string;
    type: string;
    members_count?: number;
  };
  error_code?: number;
  description?: string;
}

export class TelegramBotAPI {
  private static readonly BOT_TOKEN = process.env.REACT_APP_TELEGRAM_BOT_TOKEN;
  private static readonly CHANNEL_USERNAME = 'vaultorysell';

  // Получить информацию о канале через Telegram Bot API
  static async getChannelInfo(): Promise<{ members_count: number } | null> {
    if (!this.BOT_TOKEN) {
      console.warn('Telegram Bot Token не настроен');
      return null;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${this.BOT_TOKEN}/getChat?chat_id=@${this.CHANNEL_USERNAME}`
      );

      const data: TelegramBotResponse = await response.json();

      if (data.ok && data.result) {
        return {
          members_count: data.result.members_count || 0
        };
      } else {
        console.error('Ошибка получения информации о канале:', data.description);
        return null;
      }
    } catch (error) {
      console.error('Ошибка при запросе к Telegram API:', error);
      return null;
    }
  }

  // Обновить статистику в базе данных
  static async updateChannelStats(): Promise<boolean> {
    try {
      const channelInfo = await this.getChannelInfo();
      
      if (!channelInfo) {
        return false;
      }

      // Здесь можно добавить вызов к вашему API для обновления базы данных
      // Например, через Supabase или ваш backend
      console.log('Обновляем статистику канала:', channelInfo.members_count);
      
      return true;
    } catch (error) {
      console.error('Ошибка обновления статистики:', error);
      return false;
    }
  }
}

// Функция для использования в webhook или cron job
export const updateTelegramStats = async () => {
  try {
    const success = await TelegramBotAPI.updateChannelStats();
    if (success) {
      console.log('✅ Статистика Telegram канала обновлена');
    } else {
      console.log('❌ Не удалось обновить статистику Telegram канала');
    }
    return success;
  } catch (error) {
    console.error('Ошибка в updateTelegramStats:', error);
    return false;
  }
};
