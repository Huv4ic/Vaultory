import { supabase } from '../integrations/supabase/client';

// Функция для обновления достижений (можно вызывать из любого места)
export const refreshAchievements = async () => {
  try {
    // Отправляем событие для обновления достижений
    // Это будет обработано в useAchievements хуке
    window.dispatchEvent(new CustomEvent('refreshAchievements'));
  } catch (error) {
    console.error('Error refreshing achievements:', error);
  }
};

// Функция для получения статистики пользователя
export const getUserStatistics = async (telegramId: number) => {
  try {
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error) {
      console.error('Error fetching user statistics:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserStatistics:', error);
    return null;
  }
};
