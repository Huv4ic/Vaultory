import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Award, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  Star,
  TrendingUp,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Безопасность",
      description: "Все транзакции защищены современными технологиями шифрования"
    },
    {
      icon: <Zap className="w-8 h-8 text-amber-400" />,
      title: "Скорость",
      description: "Мгновенная обработка заказов и быстрая доставка"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Поддержка",
      description: "24/7 поддержка клиентов через Telegram и Email"
    },
    {
      icon: <Award className="w-8 h-8 text-cyan-400" />,
      title: "Качество",
      description: "Только проверенные товары от надежных поставщиков"
    }
  ];

  const stats = [
    { number: "1000+", label: "Довольных клиентов", icon: <Heart className="w-6 h-6 text-red-400" /> },
    { number: "50+", label: "Успешных сделок", icon: <CheckCircle className="w-6 h-6 text-green-400" /> },
    { number: "24/7", label: "Поддержка", icon: <Star className="w-6 h-6 text-yellow-400" /> },
    { number: "99%", label: "Положительных отзывов", icon: <TrendingUp className="w-6 h-6 text-blue-400" /> }
  ];

  const team = [
    {
      name: "Команда разработчиков",
      role: "Техническая поддержка",
      description: "Обеспечивает стабильную работу платформы"
    },
    {
      name: "Служба поддержки",
      role: "Клиентский сервис",
      description: "Помогает решать любые вопросы клиентов"
    },
    {
      name: "Отдел безопасности",
      role: "Защита данных",
      description: "Гарантирует безопасность всех операций"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            🏢 {t('О нас')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Vaultory - ваш надежный партнер в мире игровых товаров и кейсов. 
            Мы создаем безопасную и удобную платформу для всех игроков.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Миссия и видение */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Target className="w-6 h-6 mr-3 text-amber-400" />
                Наша миссия
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">
                Создать самую надежную и удобную платформу для покупки игровых товаров. 
                Мы стремимся сделать процесс покупки максимально простым и безопасным 
                для каждого клиента.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-emerald-400" />
                Наше видение
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed">
                Стать лидером в сфере игровых товаров, предлагая инновационные решения 
                и исключительный уровень обслуживания. Мы постоянно развиваемся, 
                чтобы соответствовать растущим потребностям игрового сообщества.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Особенности */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-center text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Статистика */}
        <div className="mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader className="text-center">
              <CardTitle className="text-white text-2xl">Наши достижения</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold text-amber-400 mb-2">{stat.number}</div>
                    <div className="text-white/80 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Команда */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Наша команда
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-white">{member.name}</CardTitle>
                  <CardDescription className="text-amber-300">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-center leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* История */}
        <div className="mb-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-6 h-6 mr-3 text-amber-400" />
                История развития
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">2025 - Основание</h4>
                    <p className="text-white/80">
                      Создание платформы Vaultory с базовым функционалом для покупки игровых товаров
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">2025 - Развитие</h4>
                    <p className="text-white/80">
                      Добавление системы кейсов, расширение ассортимента и улучшение безопасности
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-semibold mb-2">2025 - Инновации</h4>
                    <p className="text-white/80">
                      Внедрение новых технологий, улучшение пользовательского опыта и расширение команды
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ценности */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Наши ценности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                  Надежность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Мы гарантируем безопасность каждой транзакции и защиту данных наших клиентов
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-400" />
                  Клиентоориентированность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Потребности клиентов всегда на первом месте. Мы стремимся превзойти ожидания
                </p>
              </CardContent>
            </Card>

            <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-amber-400" />
                  Инновации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80">
                  Постоянно внедряем новые технологии для улучшения пользовательского опыта
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Готовы присоединиться к нам?
              </h3>
              <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                Начните свой путь с Vaultory уже сегодня. Откройте для себя мир качественных 
                игровых товаров и незабываемых впечатлений.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/catalog')}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
                >
                  Перейти в каталог
                </Button>
                <Button
                  onClick={() => navigate('/support')}
                  variant="outline"
                  className="px-8 py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                >
                  Связаться с нами
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
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
