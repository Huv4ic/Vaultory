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
  Globe
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Support = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8 text-amber-400" />,
      title: "Telegram",
      description: "Быстрая поддержка через Telegram",
      action: "Написать в Telegram",
      link: "https://t.me/Vaultory_manager",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Mail className="w-8 h-8 text-amber-400" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🆘 {t('Поддержка')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Мы всегда готовы помочь! Свяжитесь с нашей службой поддержки любым удобным способом 
            и получите быстрый ответ на все ваши вопросы.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Способы связи */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Свяжитесь с нами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4 sm:p-6 text-center">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                    {method.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-sm sm:text-base text-gray-300 mb-4">{method.description}</p>
                  <Button
                    onClick={() => window.open(method.link, '_blank')}
                    className={`w-full bg-gradient-to-r ${method.color} text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base py-2 sm:py-3`}
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Наши преимущества */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Наши преимущества
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Поддержка 24/7</h3>
              <p className="text-xs sm:text-sm text-gray-300">Помощь в любое время дня и ночи</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Быстрый ответ</h3>
              <p className="text-xs sm:text-sm text-gray-300">Решаем вопросы в кратчайшие сроки</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Безопасность</h3>
              <p className="text-xs sm:text-sm text-gray-300">Конфиденциальность ваших данных</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center">
              <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-white mb-2">Качество</h3>
              <p className="text-xs sm:text-sm text-gray-300">Профессиональный подход к каждому клиенту</p>
            </div>
          </div>
        </div>

        {/* Часто задаваемые вопросы */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Часто задаваемые вопросы
          </h2>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-black/40 backdrop-blur-xl border border-amber-500/30 rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/20"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-white hover:text-amber-400 transition-colors">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4 text-sm sm:text-base text-gray-300">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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

export default Support;
