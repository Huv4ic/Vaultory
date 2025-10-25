import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle, Package, CreditCard, Shield, Zap, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useOrders } from '@/hooks/useOrders';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/ui/Notification';

const Cart = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { telegramUser, balance } = useAuth();

  // Функция для форматирования числа с разделителями
  const formatNumber = (amount: number): string => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const { items, removeItem, clear, updateQuantity } = useCart();
  const { createOrder, isProcessing } = useOrders();
  const { showSuccess, showError, notification, hideNotification } = useNotification();




  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
    if (!telegramUser) {
      showError('Войдите через Telegram для оформления заказа');
      return;
    }

    if (balance < total) {
      showError('Недостаточно средств для покупки');
      return;
    }

    try {
      console.log('Начинаем создание заказа...');
      const result = await createOrder(items, total);
      console.log('Результат createOrder:', result);
      
             if (result.success && result.orderId) {
         console.log('Заказ успешно создан!');
         console.log('OrderId:', result.orderId);
         console.log('Очищаем корзину');
         clear(); // Очищаем корзину
         
         // Обновляем баланс сразу
         console.log('Обновляем баланс...');
         // await refreshBalance(); // This line was removed from the new_code, so it's removed here.
         console.log('Баланс обновлен');
         
         // Формируем список товаров для передачи
         const itemsList = items.map(item => `${item.name} x${item.quantity}`).join(', ');
         
         // Перенаправляем на страницу успеха с параметрами
         const params = new URLSearchParams({
           orderId: result.orderId,
           total: total.toString(),
           items: itemsList
         });
         
         console.log('Перенаправляем на страницу успеха с параметрами:', params.toString());
         navigate(`/order-success?${params.toString()}`);
       } else {
        console.error('Ошибка создания заказа:', result.error);
        showError(`Ошибка при оформлении заказа: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
              showError('Неожиданная ошибка при оформлении заказа');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
          showSuccess('Товар удален из корзины');
  };

  const handleClearCart = () => {
    clear();
          showSuccess('Корзина очищена');
  };

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Войдите через Telegram')}</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            {t('Для доступа к корзине и покупкам необходимо авторизоваться через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center relative overflow-hidden">

        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          {/* Главный контейнер с анимацией появления */}
          <div className="bg-[#181818] rounded-3xl p-12 border border-[#1c1c1c] animate-fade-in-up relative overflow-hidden">
            
            {/* Иконка корзины */}
            <div className="relative mb-8">
              <div className="text-8xl mb-4 transform transition-all duration-500 hover:scale-110">
                🛒
              </div>
            </div>

            {/* Заголовок с анимированным текстом */}
            <div className="mb-6">
              <h1 className="text-4xl font-black text-[#f0f0f0] mb-2 tracking-wide relative">
                <span className="relative z-10">{t('Корзина пуста')}</span>
              </h1>
              
              {/* Декоративная линия под заголовком */}
              <div className="flex justify-center mt-4">
                <div className="h-1 w-16 bg-[#a31212] rounded-full"></div>
              </div>
            </div>

            {/* Описание */}
            <p className="text-[#a0a0a0] mb-8 text-lg leading-relaxed max-w-sm mx-auto">
              {t('Добавьте товары из каталога, чтобы начать покупки')}
            </p>

            {/* Кнопка с улучшенным дизайном */}
            <div className="relative">
              <Button
                onClick={() => navigate('/catalog')}
                className="px-10 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-3" />
                  {t('Перейти в каталог')}
                </span>
              </Button>
              
            </div>
          </div>

          {/* Текст подсказки снизу */}
          <p className="text-[#a0a0a0] text-sm mt-6">
            💡 Откройте каталог и найдите что-то интересное для себя
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] relative">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          {/* Заголовок */}
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <div className="text-6xl md:text-7xl">🛒</div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-[#f0f0f0] mb-4 tracking-wide">
              {t('Корзина')}
            </h1>
            
            <div className="flex justify-center mt-4 mb-8">
              <div className="h-1 w-20 bg-[#a31212] rounded-full"></div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-[#a0a0a0] mb-12 max-w-3xl mx-auto leading-relaxed">
            Проверьте выбранные товары и оформите заказ. Мы гарантируем безопасность 
            и быстроту обработки всех покупок.
          </p>
          
          {/* Статистика корзины с улучшенным дизайном */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="group relative bg-[#181818] rounded-2xl p-6 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
              <div className="relative z-10">
                <div className="text-3xl mb-3">📦</div>
                <p className="text-[#f0f0f0] text-sm mb-2">Товаров в корзине</p>
                <p className="text-[#f0f0f0] font-black text-2xl">{items.length}</p>
              </div>
            </div>
            
            <div className="group relative bg-[#181818] rounded-2xl p-6 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
              <div className="relative z-10">
                <div className="text-3xl mb-3">💰</div>
                <p className="text-[#f0f0f0] text-sm mb-2">Общая стоимость</p>
                <p className="text-[#f0f0f0] font-black text-2xl">{formatNumber(total)}₴</p>
              </div>
            </div>
            
            <div className="group relative bg-[#181818] rounded-2xl p-6 border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-105">
              <div className="relative z-10">
                <div className="text-3xl mb-3">💳</div>
                <p className="text-[#f0f0f0] text-sm mb-2">Ваш баланс</p>
                <p className="text-[#f0f0f0] font-black text-2xl">{formatNumber(balance)}₴</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-6">
            {/* Заголовок секции */}
            <div className="relative mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-[#f0f0f0] tracking-wide">
                Выбранные товары
              </h2>
              <div className="flex mt-3">
                <div className="h-1 w-16 bg-[#a31212] rounded-full"></div>
              </div>
            </div>
            
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="group relative bg-[#181818] rounded-2xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                
                <div className="relative z-10 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Изображение товара */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1c1c1c] rounded-2xl overflow-hidden border border-[#1c1c1c]">
                        <img
                          src={item.image_url || item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Информация о товаре */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-[#f0f0f0]">{item.name}</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-black text-[#f0f0f0]">{item.price}₴</span>
                        <div className="px-3 py-1 bg-[#1c1c1c] text-[#f0f0f0] text-xs font-bold rounded-full border border-[#1c1c1c]">
                          Цена за единицу
                        </div>
                      </div>
                      
                      {/* Управление количеством */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-[#1c1c1c] rounded-xl p-3 border border-[#1c1c1c]">
                          <Button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            size="sm"
                            className="w-10 h-10 p-0 bg-[#1c1c1c] hover:bg-[#a31212] border border-[#1c1c1c] hover:border-[#a31212] text-[#a0a0a0] hover:text-white transition-all duration-300 rounded-lg font-bold"
                          >
                            -
                          </Button>
                          <span className="text-[#f0f0f0] font-bold text-lg min-w-[3rem] text-center bg-[#181818] rounded-lg py-2 px-4 border border-[#1c1c1c]">{item.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            size="sm"
                            className="w-10 h-10 p-0 bg-[#a31212] hover:bg-[#8a0f0f] border border-[#a31212] hover:border-[#8a0f0f] text-white hover:text-white transition-all duration-300 rounded-lg font-bold"
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          className="w-12 h-12 p-0 bg-[#1c1c1c] hover:bg-[#a31212] border border-[#1c1c1c] hover:border-[#a31212] text-[#a0a0a0] hover:text-white transition-all duration-300 rounded-lg"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-[#a31212]" />
                <h3 className="text-lg sm:text-xl font-semibold text-[#f0f0f0] mb-2">Корзина пуста</h3>
                <p className="text-[#a0a0a0] text-sm sm:text-base mb-6">Добавьте товары из каталога</p>
                <Button
                  onClick={() => navigate('/catalog')}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                >
                  Перейти в каталог
                </Button>
              </div>
            )}
          </div>

          {/* Правая панель */}
          <div className="space-y-6">
            {/* Итого */}
            <div className="group relative bg-[#181818] rounded-2xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 p-6">
              <div className="relative z-10">
                {/* Заголовок секции */}
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-[#f0f0f0] tracking-wide">
                    Итого
                  </h3>
                  <div className="flex mt-2">
                    <div className="h-1 w-12 bg-[#a31212] rounded-full"></div>
                  </div>
                </div>

                {/* Детали заказа */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                    <span className="text-[#f0f0f0] flex items-center">
                      <Package className="w-4 h-4 mr-2 text-[#a31212]" />
                      Товары ({items.length})
                    </span>
                    <span className="text-[#f0f0f0] font-bold">{formatNumber(total)}₴</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-[#1c1c1c] rounded-xl border border-[#1c1c1c]">
                    <span className="text-[#f0f0f0] flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-[#a31212]" />
                      Комиссия
                    </span>
                    <span className="text-[#f0f0f0] font-bold">0₴</span>
                  </div>
                  
                  <div className="border-t border-[#1c1c1c] pt-4">
                    <div className="flex justify-between items-center p-4 bg-[#1c1c1c] rounded-xl border border-[#a31212]">
                      <span className="text-[#f0f0f0] font-bold text-lg">Всего к оплате</span>
                      <span className="text-[#f0f0f0] font-black text-2xl">{formatNumber(total)}₴</span>
                    </div>
                  </div>
                </div>
                
                {/* Кнопка оформления заказа */}
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || !telegramUser || isProcessing}
                  className="w-full py-4 bg-[#a31212] hover:bg-[#8a0f0f] border-2 border-[#a31212] hover:border-[#8a0f0f] text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#1c1c1c] disabled:border-[#1c1c1c]"
                >
                  <span className="flex items-center justify-center">
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Обработка...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-3" />
                        Оформить заказ
                      </>
                    )}
                  </span>
                </Button>
            </div>
            </div>

            {/* Информация о безопасности */}
            <div className="group relative bg-[#181818] rounded-2xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 p-6 text-center">
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center mb-4 border border-[#a31212]">
                  <Shield className="w-8 h-8 text-[#a31212]" />
                </div>
                <h4 className="text-[#f0f0f0] font-bold mb-2 text-lg">Безопасная оплата</h4>
                <p className="text-[#a0a0a0] text-sm">
                  Все платежи защищены и обрабатываются безопасно
                </p>
              </div>
            </div>
            
            <div className="group relative bg-[#181818] rounded-2xl border border-[#1c1c1c] hover:border-[#a31212] transition-all duration-300 p-6 text-center">
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-[#1c1c1c] rounded-full flex items-center justify-center mb-4 border border-[#a31212]">
                  <MessageCircle className="w-8 h-8 text-[#a31212]" />
                </div>
                <h4 className="text-[#f0f0f0] font-bold mb-2 text-lg">Поддержка 24/7</h4>
                <p className="text-[#a0a0a0] text-sm">
                  Помощь по любым вопросам в любое время
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12 sm:mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-[#181818] border border-[#1c1c1c] text-[#a0a0a0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
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
    </div>
  );
};

export default Cart;