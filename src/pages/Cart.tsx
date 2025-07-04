import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  CreditCard,
  Package,
  AlertCircle,
  User,
  DollarSign
} from 'lucide-react';

const Cart = () => {
  const { items, removeItem, updateQuantity, clear, total } = useCart();
  const { balance, setBalance, telegramUser } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

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
        title: "Требуется авторизация",
        description: "Войдите через Telegram для оформления заказа",
      });
      return;
    }

    if (balance < total) {
      toast({
        title: "Недостаточно средств",
        description: `Для покупки нужно ${total}₽, у вас ${balance}₽`,
      });
      return;
    }

    setIsProcessing(true);
    
    // Имитация процесса оплаты
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Списываем баланс
    setBalance(balance - total);
    clear();
    setIsProcessing(false);
    
    toast({
      title: "Заказ оформлен!",
      description: `Спасибо за покупку! С вашего баланса списано ${total}₽`,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">Корзина пуста</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Добавьте товары из каталога, чтобы начать покупки
            </p>
            <Link to="/catalog">
              <Button className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none">
                <Package className="w-4 h-4 mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/catalog">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:border-red-500 hover:text-red-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Корзина</h1>
              <p className="text-gray-400">{items.length} товар(ов)</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Очистить корзину
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
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Информация о товаре */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      Цена за единицу: {item.price}₽
                    </p>
                    
                    {/* Управление количеством */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, -1)}
                          disabled={item.quantity <= 1}
                          className="h-8 w-8 p-0 text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-white font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="h-8 w-8 p-0 text-gray-300 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <Plus className="w-3 h-3" />
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
                      {item.price * item.quantity}₽
                    </div>
                    {item.quantity > 1 && (
                      <div className="text-gray-400 text-sm">
                        {item.quantity} × {item.price}₽
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Итоговая информация */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Итого</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Товары ({items.length})</span>
                  <span>{total}₽</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Доставка</span>
                  <span className="text-green-400">Бесплатно</span>
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>К оплате</span>
                    <span>{total}₽</span>
                  </div>
                </div>
                
                {telegramUser && (
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-3 border border-green-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Ваш баланс:</span>
                      <span className={`font-bold ${balance >= total ? 'text-green-400' : 'text-red-400'}`}>
                        {balance}₽
                      </span>
                    </div>
                    {balance < total && (
                      <div className="text-red-400 text-xs mt-1">
                        Недостаточно средств. Нужно еще {total - balance}₽
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isProcessing || !telegramUser || balance < total}
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 border-none text-lg py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Обработка...
                  </div>
                ) : !telegramUser ? (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    Войти для покупки
                  </>
                ) : balance < total ? (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Недостаточно средств
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Оформить заказ
                  </>
                )}
              </Button>

              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Безопасная оплата</p>
                    <p className="text-xs">Ваши данные защищены современными технологиями шифрования</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart; 