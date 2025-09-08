import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Award, 
  Shield, 
  Zap, 
  Globe,
  Crown,
  Sparkles,
  Rocket,
  Gem,
  Star,
  Flame
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
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Безопасность",
      description: "Все транзакции защищены современными технологиями шифрования"
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Скорость",
      description: "Мгновенная обработка заказов и быстрая доставка"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Поддержка",
      description: "24/7 поддержка клиентов через Telegram и Email"
    },
    {
      icon: <Award className="w-8 h-8 text-purple-400" />,
      title: "Качество",
      description: "Только проверенные товары от надежных поставщиков"
    }
  ];





  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-green-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-orange-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-black/80 backdrop-blur-xl rounded-full mb-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/30">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white">
              О НАС
            </h1>
            <div className="w-32 h-1 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Vaultory - ваш <span className="text-cyan-400 font-bold">надежный партнер</span> в мире игровых товаров и услуг. 
            Мы стремимся предоставить <span className="text-purple-400 font-bold">лучший опыт покупок</span> для геймеров.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Наша миссия */}
        <div className="mb-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500 text-center">
              <div className="mx-auto w-20 h-20 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-500">
                <Target className="w-10 h-10 text-cyan-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Наша миссия</h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Мы создаем платформу, где каждый геймер может найти <span className="text-cyan-400 font-bold">качественные товары</span> и услуги 
                по доступным ценам. Наша цель - сделать <span className="text-purple-400 font-bold">игровой мир</span> более доступным и увлекательным.
              </p>
            </div>
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              ПОЧЕМУ ВЫБИРАЮТ НАС
            </h2>
            <div className="w-32 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 text-center">
                  <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-purple-500/30 shadow-xl shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{feature.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* История компании */}
        <div className="mb-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-pink-500/30 p-8 hover:border-pink-400/50 transition-all duration-500">
              <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-8 flex items-center justify-center gap-3">
                <Globe className="w-8 h-8 text-pink-400" />
                НАША ИСТОРИЯ
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-2">2025</h3>
                      <p className="text-sm text-gray-300">Основание магазина Vaultory</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-2">2025</h3>
                      <p className="text-sm text-gray-300">Запуск магазина и первые клиенты</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-2">Настоящее время</h3>
                      <p className="text-sm text-gray-300">Постоянное развитие и улучшение сервиса</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-2">Будущее</h3>
                      <p className="text-sm text-gray-300">Расширение ассортимента и новые возможности</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-4 h-4 bg-pink-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg font-black text-white mb-2">Цель</h3>
                      <p className="text-sm text-gray-300">Стать лидером в сфере игровых товаров</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="mb-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-8 hover:border-yellow-400/50 transition-all duration-500 text-center">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                ГОТОВЫ НАЧАТЬ?
              </h3>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам <span className="text-yellow-400 font-bold">довольных клиентов</span> Vaultory и откройте для себя 
                мир <span className="text-orange-400 font-bold">качественных игровых товаров</span>!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/catalog')}
                  className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25"
                >
                  Перейти в каталог
                </Button>
                <Button
                  onClick={openGmail}
                  className="px-8 py-4 bg-purple-500 hover:bg-purple-400 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/25"
                >
                  Связаться с нами
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Вернуться на главную</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
