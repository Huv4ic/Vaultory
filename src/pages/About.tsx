import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Award, 
  Shield, 
  Zap, 
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Вопрос о Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня есть вопрос о Vaultory:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-amber-400" />,
      title: "Безопасность",
      description: "Все транзакции защищены современными технологиями шифрования"
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Скорость",
      description: "Мгновенная обработка заказов и быстрая доставка"
    },
    {
      icon: <Users className="w-8 h-8 text-amber-400" />,
      title: "Поддержка",
      description: "24/7 поддержка клиентов через Telegram и Email"
    },
    {
      icon: <Award className="w-8 h-8 text-amber-400" />,
      title: "Качество",
      description: "Только проверенные товары от надежных поставщиков"
    }
  ];





  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            О нас
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Vaultory - ваш надежный партнер в мире игровых товаров и услуг. 
            Мы стремимся предоставить лучший опыт покупок для геймеров.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Наша миссия */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8 text-center">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-4 sm:mb-6 border border-amber-500/30">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Наша миссия</h2>
            <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Мы создаем платформу, где каждый геймер может найти качественные товары и услуги 
              по доступным ценам. Наша цель - сделать игровой мир более доступным и увлекательным.
            </p>
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                  {feature.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>



        {/* История компании */}
        <div className="mb-8 sm:mb-12">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 flex items-center justify-center">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 mr-3 text-amber-400" />
              Наша история
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">2025</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Основание магазина Vaultory</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">2025</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Запуск магазина и первые клиенты</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Настоящее время</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Постоянное развитие и улучшение сервиса</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Будущее</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Расширение ассортимента и новые возможности</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-400 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-1">Цель</h3>
                    <p className="text-xs sm:text-sm text-gray-300">Стать лидером в сфере игровых товаров</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Готовы начать?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-2xl mx-auto">
              Присоединяйтесь к тысячам довольных клиентов Vaultory и откройте для себя 
              мир качественных игровых товаров!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                onClick={() => navigate('/catalog')}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base"
              >
                Перейти в каталог
              </Button>
              <Button
                onClick={openGmail}
                variant="outline"
                className="px-6 sm:px-8 py-2 sm:py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
              >
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
