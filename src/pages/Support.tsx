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
      link: "mailto:support@vaultory.com",
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
      answer: "Да, все товары имеют гарантию качества. Если возникли проблемы с полученным товаром, свяжитесь с поддержкой для решения вопроса."
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🆘 {t('Поддержка')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Мы всегда готовы помочь! Свяжитесь с нашей службой поддержки любым удобным способом 
            и получите быстрый ответ на все ваши вопросы.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Способы связи */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Свяжитесь с нами
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                    {method.icon}
                  </div>
                  <CardTitle className="text-white text-xl">{method.title}</CardTitle>
                  <CardDescription className="text-amber-300">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button
                    onClick={() => window.open(method.link, '_blank')}
                    className={`w-full py-3 bg-gradient-to-r ${method.color} hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30`}
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Особенности поддержки */}
        <div className="mb-16">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Почему выбирают нашу поддержку</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supportFeatures.map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-black/50 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <div className="mx-auto w-16 h-16 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                      {feature.icon}
                    </div>
                    <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Часто задаваемые вопросы */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Часто задаваемые вопросы
          </h2>
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-amber-500/20">
                    <AccordionTrigger className="text-white hover:text-amber-400 transition-colors">
                      <div className="flex items-center space-x-3">
                        <HelpCircle className="w-5 h-5 text-amber-400" />
                        <span className="text-left">{item.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-300 leading-relaxed pt-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Дополнительная информация */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Info className="w-6 h-6 mr-3 text-amber-400" />
                  Время работы
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Поддержка:</span>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      24/7
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ответ в Telegram:</span>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      5-15 мин
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Ответ на Email:</span>
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                      До 24 ч
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Star className="w-6 h-6 mr-3 text-amber-400" />
                  Наши преимущества
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-300 text-sm">Бесплатная консультация</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-300 text-sm">Опытные специалисты</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-300 text-sm">Конфиденциальность</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                    <span className="text-gray-300 text-sm">Быстрое решение</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="text-center">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Нужна дополнительная помощь?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Если вы не нашли ответ на свой вопрос в FAQ или нужна более детальная консультация, 
                не стесняйтесь обращаться к нам. Мы всегда готовы помочь!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.open('https://t.me/Vaultory_manager', '_blank')}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-blue-500/30"
                >
                  Написать в Telegram
                </Button>
                <Button
                  onClick={() => window.open('mailto:support@vaultory.com', '_blank')}
                  variant="outline"
                  className="px-8 py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                >
                  Отправить Email
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

export default Support;
