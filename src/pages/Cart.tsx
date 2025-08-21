import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Package,
  AlertCircle,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const navigate = useNavigate();
  const { telegramUser, profile, balance, setBalance, refreshProfile } = useAuth();
  const { items, removeItem, updateQuantity, clear, total } = useCart();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  // Убираем автоматическое обновление профиля - баланс не должен обновляться просто при просмотре корзины
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);

  const handleQuantityChange = (id: string, change: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    
    const newQuantity = Math.max(1, item.quantity + change);
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
    toast({
      title: "Товар удален",
      description: "Товар был удален из корзины",
    });
  };

  const handleClearCart = () => {
    clear();
    toast({
      title: "Корзина очищена",
      description: "Все товары были удалены из корзины",
    });
  };

  const handleCheckout = async () => {
    if (!telegramUser) {
      toast({
        title: 'Требуется авторизация',
        description: 'Войдите через Telegram для оформления заказа',
      });
      return;
    }

    if (balance < total) {
              toast({
          title: t("Недостаточно средств"),
          description: `${t("Для покупки нужно")} ${total}₴, ${t("у вас")} ${balance}₴`,
        });
      return;
    }

    setIsProcessing(true);
    try {
      // Списываем средства с баланса
      const newBalance = balance - total;
      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', telegramUser.id);

      if (balanceError) throw balanceError;

      // Обновляем локальное состояние
      setBalance(newBalance);
      await refreshProfile();
      
      // Очищаем корзину
      clear();
      
              toast({
          title: t("Заказ оформлен!"),
          description: `${t("Спасибо за покупку! С вашего баланса списано")} ${total}₴`,
        });
      navigate('/catalog');
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
              toast({
          title: t("Ошибка при оформлении заказа"),
          description: t("Произошла ошибка при оформлении заказа"),
        });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
        <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
          <User className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">{t("Войдите через Telegram")}</h1>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          {t("Для доступа к корзине и покупкам необходимо авторизоваться через Telegram")}
        </p>
        {/* Можно вставить Telegram Login Widget или ссылку на профиль */}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{t("Корзина пуста")}</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {t("Добавьте товары из каталога, чтобы начать покупки")}
            </p>
            <Link to="/catalog">
              <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none">
                <Package className="w-4 h-4 mr-2" />
                {t("Перейти в каталог")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/catalog">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-lg bg-gray-700/70 text-gray-200 hover:text-white hover:ring-2 hover:ring-purple-400/60 hover:bg-gradient-to-br hover:from-gray-700 hover:to-purple-900 transition-all duration-200 shadow-md px-4 py-2 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
                             <h1 className="text-3xl font-bold text-white">{t("Корзина")}</h1>
               <p className="text-gray-400">{items.length} товар(ов)</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleClearCart}
            className="rounded-lg bg-gray-700/70 text-red-300 hover:text-white hover:ring-2 hover:ring-pink-400/60 hover:bg-gradient-to-br hover:from-gray-700 hover:to-pink-900 transition-all duration-200 shadow-md px-4 py-2 flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("Очистить корзину")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Список товаров */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 hover:border-red-500/50 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  {/* Изображение */}
                  <div className="flex-shrink-0">
                    <img
                      src={item.image_url || item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg bg-gray-700"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {t("Цена за единицу")}: {item.price}₴
                    </p>
                    
                    {/* Управление количеством */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="rounded-full bg-gray-700/70 text-purple-300 hover:text-white hover:ring-2 hover:ring-pink-400/60 hover:bg-gradient-to-br hover:from-gray-700 hover:to-purple-900 transition-all duration-200 shadow-md w-9 h-9 flex items-center justify-center p-0"
                        >
                          <Minus className="w-5 h-5" />
                        </Button>
                        <span className="w-8 text-center text-white font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="rounded-full bg-gray-700/70 text-purple-300 hover:text-white hover:ring-2 hover:ring-pink-400/60 hover:bg-gradient-to-br hover:from-gray-700 hover:to-purple-900 transition-all duration-200 shadow-md w-9 h-9 flex items-center justify-center p-0"
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Сумма по товару */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-white font-bold text-lg">
                      {item.price * item.quantity}₴
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-gray-400 text-sm">
                        {item.quantity} × {item.price}₴
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white rounded-2xl shadow-2xl p-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-4">{t("Корзина")}</div>
                <div className="flex items-center justify-center bg-gradient-to-r from-red-500 to-purple-600 text-white font-bold text-lg px-4 py-2 rounded-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                  </svg>
                  {t("Баланс")}: <span className="ml-2">{balance}₴</span>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-lg font-semibold mb-2">{t("Сумма к оплате")}:</div>
                <div className="text-2xl font-bold text-white">{total}₴</div>
              </div>
              {balance < total && (
                <div className="mb-4 text-red-200 font-bold text-center text-sm">{t("Недостаточно средств для оплаты заказа")}</div>
              )}
              <button
                className={`w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200 ${balance < total ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCheckout}
                disabled={balance < total}
              >
                {t("Оформить заказ")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 