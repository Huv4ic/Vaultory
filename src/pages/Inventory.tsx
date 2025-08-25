import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInventory, InventoryItem } from '@/hooks/useInventory';
import { useCaseStats } from '@/hooks/useCaseStats';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import Notification from '@/components/ui/Notification';
import { 
  Package, 
  Star, 
  DollarSign, 
  Trophy, 
  ArrowLeft,
  Crown,
  Zap,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '../integrations/supabase/client';

interface FavoriteCase {
  case_id: string;
  case_name: string;
  opened_count: number;
  case_image_url?: string;
}

const Inventory = () => {
  const { telegramUser, profile } = useAuth();
  const { items: inventoryItems, getTotalValue, casesOpened, refreshItems, sellItem, withdrawItem, getCasesOpened } = useInventory();

  // Функция для форматирования числа с разделителями
  const formatNumber = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { favoriteCase, caseStats, loading: statsLoading, error: statsError } = useCaseStats();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, notification, hideNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCasesOpened, setTotalCasesOpened] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  
  // Используем локальное состояние для отображения предметов
  const [displayItems, setDisplayItems] = useState<InventoryItem[]>([]);
  const [showConfirmSell, setShowConfirmSell] = useState(false);
  const [itemToSell, setItemToSell] = useState<InventoryItem | null>(null);

  // Инициализируем displayItems при загрузке
  useEffect(() => {
    setDisplayItems(inventoryItems);
  }, []);

  // Загружаем общую стоимость
  useEffect(() => {
    const loadTotalValue = async () => {
      const value = await getTotalValue();
      setTotalValue(value);
    };
    loadTotalValue();
  }, [getTotalValue, inventoryItems]);

  // Загружаем количество открытых кейсов
  useEffect(() => {
    const loadCasesOpened = async () => {
      const count = await getCasesOpened();
      setTotalCasesOpened(count);
    };
    loadCasesOpened();
  }, [getCasesOpened]);

  useEffect(() => {
    if (!telegramUser) {
      navigate('/auth');
      return;
    }
    
    // Принудительное обновление данных инвентаря при заходе на страницу
    const hasRefreshed = sessionStorage.getItem('inventory_refreshed');
    if (!hasRefreshed) {
      sessionStorage.setItem('inventory_refreshed', 'true');
      
      // Принудительно обновляем данные инвентаря
      console.log('Обновляем инвентарь при заходе на страницу');
      refreshItems().catch(console.error);
    }
  }, [telegramUser, navigate, refreshItems]);

  // Принудительно обновляем состояние при изменении inventoryItems
  useEffect(() => {
    setDisplayItems(inventoryItems);
  }, [inventoryItems]);

  // Определяем состояние загрузки
  const isLoading = loading || statsLoading;
  const hasError = error || statsError;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'uncommon': return 'text-green-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 border-gray-500/30';
      case 'uncommon': return 'bg-green-500/20 border-green-500/30';
      case 'rare': return 'bg-blue-500/20 border-blue-500/30';
      case 'epic': return 'bg-purple-500/20 border-purple-500/30';
      case 'legendary': return 'bg-amber-500/20 border-amber-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  const handleCancelSell = () => {
    setShowConfirmSell(false);
    setItemToSell(null);
  };

  const handleConfirmSell = async () => {
    if (!itemToSell) return;
    
    try {
      // Находим индекс предмета в массиве
      const itemIndex = inventoryItems.findIndex(invItem => invItem.id === itemToSell.id);
      console.log('🔍 Индекс предмета в массиве:', itemIndex);
      
      if (itemIndex !== -1) {
        console.log('✅ Предмет найден, вызываем sellItem...');
        // Используем функцию sellItem из useInventory
        const sellPrice = await sellItem(itemIndex);
        console.log('💰 Результат продажи:', sellPrice);
        
        if (sellPrice > 0) {
          console.log('✅ Предмет успешно продан за:', sellPrice);
          
          // Обновляем баланс пользователя в профиле
          if (profile && profile.balance !== undefined) {
            try {
              // Обновляем баланс в базе данных
              const { error: balanceError } = await supabase
                .from('profiles')
                .update({ 
                  balance: profile.balance + sellPrice 
                })
                .eq('telegram_id', profile.telegram_id);
              
              if (balanceError) {
                console.error('❌ Ошибка обновления баланса:', balanceError);
              } else {
                console.log('✅ Баланс обновлен в базе данных:', {
                  old: profile.balance,
                  new: profile.balance + sellPrice
                });
              }
            } catch (balanceError) {
              console.error('❌ Ошибка при обновлении баланса:', balanceError);
            }
          }
          
          showSuccess(`Предмет "${itemToSell.name}" продан за ${sellPrice.toFixed(2)}₴! Деньги добавлены на баланс.`);
          console.log('Предмет продан:', itemToSell.name, 'за', sellPrice);
        } else {
          console.error('❌ Ошибка при продаже предмета, цена:', sellPrice);
          showError('Ошибка при продаже предмета!');
        }
      } else {
        console.error('❌ Предмет не найден в инвентаре!');
        showError('Предмет не найден в инвентаре!');
      }
    } catch (error) {
      console.error('❌ Error selling item:', error);
      showError('Ошибка при продаже предмета!');
    }
    
    setShowConfirmSell(false);
    setItemToSell(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Загрузка инвентаря...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-amber-500 hover:bg-amber-600">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Кнопка "Назад" - перемещена влево и ниже */}
          <div className="mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-black/20 border-white/20 text-white hover:bg-white/10"
            >
              ← Назад
            </Button>
          </div>
          
          {/* Заголовок по центру */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Инвентарь</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ваши предметы, полученные из кейсов
            </p>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Общая стоимость */}
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full flex items-center justify-center mb-4 border border-green-500/30">
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Общая стоимость</h3>
                              <p className="text-3xl font-bold text-green-400">{formatNumber(parseFloat(totalValue.toFixed(2)))}₴</p>
            </CardContent>
          </Card>

          {/* Количество предметов */}
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30">
                <Package className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Предметов</h3>
              <p className="text-3xl font-bold text-blue-400">{displayItems.length}</p>
            </CardContent>
          </Card>

          {/* Любимый кейс */}
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Любимый кейс</h3>
              {favoriteCase && (
                <>
                  {/* Фото кейса */}
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-800">
                    {favoriteCase.case_image_url ? (
                      <img 
                        src={favoriteCase.case_image_url} 
                        alt={favoriteCase.case_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Trophy className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <p className="text-lg font-bold text-amber-400 mb-1">{favoriteCase.case_name}</p>
                  <p className="text-sm text-gray-300">Открыто {favoriteCase.opened_count} раз</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Сетка предметов инвентаря */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-white" />
            <h3 className="text-xl font-semibold text-white">
              Предметы в инвентаре ({displayItems.length})
            </h3>
          </div>
          
          {displayItems.length === 0 ? (
            <div className="text-center py-12 bg-black/20 rounded-xl border border-gray-700">
              <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Инвентарь пуст</p>
              <p className="text-gray-500">Откройте кейсы, чтобы получить предметы</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {displayItems.map((item) => (
                <div
                  key={item.id || Math.random()}
                  className={`p-4 rounded-xl border ${getRarityBg(item.rarity || 'common')} hover:scale-105 transition-all duration-300`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className={`font-semibold ${getRarityColor(item.rarity || 'common')} mb-1`}>
                        {item.name || 'Неизвестный предмет'}
                      </h4>
                      <p className="text-gray-400 text-sm mb-2">{item.type || 'Неизвестно'}</p>
                      <p className="text-gray-500 text-xs">Из кейса: {item.case_name || 'Неизвестно'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">{(item.price || 0).toFixed(2)}₴</div>
                      <div className={`text-xs font-medium ${getRarityColor(item.rarity || 'common')} capitalize`}>
                        {item.rarity || 'common'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Получен: {item.obtained_at ? new Date(item.obtained_at).toLocaleDateString('ru-RU') : 'Неизвестно'}</span>
                    <div className="flex items-center space-x-1">
                      <Trophy className="w-3 h-3" />
                      <span>Кейс</span>
                    </div>
                  </div>
                  
                  {/* Кнопки действий */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={async () => {
                        // Вывести предмет
                        try {
                          const itemIndex = inventoryItems.findIndex(invItem => invItem.id === item.id);
                          if (itemIndex !== -1) {
                            await withdrawItem(itemIndex);
                            
                            showSuccess(`Предмет "${item.name}" выведен из инвентаря!`);
                            console.log('Предмет выведен:', item.name);
                                                     } else {
                             showError('Предмет не найден в инвентаре!');
                           }
                        } catch (error) {
                          console.error('Error withdrawing item:', error);
                                                     showError('Ошибка при выводе предмета!');
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      📤 Вывести
                    </button>
                    
                    <button
                      onClick={async () => {
                        // Продать предмет
                        console.log('🔄 Нажата кнопка "Продать" для предмета:', item);
                        
                        setItemToSell(item);
                        setShowConfirmSell(true);
                      }}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-medium rounded-lg transition-all duration-200 hover:scale-105"
                    >
                      💰 Продать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Красивые уведомления */}
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
        onClose={hideNotification}
        autoHide={notification.autoHide}
        duration={notification.duration}
      />

      {/* Модальное окно подтверждения продажи */}
      {showConfirmSell && itemToSell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Подтверждение продажи</h3>
              <p className="text-gray-300 mb-4">
                Продать "{itemToSell.name}" за {itemToSell.price}₴?
              </p>
              <p className="text-sm text-gray-400 mb-6">
                Деньги будут добавлены на ваш баланс
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelSell}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={handleConfirmSell}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Продать
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
