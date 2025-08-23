import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle, Package, CreditCard, Shield, Zap, MessageCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { useOrders } from '@/hooks/useOrders';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, clear, updateQuantity } = useCart();
  const { telegramUser, balance, refreshBalance } = useAuth();
  const { t } = useLanguage();
  const { createOrder, isProcessing } = useOrders();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  // Отладка состояния модала
  console.log('Cart render - showSuccessModal:', showSuccessModal, 'orderId:', orderId);

  // Отслеживаем изменения состояния модала
  useEffect(() => {
    console.log('useEffect - showSuccessModal изменился:', showSuccessModal);
  }, [showSuccessModal]);

  useEffect(() => {
    console.log('useEffect - orderId изменился:', orderId);
  }, [orderId]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (!telegramUser) {
      alert('Войдите через Telegram для оформления заказа');
      return;
    }

    if (balance < total) {
      alert('Недостаточно средств для покупки');
      return;
    }

    try {
      const result = await createOrder(items, total);
      
      if (result.success && result.orderId) {
        console.log('Заказ успешно создан:', result.orderId);
        console.log('Устанавливаем orderId:', result.orderId);
        setOrderId(result.orderId);
        console.log('Устанавливаем showSuccessModal в true');
        setShowSuccessModal(true);
        console.log('Очищаем корзину');
        clear(); // Очищаем корзину
        
        // Обновляем баланс сразу
        console.log('Обновляем баланс');
        refreshBalance();
        
        console.log('Состояние после обновления:', { orderId: result.orderId, showSuccessModal: true });
      } else {
        console.error('Ошибка создания заказа:', result.error);
        alert(`Ошибка при оформлении заказа: ${result.error}`);
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      alert('Неожиданная ошибка при оформлении заказа');
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    alert('Товар удален из корзины');
  };

  const handleClearCart = () => {
    clear();
    alert('Корзина очищена');
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Корзина пуста')}</h1>
          <p className="text-gray-300 mb-6 max-w-md">
            {t('Добавьте товары из каталога, чтобы начать покупки')}
          </p>
          <Button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Перейти в каталог')}
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
              <p className="text-amber-400 font-bold text-lg">{total}₴</p>
            </div>
            <div className="text-center p-4 bg-black/40 backdrop-blur-sm rounded-xl border border-amber-500/20">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-gray-300 text-sm">Ваш баланс</p>
              <p className="text-amber-400 font-bold text-lg">{balance}₴</p>
            </div>
          </div>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Выбранные товары</h2>
            
            {items.map((item, index) => (
              <div 
                key={item.id}
                className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 hover:shadow-amber-500/40 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Изображение товара */}
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <img
                      src={item.image_url || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  
                  {/* Информация о товаре */}
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-2">{item.name}</h3>
                    <div className="flex items-center space-x-4 text-gray-300">
                      <span>Цена: <span className="text-amber-400 font-bold">{item.price}₴</span></span>
                      <span>Количество: <span className="text-amber-400 font-bold">{item.quantity}</span></span>
                    </div>
                  </div>
                  
                  {/* Действия */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="text-xl font-bold text-amber-400">
                      {item.price * item.quantity}₴
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="w-8 h-8 p-0 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 rounded-lg"
                      >
                        -
                      </Button>
                      <span className="text-white font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 p-0 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 rounded-lg"
                      >
                        +
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(item.id)}
                      className="bg-black/60 backdrop-blur-sm border border-red-500/40 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 transition-all duration-300 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Кнопки управления корзиной */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleClearCart}
                variant="outline"
                className="px-6 py-3 bg-black/60 backdrop-blur-sm border border-red-500/40 text-red-300 hover:bg-red-500/20 hover:border-red-400 hover:text-red-200 transition-all duration-300 shadow-lg shadow-red-500/20 rounded-xl"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Очистить корзину
              </Button>
              
              <Button
                onClick={() => navigate('/catalog')}
                variant="outline"
                className="px-6 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Продолжить покупки
              </Button>
            </div>
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-amber-400" />
                  Итого заказа
                </h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Товаров:</span>
                    <span className="text-white font-medium">{items.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Стоимость:</span>
                    <span className="text-amber-400 font-bold">{total}₴</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ваш баланс:</span>
                    <span className={`font-bold ${balance >= total ? 'text-green-400' : 'text-red-400'}`}>
                      {balance}₴
                    </span>
                  </div>
                  
                  {balance < total && (
                    <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm text-center">
                        Недостаточно средств для покупки
                      </p>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || balance < total}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30 disabled:shadow-none disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Обработка...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Оформить заказ
                    </>
                  )}
                </Button>
                
                {/* Информация о безопасности */}
                <div className="mt-6 p-4 bg-black/30 backdrop-blur-sm rounded-lg border border-amber-500/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Безопасная покупка</span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    Все платежи защищены современными технологиями шифрования
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <Package className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Быстрая доставка</h4>
              <p className="text-gray-300 text-sm">
                Товары доставляются мгновенно после оплаты
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Гарантия качества</h4>
              <p className="text-gray-300 text-sm">
                Все товары официальные и лицензированные
              </p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 border border-amber-500/30">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Поддержка 24/7</h4>
              <p className="text-gray-300 text-sm">
                Помощь по любым вопросам в любое время
              </p>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-16">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>


               {/* Простой тестовый модал */}
        {showSuccessModal && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <div 
              style={{
                backgroundColor: '#1f2937',
                border: '2px solid #f59e0b',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center'
              }}
            >
              <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '20px' }}>
                🎉 Заказ оформлен!
              </h2>
              
              <p style={{ color: '#d1d5db', marginBottom: '20px' }}>
                Номер заказа: <strong style={{ color: '#f59e0b' }}>{orderId}</strong>
              </p>
              
              <p style={{ color: '#f59e0b', marginBottom: '20px' }}>
                Свяжитесь с администратором через Telegram для получения товаров
              </p>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/profile');
                  }}
                  style={{
                    backgroundColor: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  В профиль
                </button>
                
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/');
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#f59e0b',
                    border: '2px solid #f59e0b',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  На главную
                </button>
              </div>
            </div>
          </div>
        )}
     </div>
   );
 };

export default Cart;