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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-bounce"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/2 w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          {/* Заголовок с анимированной иконкой */}
          <div className="mb-8">
            <div className="relative inline-block mb-6">
              <div className="text-6xl md:text-7xl animate-float">🛒</div>
              <div className="absolute inset-0 text-6xl md:text-7xl blur-xl opacity-20 animate-pulse">🛒</div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-wide relative">
              <span className="relative z-10">{t('Корзина')}</span>
              <div className="absolute inset-0 text-4xl md:text-5xl font-black text-orange-400/20 blur-sm animate-pulse">
                {t('Корзина')}
              </div>
            </h1>
            
            <div className="flex justify-center mt-4 mb-8">
              <div className="h-1 w-20 bg-white/20 rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-slide-right"></div>
              </div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Проверьте выбранные товары и оформите заказ. Мы гарантируем безопасность 
            и быстроту обработки всех покупок.
          </p>
          
          {/* Статистика корзины с улучшенным дизайном */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 hover:scale-105 animate-fade-in-up">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">📦</div>
                <p className="text-gray-300 text-sm mb-2">Товаров в корзине</p>
                <p className="text-orange-400 font-black text-2xl">{items.length}</p>
              </div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-orange-400/40 rounded-full animate-ping"></div>
            </div>
            
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-200">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">💰</div>
                <p className="text-gray-300 text-sm mb-2">Общая стоимость</p>
                <p className="text-yellow-400 font-black text-2xl">{formatNumber(total)}₴</p>
              </div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-yellow-400/40 rounded-full animate-ping delay-500"></div>
            </div>
            
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 hover:scale-105 animate-fade-in-up delay-400">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-300">💳</div>
                <p className="text-gray-300 text-sm mb-2">Ваш баланс</p>
                <p className="text-green-400 font-black text-2xl">{formatNumber(balance)}₴</p>
              </div>
              <div className="absolute top-3 left-3 w-2 h-2 bg-green-400/40 rounded-full animate-ping delay-1000"></div>
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
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide relative">
                <span className="relative z-10">Выбранные товары</span>
                <div className="absolute inset-0 text-2xl sm:text-3xl font-black text-blue-400/20 blur-sm animate-pulse">
                  Выбранные товары
                </div>
              </h2>
              <div className="flex mt-3">
                <div className="h-1 w-16 bg-white/20 rounded-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-slide-right"></div>
                </div>
              </div>
            </div>
            
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Светящийся эффект при hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    {/* Изображение товара с эффектами */}
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl overflow-hidden border border-white/20 shadow-lg relative group-hover:shadow-blue-500/30 transition-all duration-300">
                        <img
                          src={item.image_url || item.image || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        {/* Голографический эффект */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                      </div>
                      {/* Декоративное кольцо */}
                      <div className="absolute -inset-1 border border-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    {/* Информация о товаре */}
                    <div className="flex-1 space-y-3">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">{item.name}</h3>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl font-black text-yellow-400">{item.price}₴</span>
                        <div className="px-3 py-1 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full border border-yellow-400/30">
                          Цена за единицу
                        </div>
                      </div>
                      
                      {/* Управление количеством с улучшенным дизайном */}
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-2 border border-white/10">
                          <Button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            size="sm"
                            className="w-10 h-10 p-0 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 transition-all duration-300 rounded-xl shadow-lg hover:shadow-red-500/20 hover:scale-110"
                          >
                            -
                          </Button>
                          <span className="text-white font-bold text-lg min-w-[3rem] text-center bg-white/10 rounded-lg py-1 px-3">{item.quantity}</span>
                          <Button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            size="sm"
                            className="w-10 h-10 p-0 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 hover:border-green-400 text-green-400 hover:text-green-300 transition-all duration-300 rounded-xl shadow-lg hover:shadow-green-500/20 hover:scale-110"
                          >
                            +
                          </Button>
                        </div>
                        
                        <Button
                          onClick={() => removeItem(item.id)}
                          size="sm"
                          className="w-12 h-12 p-0 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-400 text-red-400 hover:text-red-300 transition-all duration-300 rounded-xl shadow-lg hover:shadow-red-500/30 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Декоративные элементы */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/40 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping delay-500"></div>
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
          <div className="space-y-6">
            {/* Итого */}
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl hover:shadow-green-500/20 transition-all duration-500 p-6 overflow-hidden animate-fade-in-up">
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Заголовок секции */}
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-white tracking-wide relative">
                    <span className="relative z-10">Итого</span>
                    <div className="absolute inset-0 text-2xl font-black text-green-400/20 blur-sm animate-pulse">
                      Итого
                    </div>
                  </h3>
                  <div className="flex mt-2">
                    <div className="h-1 w-12 bg-white/20 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-slide-right"></div>
                    </div>
                  </div>
                </div>

                {/* Детали заказа */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-300 flex items-center">
                      <Package className="w-4 h-4 mr-2 text-blue-400" />
                      Товары ({items.length})
                    </span>
                    <span className="text-white font-bold">{formatNumber(total)}₴</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/10">
                    <span className="text-gray-300 flex items-center">
                      <CreditCard className="w-4 h-4 mr-2 text-green-400" />
                      Комиссия
                    </span>
                    <span className="text-green-400 font-bold">0₴</span>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                      <span className="text-white font-bold text-lg">Всего к оплате</span>
                      <span className="text-green-400 font-black text-2xl">{formatNumber(total)}₴</span>
                    </div>
                  </div>
                </div>
                
                {/* Кнопка оформления заказа */}
                <Button
                  onClick={handleCheckout}
                  disabled={items.length === 0 || !telegramUser || isProcessing}
                  className="group relative w-full py-4 bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white font-bold text-lg rounded-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/40 hover:bg-white/20 shadow-2xl hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Анимированный фон кнопки */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Светящийся эффект при hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:translate-x-full"></div>
                
                <span className="relative z-10 flex items-center justify-center">
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Обработка...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110" />
                      Оформить заказ
                    </>
                  )}
                </span>
              </Button>
              
              {/* Декоративные элементы */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-green-400/40 rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-ping delay-700"></div>
            </div>
            </div>

            {/* Информация о безопасности с улучшенным дизайном */}
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 p-6 text-center animate-fade-in-up delay-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
                  <Shield className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-white font-bold mb-2 text-lg">Безопасная оплата</h4>
                <p className="text-gray-300 text-sm">
                  Все платежи защищены и обрабатываются безопасно
                </p>
              </div>
              <div className="absolute top-3 right-3 w-2 h-2 bg-purple-400/40 rounded-full animate-ping"></div>
            </div>
            
            <div className="group relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 p-6 text-center animate-fade-in-up delay-500 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-white/20 shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300">
                  <MessageCircle className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h4 className="text-white font-bold mb-2 text-lg">Поддержка 24/7</h4>
                <p className="text-gray-300 text-sm">
                  Помощь по любым вопросам в любое время
                </p>
              </div>
              <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping delay-300"></div>
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