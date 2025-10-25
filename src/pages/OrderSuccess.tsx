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
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center">
        <div className="text-center bg-[#181818] rounded-2xl p-8 border border-[#1c1c1c]">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-[#f0f0f0] mb-4">Доступ запрещен</h1>
          <p className="text-[#a0a0a0] mb-6">Эта страница доступна только авторизованным пользователям</p>
          <Button
            onClick={() => navigate('/auth')}
            className="px-8 py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-lg rounded-xl transition-all duration-300"
          >
            Войти в аккаунт
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#f0f0f0]">
            🎉 Заказ успешно оформлен!
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Спасибо за покупку! Ваш заказ был успешно обработан и подтвержден.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-4xl mx-auto">
          {/* Карточка заказа */}
          <div className="bg-[#181818] rounded-xl sm:rounded-2xl md:rounded-3xl border border-[#1c1c1c] p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#a31212] rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 border-4 border-[#a31212]/30">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f0f0f0] mb-2">Детали заказа</h2>
              <p className="text-[#a0a0a0] text-sm sm:text-base">Вся информация о вашей покупке</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Номер заказа */}
              <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#a31212]" />
                  <span className="text-sm sm:text-base font-semibold text-[#f0f0f0]">Номер заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[#f0f0f0]">{orderInfo.orderId}</p>
              </div>

              {/* Сумма заказа */}
              <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#a31212]" />
                  <span className="text-sm sm:text-base font-semibold text-[#f0f0f0]">Сумма заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[#f0f0f0]">{orderInfo.total}₴</p>
              </div>

              {/* Дата заказа */}
              <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#a31212]" />
                  <span className="text-sm sm:text-base font-semibold text-[#f0f0f0]">Дата заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[#f0f0f0]">{orderInfo.date}</p>
              </div>

              {/* Время заказа */}
              <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-[#a31212]" />
                  <span className="text-sm sm:text-base font-semibold text-[#f0f0f0]">Время заказа</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-[#f0f0f0]">{orderInfo.time}</p>
              </div>
            </div>

            {/* Информация о товарах */}
            <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#a31212]" />
                <span className="text-sm sm:text-base font-semibold text-[#f0f0f0]">Товары в заказе</span>
              </div>
              <p className="text-sm sm:text-base text-[#a0a0a0]">{orderInfo.items}</p>
            </div>

            {/* Контактная информация */}
            <div className="bg-[#181818] rounded-lg sm:rounded-xl border border-[#1c1c1c] p-3 sm:p-4 mb-6 sm:mb-8">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-[#f0f0f0] mb-3 sm:mb-4">
                  Для выдачи товара обратитесь к администратору
                </h3>
                <p className="text-sm sm:text-base text-[#a0a0a0] mb-4">
                  Наша служба поддержки готова помочь с любыми вопросами
                </p>
                <Button
                  onClick={() => window.open('https://t.me/Vaultory_manager', '_blank')}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base"
                >
                  💬 Написать администратору
                </Button>
                
                <p className="text-[#a0a0a0] text-xs sm:text-sm mt-3 sm:mt-4">
                  Нажмите кнопку выше для быстрого перехода в чат
                </p>
              </div>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              onClick={() => navigate('/catalog')}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#a31212] hover:bg-[#8a0f0f] text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300"
            >
              🛍️ Продолжить покупки
            </Button>
            
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="px-6 sm:px-8 py-3 sm:py-4 bg-[#181818] border border-[#1c1c1c] text-[#f0f0f0] hover:bg-[#a31212] hover:border-[#a31212] hover:text-white transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
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
