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
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative overflow-hidden">
        {/* Анимированный фон с частицами */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-bounce"></div>
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/40 rounded-full animate-bounce delay-700"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/2 w-1 h-1 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 text-center max-w-lg mx-auto px-6">
          {/* Главный контейнер с анимацией появления */}
          <div className="bg-black/60 backdrop-blur-2xl rounded-3xl p-12 border border-white/10 shadow-2xl animate-fade-in-up relative overflow-hidden">
            
            {/* Декоративные элементы */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            {/* Анимированная иконка корзины */}
            <div className="relative mb-8">
              <div className="relative inline-block">
                {/* Основная иконка */}
                <div className="text-8xl mb-4 transform transition-all duration-500 hover:scale-110 animate-float">
                  🛒
                </div>
                {/* Светящийся эффект за иконкой */}
                <div className="absolute inset-0 text-8xl mb-4 blur-xl opacity-30 animate-pulse">
                  🛒
                </div>
              </div>
              
              {/* Декоративные кольца вокруг иконки */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/10 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white/5 rounded-full animate-spin-reverse"></div>
            </div>

            {/* Заголовок с анимированным текстом */}
            <div className="mb-6">
              <h1 className="text-4xl font-black text-white mb-2 tracking-wide relative">
                <span className="relative z-10">{t('Корзина пуста')}</span>
                {/* Подсветка текста */}
                <div className="absolute inset-0 text-4xl font-black text-blue-400/20 blur-sm animate-pulse">
                  {t('Корзина пуста')}
                </div>
              </h1>
              
              {/* Декоративная линия под заголовком */}
              <div className="flex justify-center mt-4">
                <div className="h-1 w-16 bg-white/20 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-slide-right"></div>
                </div>
              </div>
            </div>

            {/* Описание */}
            <p className="text-gray-300 mb-8 text-lg leading-relaxed max-w-sm mx-auto">
              {t('Добавьте товары из каталога, чтобы начать покупки')}
            </p>

            {/* Кнопка с улучшенным дизайном */}
            <div className="relative">
              <Button
                onClick={() => navigate('/catalog')}
                className="group relative px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg rounded-2xl transition-all duration-500 hover:scale-105 hover:border-white/40 hover:bg-white/20 shadow-2xl hover:shadow-white/10 overflow-hidden"
              >
                {/* Анимированный фон кнопки */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Светящийся эффект при hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                  {t('Перейти в каталог')}
                </span>
              </Button>
              
              {/* Дополнительное свечение под кнопкой */}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-sm"></div>
            </div>

            {/* Дополнительные декоративные элементы */}
            <div className="absolute top-6 right-6 w-3 h-3 bg-blue-400/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-6 w-2 h-2 bg-purple-400/30 rounded-full animate-ping delay-1000"></div>
          </div>

          {/* Текст подсказки снизу */}
          <p className="text-gray-500 text-sm mt-6 animate-fade-in-delayed">
            💡 Откройте каталог и найдите что-то интересное для себя
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🛒 {t('Корзина')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Проверьте выбранные товары и оформите заказ. Мы гарантируем безопасность 
            и быстроту обработки всех покупок.
          </p>
          
          {/* Статистика корзины */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">📦</div>
              <p className="text-gray-300 text-sm">Товаров в корзине</p>
              <p className="text-amber-400 font-bold text-lg">{items.length}</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-gray-300 text-sm">Общая стоимость</p>
              <p className="text-amber-400 font-bold text-lg">{formatNumber(total)}₴</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-gray-300 text-sm">Ваш баланс</p>
              <p className="text-amber-400 font-bold text-lg">{formatNumber(balance)}₴</p>
            </div>
          </div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Выбранные товары</h2>
            
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 hover:shadow-amber-500/40 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  {/* Изображение товара */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-lg sm:rounded-xl overflow-hidden border border-amber-500/30">
                    <img
                      src={item.image_url || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1 sm:mb-2">{item.name}</h3>
                    <p className="text-lg sm:text-xl font-bold text-amber-400 mb-2 sm:mb-3">{item.price}₴</p>
                    
                    {/* Управление количеством */}
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 border border-red-500/30 text-white hover:text-red-100 transition-all duration-300 rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105"
                      >
                        -
                      </Button>
                      <span className="text-white font-semibold min-w-[2rem] text-center text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        size="sm"
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 bg-gradient-to-r from-red-600 to-purple-700 hover:from-red-700 hover:to-purple-800 border border-red-500/30 text-white hover:text-red-100 transition-all duration-300 rounded-lg shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105"
                      >
                        +
                      </Button>
                      <Button
                        onClick={() => removeItem(item.id)}
                        size="sm"
                        variant="outline"
                        className="w-8 h-8 sm:w-10 sm:h-10 p-0 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-400 hover:text-red-300 transition-all duration-300 ml-2 sm:ml-3"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {items.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">Корзина пуста</h3>
                <p className="text-gray-500 text-sm sm:text-base mb-6">Добавьте товары из каталога</p>
                <Button
                  onClick={() => navigate('/catalog')}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base"
                >
                  Перейти в каталог
                </Button>
              </div>
            )}
          </div>

          {/* Правая панель */}
          <div className="space-y-4 sm:space-y-6">
            {/* Итого */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Итого</h3>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-300">Товары ({items.length})</span>
                  <span className="text-white">{formatNumber(total)}₴</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-300">Комиссия</span>
                  <span className="text-white">0₴</span>
                </div>
                <div className="border-t border-amber-500/30 pt-2 sm:pt-3">
                  <div className="flex justify-between text-lg sm:text-xl font-bold">
                    <span className="text-white">Всего к оплате</span>
                    <span className="text-amber-400">{formatNumber(total)}₴</span>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                disabled={items.length === 0 || !telegramUser || isProcessing}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Обработка...
                  </div>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Оформить заказ
                  </>
                )}
              </Button>
            </div>

            {/* Информация о безопасности */}
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Безопасная оплата</h4>
              <p className="text-gray-300 text-xs sm:text-sm">
                Все платежи защищены и обрабатываются безопасно
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold mb-2 text-sm sm:text-base">Поддержка 24/7</h4>
              <p className="text-gray-300 text-xs sm:text-sm">
                Помощь по любым вопросам в любое время
              </p>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12 sm:mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
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