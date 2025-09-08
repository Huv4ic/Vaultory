import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  Phone, 
  Clock, 
  Shield, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Users,
  Globe,
  Crown,
  Sparkles,
  Rocket,
  Gem,
  Flame
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8 text-blue-400" />,
      title: "Telegram",
      description: "Быстрая поддержка через Telegram",
      action: "Написать в Telegram",
      link: "https://t.me/Vaultory_manager",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-400" />,
      title: "Email поддержка",
      description: "Подробные вопросы и документация",
      action: "Отправить Email",
      link: "mailto:vaultorypoderjka@gmail.com?subject=Вопрос по поддержке&body=Здравствуйте! У меня есть вопрос:",
      color: "from-amber-500 to-amber-600"
    }
  ];

  const faqItems = [
    {
      question: "Как быстро приходят товары после оплаты?",
      answer: "Товары после оплаты выдаются вручную, поэтому время на выдачу товара может варьироваться от 5 минут до пары часов. Мы стараемся обрабатывать заказы максимально быстро."
    },
    {
      question: "Какие способы оплаты доступны?",
      answer: "Доступны оплаты через Monobank, PrivatBank, PUMB, а также криптовалютой (USDT TRC20/ERC20, Litecoin). Все платежи проходят через защищенные каналы."
    },
    {
      question: "Безопасно ли у вас покупать?",
      answer: "Да, мы работаем с 2025 года и имеем уже большое количество реальных отзывов. Все платежи проходят через защищенные каналы, а ваши данные надежно защищены."
    },
    {
      question: "Что делать, если товар не пришел?",
      answer: "Если товар не пришел в течение 2 часов, свяжитесь с нами через Telegram или Email. Мы проверим статус заказа и решим проблему в кратчайшие сроки."
    },
    {
      question: "Можно ли вернуть товар из кейса?",
      answer: "К сожалению, товары из кейсов возврату не подлежат, так как они выдаются случайным образом. Перед покупкой кейса убедитесь, что готовы к такому результату."
    },
    {
      question: "Как пополнить баланс?",
      answer: "Пополнить баланс можно через профиль пользователя. Мы принимаем все основные способы оплаты, включая банковские карты и криптовалюты."
    },
    {
      question: "Есть ли гарантия на товары?",
      answer: "Да, мы даем гарантию на момент покупки товара. То есть мы гарантируем то, что аккаунт\\услуга будет выполнена верно а аккаунт будет рабочим. За дальнейшее пользование товара вами, мы ответственности не несем"
    },
    {
      question: "Как работает система кейсов?",
      answer: "Кейсы содержат случайные предметы из игр. Каждый кейс имеет свой список возможных наград с указанными шансами выпадения."
    }
  ];

  const supportFeatures = [
    {
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      title: "24/7 Поддержка",
      description: "Мы работаем круглосуточно для решения ваших вопросов"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Быстрый ответ",
      description: "Среднее время ответа: 5-30 минут"
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: "Безопасность",
      description: "Все обращения конфиденциальны и защищены"
    },
    {
      icon: <Users className="w-6 h-6 text-amber-400" />,
      title: "Опытная команда",
      description: "Наши специалисты решают любые вопросы"
    }
  ];

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Вопрос в поддержку Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня есть вопрос:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-red-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-black/80 backdrop-blur-xl rounded-full mb-6 border border-green-500/30 shadow-2xl shadow-green-500/30">
              <HelpCircle className="w-10 h-10 md:w-12 md:h-12 text-green-400" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white">
              🆘 ПОДДЕРЖКА
            </h1>
            <div className="w-32 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Мы всегда <span className="text-green-400 font-bold">готовы помочь</span>! Свяжитесь с нашей службой поддержки любым удобным способом 
            и получите <span className="text-blue-400 font-bold">быстрый ответ</span> на все ваши вопросы.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Способы связи */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              СВЯЖИТЕСЬ С НАМИ
            </h2>
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 text-center">
                  <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-6 border border-blue-500/30 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-black text-white mb-3">{method.title}</h3>
                  <p className="text-sm text-gray-300 mb-6">{method.description}</p>
                  <Button
                    onClick={() => {
                      if (method.title === 'Email поддержка') {
                        openGmail();
                      } else {
                        window.open(method.link, '_blank');
                      }
                    }}
                    className="w-full bg-blue-500 hover:bg-blue-400 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/25 py-4"
                  >
                    {method.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              НАШИ ПРЕИМУЩЕСТВА
            </h2>
            <div className="w-32 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 text-center">
                <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-yellow-500/30 shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Поддержка 24/7</h3>
                <p className="text-sm text-gray-300">Помощь в любое время дня и ночи</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 text-center">
                <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-yellow-500/30 shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Быстрый ответ</h3>
                <p className="text-sm text-gray-300">Решаем вопросы в кратчайшие сроки</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 text-center">
                <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-yellow-500/30 shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Shield className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Безопасность</h3>
                <p className="text-sm text-gray-300">Конфиденциальность ваших данных</p>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl border border-yellow-500/30 p-6 hover:border-yellow-400/50 transition-all duration-500 hover:scale-105 text-center">
                <div className="mx-auto w-16 h-16 bg-black/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-yellow-500/30 shadow-xl shadow-yellow-500/20 group-hover:rotate-12 transition-transform duration-500">
                  <Star className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-black text-white mb-3">Качество</h3>
                <p className="text-sm text-gray-300">Профессиональный подход к каждому клиенту</p>
              </div>
            </div>
          </div>
        </div>

        {/* Часто задаваемые вопросы */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
            </h2>
            <div className="w-32 h-1 bg-orange-500 mx-auto rounded-full"></div>
          </div>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-orange-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-black/90 backdrop-blur-xl border border-orange-500/30 rounded-3xl shadow-2xl shadow-orange-500/20">
                    <AccordionTrigger className="px-6 py-4 text-left text-base font-black text-white hover:text-orange-400 transition-colors">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-sm text-gray-300">
                      {item.answer}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center">
          <Button
            onClick={() => navigate('/')}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-green-500/25"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
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

export default Support;
