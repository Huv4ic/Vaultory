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
      icon: <Shield className="w-8 h-8 text-[#FFD700]" />,
      title: "Безопасность",
      description: "Все транзакции защищены современными технологиями шифрования"
    },
    {
      icon: <Zap className="w-8 h-8 text-[#FFD700]" />,
      title: "Скорость",
      description: "Мгновенная обработка заказов и быстрая доставка"
    },
    {
      icon: <Users className="w-8 h-8 text-[#FFD700]" />,
      title: "Поддержка",
      description: "24/7 поддержка клиентов через Telegram и Email"
    },
    {
      icon: <Award className="w-8 h-8 text-[#FFD700]" />,
      title: "Качество",
      description: "Только проверенные товары от надежных поставщиков"
    }
  ];





  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 glass rounded-full mb-6 border border-white/9">
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-[#FFD700]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#f0f0f0]">
              О НАС
            </h1>
            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-base md:text-lg text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Vaultory - ваш <span className="text-[#FFD700] font-semibold">надежный партнер</span> в мире игровых товаров и услуг. 
            Мы стремимся предоставить <span className="text-[#f0f0f0] font-medium">лучший опыт покупок</span> для геймеров.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Наша миссия */}
        <div className="mb-16 md:mb-20">
          <div className="group relative">
            <div className="relative glass rounded-2xl border border-white/9 p-6 md:p-7 hover:border-white/15 hover-lift transition-all duration-300 text-center">
              <div className="mx-auto w-16 h-16 glass rounded-2xl flex items-center justify-center mb-6 border border-white/9">
                <Target className="w-8 h-8 text-[#FFD700]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#f0f0f0] mb-6">Наша миссия</h2>
              <p className="text-base text-[#a0a0a0] max-w-3xl mx-auto leading-relaxed">
                Мы создаем платформу, где каждый геймер может найти <span className="text-[#FFD700] font-semibold">качественные товары</span> и услуги 
                по доступным ценам. Наша цель - сделать <span className="text-[#f0f0f0] font-medium">игровой мир</span> более доступным и увлекательным.
              </p>
            </div>
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="mb-16 md:mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f0f0f0]">
              ПОЧЕМУ ВЫБИРАЮТ НАС
            </h2>
            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="relative glass rounded-2xl border border-white/9 p-5 md:p-6 hover:border-white/15 hover-lift transition-all duration-300 text-center">
                  <div className="mx-auto w-14 h-14 glass rounded-2xl flex items-center justify-center mb-4 border border-white/9">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-[#a0a0a0] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* История компании */}
        <div className="mb-16 md:mb-20">
          <div className="group relative">
            <div className="relative glass rounded-2xl border border-white/9 p-6 md:p-7 hover:border-white/15 hover-lift transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold text-[#f0f0f0] text-center mb-8 flex items-center justify-center gap-3">
                <Globe className="w-7 h-7 text-[#FFD700]" />
                НАША ИСТОРИЯ
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-2">2025</h3>
                      <p className="text-sm md:text-base text-[#a0a0a0]">Основание магазина Vaultory</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-2">2025</h3>
                      <p className="text-sm md:text-base text-[#a0a0a0]">Запуск магазина и первые клиенты</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-2">Настоящее время</h3>
                      <p className="text-sm md:text-base text-[#a0a0a0]">Постоянное развитие и улучшение сервиса</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-2">Будущее</h3>
                      <p className="text-sm md:text-base text-[#a0a0a0]">Расширение ассортимента и новые возможности</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-[#FFD700] rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0] mb-2">Цель</h3>
                      <p className="text-sm md:text-base text-[#a0a0a0]">Стать лидером в сфере игровых товаров</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="mb-16 md:mb-20">
          <div className="group relative">
            <div className="relative glass rounded-2xl border border-white/9 p-6 md:p-7 hover:border-white/15 hover-lift transition-all duration-300 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-[#f0f0f0] mb-6">
                ГОТОВЫ НАЧАТЬ?
              </h3>
              <p className="text-base text-[#a0a0a0] mb-8 max-w-2xl mx-auto">
                Присоединяйтесь к тысячам <span className="text-[#FFD700] font-semibold">довольных клиентов</span> Vaultory и откройте для себя 
                мир <span className="text-[#FFD700] font-semibold">качественных игровых товаров</span>!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/')}
                  className="px-8 py-4 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-semibold text-base rounded-2xl transition-all duration-300"
                >
                  Перейти в каталог
                </Button>
                <Button
                  onClick={openGmail}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white hover:text-white font-semibold text-base rounded-2xl transition-all duration-300 border border-white/9 hover:border-white/15 hover-lift"
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
            className="group relative px-8 py-4 bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-semibold rounded-2xl transition-all duration-300"
          >
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
