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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Плавающие частицы инвентаря */}
      <div className="inventory-floating-bg">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="inventory-particle"
            style={{
              left: `${(i * 10 + 5)}%`, // Фиксированные позиции
              width: `${8 + (i % 4) * 3}px`,
              height: `${8 + (i % 4) * 3}px`,
              animationDelay: `${i * 3}s`, // Фиксированные задержки
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden">
        {/* Морфирующий фон */}
        <div className="absolute inset-0 inventory-morphing-bg opacity-20"></div>
        
        {/* Декоративные элементы */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-green-400/15 to-emerald-500/15 rounded-full animate-pulse blur-3xl"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-blue-400/15 to-cyan-500/15 rounded-full animate-bounce blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/15 to-pink-500/15 rounded-full animate-spin blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-r from-yellow-400/15 to-orange-500/15 rounded-full animate-float blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Кнопка "Назад" с красивыми эффектами */}
          <div className="mb-8 animate-inventory-slide-in">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="group relative overflow-hidden px-6 py-3 bg-black/40 backdrop-blur-xl border border-green-500/30 text-green-300 hover:text-white transition-all duration-500 shadow-xl shadow-green-500/20 rounded-xl text-sm font-medium hover:scale-105 hover:shadow-2xl hover:shadow-green-500/40"
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Контент кнопки */}
              <div className="relative z-10 flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Назад</span>
              </div>
              
              {/* Блик */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Button>
          </div>
          
          {/* Заголовок с анимациями */}
          <div className="text-center animate-inventory-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="inline-flex items-center justify-center mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping mr-4"></div>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
              <div className="mx-8 relative">
                <h1 className="text-5xl md:text-6xl font-black text-white relative z-10 drop-shadow-lg">
                  <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent">
                    📦 Инвентарь
                  </span>
                </h1>
                {/* Подсветка заголовка */}
                <div className="absolute inset-0 text-5xl md:text-6xl font-black text-green-400/20 blur-sm">
                  📦 Инвентарь
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-l from-transparent via-green-400 to-transparent rounded-full"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-4"></div>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed opacity-90 mb-8">
              Ваши <span className="text-green-400 font-semibold">уникальные предметы</span>, полученные из кейсов. 
              Продавайте или выводите их для получения прибыли!
            </p>
            
            {/* Декоративная линия */}
            <div className="flex items-center justify-center">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent to-green-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full mx-4 animate-pulse"></div>
              <div className="w-32 h-0.5 bg-gradient-to-l from-transparent to-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12">
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-inventory-fade-in" style={{animationDelay: '0.4s'}}>
          {/* Общая стоимость */}
          <div className="inventory-card-3d bg-black/20 backdrop-blur-2xl rounded-3xl p-8 text-center relative overflow-hidden group border border-green-500/20 hover:border-green-500/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-400/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 border border-green-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-green-500/20">
                <DollarSign className="w-10 h-10 text-green-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Общая стоимость</h3>
              <div className="text-3xl sm:text-4xl font-black text-green-400 inventory-stats-counter mb-2 drop-shadow-lg">
                {formatNumber(parseFloat(totalValue.toFixed(2)))}₴
              </div>
              <div className="text-sm text-gray-400">Стоимость всех предметов</div>
            </div>
            
            {/* Эффект при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          </div>

          {/* Количество предметов */}
          <div className="inventory-card-3d bg-black/20 backdrop-blur-2xl rounded-3xl p-8 text-center relative overflow-hidden group border border-blue-500/20 hover:border-blue-500/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-blue-500/20">
                <Package className="w-10 h-10 text-blue-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Предметов</h3>
              <div className="text-3xl sm:text-4xl font-black text-blue-400 inventory-stats-counter mb-2 drop-shadow-lg">
                {displayItems.length}
              </div>
              <div className="text-sm text-gray-400">Уникальных предметов</div>
            </div>
            
            {/* Эффект при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          </div>

          {/* Любимый кейс */}
          <div className="inventory-card-3d bg-black/20 backdrop-blur-2xl rounded-3xl p-8 text-center relative overflow-hidden group border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-600/20 rounded-2xl flex items-center justify-center mb-6 border border-yellow-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-yellow-500/20">
                <Crown className="w-10 h-10 text-yellow-400 group-hover:animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Любимый кейс</h3>
              
              {favoriteCase ? (
                <>
                  {/* Фото кейса с эффектами */}
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-gray-800 border border-yellow-500/30 inventory-holographic group-hover:scale-105 transition-transform duration-300">
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
                  <div className="text-lg font-bold text-yellow-400 mb-2 drop-shadow-lg">{favoriteCase.case_name}</div>
                  <div className="text-sm text-gray-400">Открыто {favoriteCase.opened_count} раз</div>
                </>
              ) : (
                <div className="text-gray-400 font-medium">Нет данных</div>
              )}
            </div>
            
            {/* Эффект при наведении */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
          </div>
        </div>

        {/* Сетка предметов инвентаря */}
        <div className="space-y-8 animate-inventory-fade-in" style={{animationDelay: '0.6s'}}>
          {/* Красивый заголовок секции */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-blue-400 rounded-full"></div>
              <div className="mx-6 relative">
                <h3 className="text-2xl md:text-3xl font-bold text-white relative z-10">
                  <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                    🎒 Предметы в инвентаре
                  </span>
                </h3>
                {/* Подсветка */}
                <div className="absolute inset-0 text-2xl md:text-3xl font-bold text-blue-400/20 blur-sm">
                  🎒 Предметы в инвентаре
                </div>
              </div>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-blue-400 rounded-full"></div>
            </div>
            <div className="text-blue-300 font-medium">
              Найдено предметов: <span className="text-white font-bold">{displayItems.length}</span>
            </div>
          </div>
          
          {displayItems.length === 0 ? (
            <div className="text-center py-16 inventory-card-3d bg-black/20 backdrop-blur-2xl rounded-3xl border border-gray-600/30 relative overflow-hidden group">
              {/* Анимированный фон */}
              <div className="absolute inset-0 inventory-morphing-bg opacity-10"></div>
              
              {/* Плавающие частицы */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-gray-400/20 rounded-full animate-float"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.8}s`,
                      animationDuration: `${4 + i * 0.5}s`
                    }}
                  />
                ))}
              </div>
              
              {/* Контент */}
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-600/20 to-gray-800/20 rounded-2xl flex items-center justify-center border border-gray-500/30 group-hover:scale-110 transition-all duration-500">
                  <Package className="w-12 h-12 text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-3">Инвентарь пуст</h4>
                <p className="text-gray-400 text-lg mb-6 max-w-md mx-auto leading-relaxed">
                  Откройте кейсы, чтобы получить уникальные предметы и начать свою коллекцию!
                </p>
                
                {/* Кнопка */}
                <button
                  onClick={() => navigate('/cases')}
                  className="inventory-button-shine px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40"
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
    </div>
  );
};

export default Inventory;
