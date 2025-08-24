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
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent animate-pulse">
            🎉 Заказ успешно оформлен!
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Спасибо за покупку! Ваш заказ был успешно обработан и подтвержден.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-emerald-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Карточка заказа */}
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl md:rounded-3xl border border-green-500/30 shadow-2xl shadow-green-500/20 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-4 border-green-500/30">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Детали заказа</h2>
              <p className="text-gray-400 text-sm sm:text-base">Вся информация о вашей покупке</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Номер заказа */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-500/20 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-sm sm:text-base font-semibold text-white">Номер заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-green-400">{orderInfo.orderId}</p>
              </div>

              {/* Сумма заказа */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-500/20 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-sm sm:text-base font-semibold text-white">Сумма заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-green-400">{orderInfo.total}₴</p>
              </div>

              {/* Дата заказа */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-500/20 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-sm sm:text-base font-semibold text-white">Дата заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-green-400">{orderInfo.date}</p>
              </div>

              {/* Время заказа */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-500/20 p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                  <span className="text-sm sm:text-base font-semibold text-white">Время заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-green-400">{orderInfo.time}</p>
              </div>
            </div>

            {/* Информация о товарах */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-500/20 p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-sm sm:text-base font-semibold text-white">Товары в заказе</span>
              </div>
              <p className="text-sm sm:text-base text-gray-300">{orderInfo.items}</p>
            </div>

            {/* Контактная информация */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-blue-500/20 p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  Для выдачи товара обратитесь к администратору
                </h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4">
                  Наша служба поддержки готова помочь с любыми вопросами
                </p>
                <Button
                  onClick={() => window.open('https://t.me/Vaultory_manager', '_blank')}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-blue-500/30 text-sm sm:text-base"
                >
                  💬 Написать администратору
                </Button>
                
                <p className="text-blue-300 text-xs sm:text-sm mt-3 sm:mt-4">
                  Нажмите кнопку выше для быстрого перехода в чат
                </p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => navigate('/catalog')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30"
            >
              🛍️ Продолжить покупки
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-black/60 backdrop-blur-sm border border-amber-500/40 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 hover:text-amber-200 transition-all duration-300 shadow-lg shadow-amber-500/20 rounded-lg sm:rounded-xl text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
