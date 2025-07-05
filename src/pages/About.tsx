import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Shield, Zap, Users, Trophy, Clock, CheckCircle } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Shield,
      title: 'Безопасность',
      description: 'Все транзакции защищены, гарантия возврата средств'
    },
    {
      icon: Zap,
      title: 'Скорость',
      description: 'Мгновенная доставка большинства товаров'
    },
    {
      icon: Users,
      title: 'Поддержка',
      description: '24/7 техническая поддержка в Telegram'
    },
    {
      icon: Trophy,
      title: 'Качество',
      description: 'Только официальные и проверенные товары'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Довольных клиентов' },
    { number: '1,000,000+', label: 'Проданных товаров' },
    { number: '99.8%', label: 'Положительных отзывов' },
    { number: '2', label: 'Года на рынке' }
  ];

  const advantages = [
    'Лучшие цены на рынке',
    'Мгновенная доставка',
    'Поддержка всех популярных игр',
    'Безопасные платежи',
    'Круглосуточная поддержка',
    'Гарантия качества товаров'
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Hero секция */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-red-100 to-purple-100 bg-clip-text text-transparent">
              О компании Vaultory
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Мы — ведущая платформа для покупки игровых товаров в России. 
              Наша миссия — сделать гейминг доступнее и интереснее для каждого игрока.
            </p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-red-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Наши преимущества */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Почему выбирают нас
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Наши преимущества</h3>
              <div className="space-y-4">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-300">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-xl border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-4 text-white">Наша история</h3>
              <p className="text-gray-300 mb-4">
                Vaultory была основана в 2023 году командой энтузиастов гейминга. 
                Мы заметили, что игроки тратят слишком много времени на поиск надежных 
                продавцов игровых товаров.
              </p>
              <p className="text-gray-300 mb-4">
                Наша цель — создать единую платформу, где каждый геймер может быстро 
                и безопасно приобрести все необходимое для своих любимых игр.
              </p>
              <p className="text-gray-300">
                Сегодня нам доверяют тысячи игроков по всей стране, и мы продолжаем 
                развиваться, добавляя новые игры и улучшая сервис.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
