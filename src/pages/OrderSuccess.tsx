import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, Clock, Package, CreditCard, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { telegramUser } = useAuth();
  
  const [orderInfo, setOrderInfo] = useState({
    orderId: searchParams.get('orderId') || '',
    total: searchParams.get('total') || '',
    items: searchParams.get('items') || '',
    date: new Date().toLocaleDateString('ru-RU'),
    time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  });

  useEffect(() => {
    // Если нет orderId, перенаправляем на главную
    if (!orderInfo.orderId) {
      navigate('/');
    }
  }, [orderInfo.orderId, navigate]);

  if (!telegramUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-amber-500/30 shadow-2xl shadow-amber-500/20">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-white mb-4">Доступ запрещен</h1>
          <p className="text-gray-300 mb-6">Эта страница доступна только авторизованным пользователям</p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
          >
            Войти в аккаунт
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
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            Заказ успешно оформлен!
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Спасибо за покупку! Ваш заказ принят в обработку. 
            Свяжитесь с администратором для получения товара.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Карточка заказа */}
          <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-green-500/30 shadow-2xl shadow-green-500/20 p-8 mb-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-500/30">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Детали заказа</h2>
              <p className="text-gray-400">Вся информация о вашей покупке</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Номер заказа */}
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Package className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-semibold text-lg">Номер заказа</h3>
                </div>
                <p className="text-white font-mono text-lg break-all bg-gray-800/50 p-3 rounded-xl border border-green-500/20">
                  {orderInfo.orderId}
                </p>
              </div>

              {/* Сумма заказа */}
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <CreditCard className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-semibold text-lg">Сумма заказа</h3>
                </div>
                <p className="text-white font-bold text-2xl text-center">
                  {orderInfo.total}₴
                </p>
              </div>

              {/* Дата заказа */}
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-semibold text-lg">Дата заказа</h3>
                </div>
                <p className="text-white font-semibold text-xl text-center">
                  {orderInfo.date}
                </p>
              </div>

              {/* Время заказа */}
              <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="w-6 h-6 text-green-400" />
                  <h3 className="text-green-400 font-semibold text-lg">Время заказа</h3>
                </div>
                <p className="text-white font-semibold text-xl text-center">
                  {orderInfo.time}
                </p>
              </div>
            </div>

            {/* Информация о товарах */}
            <div className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 rounded-2xl p-6 border border-gray-600/30 mb-8">
              <h3 className="text-green-400 font-semibold text-xl mb-4 text-center">Купленные товары</h3>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-green-500/20">
                <p className="text-white text-center font-medium">
                  {orderInfo.items || 'Информация о товарах загружается...'}
                </p>
              </div>
            </div>

            {/* Telegram секция */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              
              <h3 className="text-blue-300 text-2xl font-bold mb-4">
                Свяжитесь с администратором
              </h3>
              
              <p className="text-blue-200 text-lg mb-6 max-w-2xl mx-auto">
                Для получения заказа свяжитесь с нами через Telegram. 
                Укажите номер заказа и мы быстро обработаем ваш запрос.
              </p>
              
              <Button
                onClick={() => window.open('https://t.me/Vaultory_manager', '_blank')}
                className="px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-xl rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-4 shadow-2xl shadow-blue-500/25 mx-auto"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span>🚀 Открыть Telegram</span>
              </Button>
              
              <p className="text-blue-300 text-sm mt-4">
                Нажмите кнопку выше для быстрого перехода в чат
              </p>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/catalog')}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
            >
              🛍️ Продолжить покупки
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-8 py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
