import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { TelegramStatsService } from '@/services/telegramStatsService';
import { TelegramBotAPI } from '@/api/telegramStats';
import { useNotification } from '@/hooks/useNotification';

export const AdminTelegramStats: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const { showSuccess, showError } = useNotification();

  // Загрузить текущую статистику
  const loadStats = async () => {
    try {
      setLoading(true);
      const channelStats = await TelegramStatsService.getChannelStats('vaultorysell');
      setStats(channelStats);
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
      showError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  // Обновить статистику из Telegram
  const updateStatsFromTelegram = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Получаем статистику из Telegram API...');
      
      // Получаем актуальную статистику из Telegram
      const channelInfo = await TelegramBotAPI.getChannelInfo();
      
      if (!channelInfo) {
        showError('Не удалось получить статистику из Telegram. Проверьте настройки бота.');
        return;
      }

      console.log('📊 Получена статистика:', channelInfo.members_count, 'подписчиков');

      // Обновляем в базе данных
      const success = await TelegramStatsService.updateChannelStats(
        'vaultorysell', 
        channelInfo.members_count
      );

      if (success) {
        showSuccess(`Статистика успешно обновлена! Подписчиков: ${channelInfo.members_count}`);
        await loadStats(); // Перезагружаем статистику
      } else {
        showError('Не удалось обновить статистику в базе данных');
      }
    } catch (error) {
      console.error('Ошибка обновления статистики:', error);
      showError(`Ошибка при обновлении статистики: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Форматирование числа
  const formatNumber = (num: number): string => {
    return num.toLocaleString('ru-RU');
  };

  // Форматирование времени
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Статистика Telegram канала</span>
          </CardTitle>
          <CardDescription>
            Управление статистикой канала @vaultorysell
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Кнопки управления */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={loadStats}
              disabled={loading}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Загрузить статистику</span>
            </Button>
            
            <Button 
              onClick={updateStatsFromTelegram}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Обновить из Telegram</span>
            </Button>

            <Button 
              onClick={async () => {
                try {
                  setLoading(true);
                  const channelInfo = await TelegramBotAPI.getChannelInfo();
                  if (channelInfo) {
                    showSuccess(`API работает! Подписчиков: ${channelInfo.members_count}`);
                  } else {
                    showError('API не работает. Проверьте настройки бота.');
                  }
                } catch (error) {
                  showError(`Ошибка API: ${error.message}`);
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              variant="secondary"
              className="flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Тест API</span>
            </Button>
          </div>

          {/* Отображение статистики */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Подписчиков</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatNumber(stats.subscribers_count)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Последнее обновление</p>
                      <p className="text-sm text-gray-500">
                        {formatTime(stats.last_updated)}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Информация о настройке */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Настройка автоматического обновления</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p>Для автоматического обновления статистики:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Создайте Telegram бота через @BotFather</li>
                  <li>Добавьте бота в канал как администратора</li>
                  <li>Настройте переменную окружения REACT_APP_TELEGRAM_BOT_TOKEN</li>
                  <li>Создайте cron job или webhook для периодического обновления</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTelegramStats;