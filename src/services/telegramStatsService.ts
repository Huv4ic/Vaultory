import { supabase } from '@/integrations/supabase/client';

export interface TelegramChannelStats {
  id: number;
  channel_username: string;
  subscribers_count: number;
  last_updated: string;
  created_at: string;
}

export class TelegramStatsService {
  // Получить статистику канала
  static async getChannelStats(channelUsername: string): Promise<TelegramChannelStats | null> {
    try {
      const { data, error } = await supabase
        .from('telegram_channel_stats')
        .select('*')
        .eq('channel_username', channelUsername)
        .single();

      if (error) {
        console.error('Error fetching telegram stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getChannelStats:', error);
      return null;
    }
  }

  // Обновить статистику канала
  static async updateChannelStats(
    channelUsername: string, 
    subscribersCount: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('update_telegram_stats', {
        channel_username: channelUsername,
        subscribers_count: subscribersCount
      });

      if (error) {
        console.error('Error updating telegram stats:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateChannelStats:', error);
      return false;
    }
  }

  // Получить статистику через RPC функцию
  static async getStatsViaRPC(channelUsername: string): Promise<{subscribers_count: number, last_updated: string} | null> {
    try {
      const { data, error } = await supabase.rpc('get_telegram_stats', {
        channel_username: channelUsername
      });

      if (error) {
        console.error('Error fetching telegram stats via RPC:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('Error in getStatsViaRPC:', error);
      return null;
    }
  }

  // Получить все статистики каналов
  static async getAllChannelStats(): Promise<TelegramChannelStats[]> {
    try {
      const { data, error } = await supabase
        .from('telegram_channel_stats')
        .select('*')
        .order('last_updated', { ascending: false });

      if (error) {
        console.error('Error fetching all telegram stats:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAllChannelStats:', error);
      return [];
    }
  }
}
