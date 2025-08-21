import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, clear, updateQuantity } = useCart();
  const { telegramUser, balance } = useAuth();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре корзины
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

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

    setIsProcessing(true);
    
    try {
      // Здесь должна быть логика оформления заказа
      await new Promise(resolve => setTimeout(resolve, 2000)); // Имитация API вызова
      
      alert('Заказ успешно оформлен!');
      clear();
      navigate('/');
    } catch (error) {
      alert('Ошибка при оформлении заказа');
    } finally {
      setIsProcessing(false);
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
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Войдите через Telegram')}</h1>
          <p className="text-white/80 mb-6 max-w-md">
            {t('Для доступа к корзине и покупкам необходимо авторизоваться через Telegram')}
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Войти в аккаунт')}
          </Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700 flex items-center justify-center">
        <div className="text-center bg-black/20 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🛒</div>
          <h1 className="text-3xl font-bold text-white mb-4">{t('Корзина пуста')}</h1>
          <p className="text-white/80 mb-6 max-w-md">
            {t('Добавьте товары из каталога, чтобы начать покупки')}
          </p>
          <Button
            onClick={() => navigate('/catalog')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            {t('Перейти в каталог')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            🛒 {t('Корзина')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Проверьте выбранные товары и оформите заказ
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-amber-400" />
                  Товары в корзине ({items.length})
                </h2>
                <Button
                  onClick={handleClearCart}
                  variant="outline"
                  size="sm"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Очистить корзину
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Изображение */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || '/placeholder.svg'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-semibold text-lg mb-2 truncate">
                          {item.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-amber-400 font-bold text-xl">
                              {item.price}₴
                            </span>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="w-8 h-8 p-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              >
                                -
                              </Button>
                              <span className="text-white font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleRemoveItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-amber-500/30 shadow-2xl shadow-amber-500/20 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-emerald-400" />
                Итоги заказа
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white/80">
                  <span>Товары ({items.length}):</span>
                  <span>{total}₴</span>
                </div>
                <div className="flex justify-between text-white/80">
                  <span>Комиссия:</span>
                  <span>0₴</span>
                </div>
                <div className="border-t border-amber-500/30 pt-4">
                  <div className="flex justify-between text-white font-bold text-xl">
                    <span>Итого:</span>
                    <span className="text-amber-400">{total}₴</span>
                  </div>
                </div>
              </div>

              {/* Информация о балансе */}
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-4 mb-6 border border-amber-500/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white/80">Ваш баланс:</span>
                  <span className="text-emerald-400 font-bold">{balance}₴</span>
                </div>
                {balance < total && (
                  <div className="text-red-400 text-sm">
                    {t('Недостаточно средств')}. {t('Для покупки нужно')} {total - balance}₴ {t('у вас')} {balance}₴
                  </div>
                )}
              </div>

              {/* Кнопки действий */}
              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  disabled={isProcessing || balance < total}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Оформление...
                    </div>
                  ) : (
                    `Оформить заказ за ${total}₴`
                  )}
                </Button>
                 <Button
                   onClick={() => navigate('/catalog')}
                   variant="outline"
                   className="w-full py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                 >
                   <ArrowLeft className="w-4 h-4 mr-2" />
                   Продолжить покупки
                 </Button>
               </div>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };

 export default Cart;