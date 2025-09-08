import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useInventory, InventoryItem } from '@/hooks/useInventory';
import { useCaseStats } from '@/hooks/useCaseStats';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { useWithdrawalRequests } from '@/hooks/useWithdrawalRequests';
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
  const { createWithdrawalRequest, loading: withdrawalLoading } = useWithdrawalRequests();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCasesOpened, setTotalCasesOpened] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  
  // Используем локальное состояние для отображения предметов
  const [displayItems, setDisplayItems] = useState<InventoryItem[]>([]);
  const [showConfirmSell, setShowConfirmSell] = useState(false);
  const [itemToSell, setItemToSell] = useState<InventoryItem | null>(null);
  
  // Состояния для модального окна вывода
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false);
  const [itemToWithdraw, setItemToWithdraw] = useState<InventoryItem | null>(null);
  const [withdrawalForm, setWithdrawalForm] = useState({
    itemName: '',
    telegramUsername: ''
  });

  // Инициализируем displayItems при загрузке
  useEffect(() => {
    setDisplayItems(inventoryItems);
  }, []);

  // Отладка состояний модального окна
  useEffect(() => {
    console.log('🔍 Отладка модального окна:', { showWithdrawModal, itemToWithdraw });
    if (showWithdrawModal) {
      console.log('🎯 Модальное окно должно отображаться!');
    }
  }, [showWithdrawModal, itemToWithdraw]);

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
      case 'common': return 'inventory-rarity-common';
      case 'uncommon': return 'inventory-rarity-common';
      case 'rare': return 'inventory-rarity-rare';
      case 'epic': return 'inventory-rarity-epic';
      case 'legendary': return 'inventory-rarity-legendary';
      default: return 'inventory-rarity-common';
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
          
          // Баланс уже обновлен в inventoryService.sellItem
          
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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-red-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-black/80 backdrop-blur-xl rounded-full mb-6 border border-green-500/30 shadow-2xl shadow-green-500/30">
              <Package className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white text-center">
              ИНВЕНТАРЬ
            </h1>
            <div className="w-32 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ваша <span className="text-green-400 font-bold">коллекция предметов</span>! 
            Здесь вы можете <span className="text-blue-400 font-bold">продавать</span> и <span className="text-yellow-400 font-bold">выводить</span> выигранные предметы.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Кнопка "Назад" */}
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="px-6 py-3 bg-black/80 backdrop-blur-xl border border-green-500/30 text-green-300 hover:text-white transition-all duration-300 shadow-xl shadow-green-500/20 rounded-xl text-sm font-medium hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Общая стоимость */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-green-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-center border border-green-500/30 hover:border-green-400/50 transition-all duration-500 hover:scale-105">
              <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-green-500/20">
                <DollarSign className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Общая стоимость</h3>
              <div className="text-3xl sm:text-4xl font-black text-green-400 inventory-stats-counter mb-2 drop-shadow-lg">
                {formatNumber(parseFloat(totalValue.toFixed(2)))}₴
              </div>
              <div className="text-sm text-gray-400">Стоимость всех предметов</div>
            </div>
          </div>

          {/* Количество предметов */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-blue-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-center border border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
              <div className="mx-auto w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-blue-500/20">
                <Package className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Предметов</h3>
              <div className="text-3xl sm:text-4xl font-black text-blue-400 mb-2">
                {displayItems.length}
              </div>
              <div className="text-sm text-gray-400">Уникальных предметов</div>
            </div>
          </div>

          {/* Любимый кейс */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-yellow-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl p-8 text-center border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105">
              <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-yellow-500/20">
                <Crown className="w-10 h-10 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Любимый кейс</h3>
              
              {favoriteCase ? (
                <>
                  {/* Фото кейса с эффектами */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-800 border border-yellow-500/30 group-hover:scale-105 transition-transform duration-300">
                    {favoriteCase.case_image_url ? (
                      <img 
                        src={favoriteCase.case_image_url} 
                        alt={favoriteCase.case_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-yellow-400">
                        <Trophy className="w-10 h-10" />
                      </div>
                    )}
                  </div>
                  <div className="text-lg font-bold text-yellow-400 mb-2">{favoriteCase.case_name}</div>
                  <div className="text-sm text-gray-400">Открыто {favoriteCase.opened_count} раз</div>
                </>
              ) : (
                <div className="text-gray-400 font-medium">Нет данных</div>
              )}
            </div>
          </div>
        </div>

        {/* Сетка предметов инвентаря */}
        <div className="space-y-8">
          {/* Заголовок секции */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
              Предметы в инвентаре
            </h3>
            <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-4"></div>
            <div className="text-blue-300 font-medium">
              Найдено предметов: <span className="text-white font-bold">{displayItems.length}</span>
            </div>
          </div>
          
          {displayItems.length === 0 ? (
            <div className="group relative">
              <div className="absolute -inset-1 bg-gray-500/20 rounded-3xl blur-xl"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-gray-500/30 p-16 text-center hover:border-gray-400/50 transition-all duration-500 hover:scale-105">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-500/20 rounded-2xl flex items-center justify-center border border-gray-500/30 group-hover:rotate-12 transition-all duration-500 shadow-xl shadow-gray-500/20">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h4 className="text-2xl font-black text-white mb-3">Инвентарь пуст</h4>
                <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto leading-relaxed">
                  Откройте кейсы, чтобы получить уникальные предметы и начать свою коллекцию!
                </p>
                
                <button
                  onClick={() => navigate('/cases')}
                  className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-black rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25"
                >
                  🎁 Открыть кейсы
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
              {displayItems.map((item, index) => (
                <div
                  key={item.id || Math.random()}
                  className={`inventory-card-3d inventory-item-glow relative overflow-hidden rounded-2xl p-4 ${getRarityBg(item.rarity || 'common')} border-2 shadow-2xl transition-all duration-500 group animate-inventory-slide-in`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Изображение предмета */}
                  <div className="relative mb-4">
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10 inventory-holographic">
                      {item.image_url || item.image ? (
                        <img 
                          src={item.image_url || item.image} 
                          alt={item.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            // Fallback если изображение не загрузилось
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback иконка если нет изображения */}
                      <div className={`w-full h-full flex items-center justify-center ${item.image_url || item.image ? 'hidden' : ''}`}>
                        <Package className={`w-16 h-16 ${getRarityColor(item.rarity || 'common')}`} />
                      </div>
                    </div>
                    
                    {/* Значок редкости */}
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase backdrop-blur-sm border ${getRarityColor(item.rarity || 'common')} bg-black/50`}>
                      {(item.rarity || 'common').slice(0, 3)}
                    </div>
                  </div>
                  
                  {/* Информация о предмете */}
                  <div className="space-y-3">
                    {/* Название и цена */}
                    <div className="text-center">
                      <h4 className={`text-sm font-bold ${getRarityColor(item.rarity || 'common')} mb-1 drop-shadow-lg group-hover:scale-105 transition-transform duration-300 line-clamp-2`}>
                        {item.name || 'Неизвестный предмет'}
                      </h4>
                      <div className="text-lg font-black text-green-400 mb-1 drop-shadow-lg">
                        {(item.price || 0).toFixed(0)}₴
                      </div>
                    </div>
                    
                    {/* Детали - компактно */}
                    <div className="bg-black/20 rounded-xl p-2 backdrop-blur-sm border border-white/5">
                      <div className="text-xs text-gray-400 mb-1">
                        <span className="text-white font-medium">{item.case_name || 'Неизвестно'}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.obtained_at ? new Date(item.obtained_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
                      </div>
                    </div>
                    
                    {/* Кнопки действий - компактные */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          // Открываем модальное окно для вывода
                          console.log('🔄 Нажата кнопка "Вывести" для предмета:', item);
                          console.log('📋 Текущие состояния до изменения:', { showWithdrawModal, itemToWithdraw });
                          
                          setItemToWithdraw(item);
                          setWithdrawalForm({
                            itemName: item.name || '',
                            telegramUsername: ''
                          });
                          setShowWithdrawModal(true);
                          
                          console.log('✅ Состояние обновлено, модальное окно должно появиться');
                          
                          // Проверяем через небольшую задержку
                          setTimeout(() => {
                            console.log('📋 Состояния после изменения:', { 
                              showWithdrawModal: true, // должно быть true
                              itemToWithdraw: item 
                            });
                          }, 100);
                        }}
                        className="inventory-button-shine flex-1 px-2 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                      >
                        📤
                      </button>
                      
                      <button
                        onClick={async () => {
                          // Продать предмет
                          console.log('🔄 Нажата кнопка "Продать" для предмета:', item);
                          setItemToSell(item);
                          setShowConfirmSell(true);
                        }}
                        className="inventory-button-shine flex-1 px-2 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white text-xs font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/25"
                      >
                        💰
                      </button>
                    </div>
                  </div>
                  
                  {/* Декоративные элементы - уменьшенные */}
                  <div className="absolute top-1 left-1 w-2 h-2 bg-white/10 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-white/5 rounded-full animate-pulse"></div>
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

      {/* Модальное окно для вывода предмета */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl p-6 max-w-md w-full border border-blue-500/30 shadow-2xl shadow-blue-500/20">
            <h3 className="text-xl font-bold text-white mb-4 text-center">
              📤 Запрос на вывод предмета
            </h3>
            
            {/* Информация о предмете */}
            {itemToWithdraw ? (
              <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-600/30">
                <div className="flex items-center space-x-3">
                  {itemToWithdraw.image_url || itemToWithdraw.image ? (
                    <img 
                      src={itemToWithdraw.image_url || itemToWithdraw.image} 
                      alt={itemToWithdraw.name}
                      className="w-12 h-12 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-white font-semibold">{itemToWithdraw.name}</h4>
                    <p className="text-green-400 text-sm">{itemToWithdraw.price}₴</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-600/30 text-center">
                <p className="text-gray-400">Предмет не выбран</p>
              </div>
            )}
            
            {/* Форма */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Название предмета
                </label>
                <input
                  type="text"
                  value={withdrawalForm.itemName}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, itemName: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="Введите название предмета"
                />
              </div>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Telegram username
                </label>
                <input
                  type="text"
                  value={withdrawalForm.telegramUsername}
                  onChange={(e) => setWithdrawalForm(prev => ({ ...prev, telegramUsername: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
                  placeholder="@username"
                />
                <p className="text-gray-400 text-xs mt-1">Укажите ваш Telegram для связи</p>
              </div>
            </div>
            
            {/* Кнопки */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowWithdrawModal(false);
                  setItemToWithdraw(null);
                  setWithdrawalForm({ itemName: '', telegramUsername: '' });
                }}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                disabled={withdrawalLoading}
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  if (!profile?.telegram_id || !itemToWithdraw?.id) return;
                  
                  if (!withdrawalForm.itemName.trim() || !withdrawalForm.telegramUsername.trim()) {
                    showError('Пожалуйста, заполните все поля');
                    return;
                  }
                  
                  const success = await createWithdrawalRequest(
                    profile.telegram_id,
                    itemToWithdraw.id,
                    withdrawalForm.itemName.trim(),
                    withdrawalForm.telegramUsername.trim()
                  );
                  
                  if (success) {
                    setShowWithdrawModal(false);
                    setShowWithdrawSuccess(true);
                    
                    // Обновляем инвентарь, чтобы предмет исчез из списка
                    await refreshItems();
                  }
                }}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={withdrawalLoading}
              >
                {withdrawalLoading ? 'Создание...' : 'Создать запрос'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно успешного создания запроса */}
      {showWithdrawSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 rounded-2xl p-6 max-w-md w-full border border-green-500/30 shadow-2xl shadow-green-500/20 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-4">
              Запрос создан!
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Ваш запрос на вывод предмета принят. Вы получите ответ в течение <strong className="text-green-400">72 часов</strong> с момента создания запроса.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.open('https://t.me/Vaultory_manager', '_blank')}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium"
              >
                📞 Поддержка Telegram
              </button>
              
              <button
                onClick={() => {
                  setShowWithdrawSuccess(false);
                  setItemToWithdraw(null);
                  setWithdrawalForm({ itemName: '', telegramUsername: '' });
                }}
                className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
