import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Mail, Clock, MessageCircle, HelpCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/hooks/useAuth';

const Support = () => {
  const { t } = useLanguage();
  const { telegramUser } = useAuth();
  
  // Убираем автоматическое обновление профиля при загрузке - это может вызывать конфликты
  // useEffect(() => {
  //   if (telegramUser) {
  //     refreshTelegramProfile();
  //   }
  // }, [telegramUser, refreshTelegramProfile]);
  
  const supportMethods = [
    {
      icon: <Send className="w-6 h-6" />,
      title: 'Telegram',
      description: t('Быстрый ответ в течение 5 минут'),
      contact: '@Vaultory_manager',
      action: t('Написать в Telegram'),
      link: 'https://t.me/Vaultory_manager'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      description: t('Ответ в течение 1 часа'),
      contact: 'support@vaultory.com',
      action: t('Отправить Email')
    }
  ];

  const faqItems = [
    {
      question: t('Как быстро приходят товары?'),
      answer: t('Товары после оплаты выдаются вручную, поэтому время на выдачу товара может варьироваться от 5 минут до пары часов.')
    },
    {
      question: t('Что делать, если товар не пришел?'),
      answer: t('Обратитесь в нашу поддержку через Telegram или Email с номером заказа. Мы решим проблему в течение часа или вернем деньги.')
    },
    {
      question: t('Какие способы оплаты доступны?'),
      answer: t('Моно банк, Приват банк, Пумб банк.')
    },
    {
      question: t('Можно ли вернуть товар?'),
      answer: t('Цифровые товары возврату не подлежат согласно закону о защите прав потребителей. Однако в случае технических проблем мы всегда идем навстречу клиентам.')
    },
    {
      question: t('Безопасно ли покупать у вас?'),
      answer: t('Да, мы работаем с 2025 года и имеем уже большое количество реальных отзывов. Все платежи проходят через защищенные каналы.')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t('Поддержка')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('Мы всегда готовы помочь! Выберите удобный способ связи')}
          </p>
        </div>

        {/* Способы связи */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {supportMethods.map((method, index) => (
            <Card 
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-purple-600">
                  {method.icon}
                </div>
                <CardTitle className="text-white">{method.title}</CardTitle>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-red-400 font-semibold mb-4">
                  <a href={method.link ? method.link : (method.title === 'Email' ? `mailto:${method.contact}` : '#')} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-pink-500 transition-colors duration-200">
                    {method.contact}
                  </a>
                </div>
                {method.link ? (
                  <a href={method.link} target="_blank" rel="noopener noreferrer">
                    <Button 
                      className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
                    >
                      {method.action}
                    </Button>
                  </a>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 font-bold text-lg py-3 rounded-lg shadow-lg transition-all duration-200"
                    onClick={() => {
                      if (method.title === 'Email') {
                        window.location.href = `mailto:${method.contact}`;
                      }
                    }}
                  >
                    {method.action}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Рабочие часы */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 mb-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold">{t('Время работы поддержки')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">{t('Telegram поддержка')}</h3>
                <p className="text-gray-300">24/7 - {t('Круглосуточно')}</p>
                <p className="text-sm text-gray-400">{t('Автоответчик + живая поддержка')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">{t('Email поддержка')}</h3>
                <p className="text-gray-300">Пн-Вс: 9:00 - 23:00 (МСК)</p>
                <p className="text-sm text-gray-400">{t('Время ответа: до 1 часа')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('Частые вопросы')}
            </h2>
            <p className="text-gray-400">{t('Возможно, ответ на ваш вопрос уже есть здесь')}</p>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <HelpCircle className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">{item.question}</h3>
                      <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Экстренная помощь */}
        <Card className="bg-white/90 dark:bg-gray-900/90 border-2 border-pink-300/60 shadow-xl rounded-2xl mt-16">
          <CardContent className="p-10 text-center">
            <MessageCircle className="w-12 h-12 text-pink-500 mx-auto mb-4 drop-shadow-lg" />
            <h3 className="text-3xl font-extrabold mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
              {t('Нужна срочная помощь?')}
            </h3>
            <p className="mb-6 max-w-2xl mx-auto text-lg text-gray-100 dark:text-gray-200 leading-relaxed drop-shadow-md" style={{textShadow: '0 2px 8px rgba(80,0,80,0.18)'}}>
              {t('Если у вас проблемы с заказом или аккаунтом,')} <span className="font-semibold text-pink-400">{t('напишите нам в Telegram')}</span> {t('для получения мгновенной помощи')}
            </p>
            <a href="https://t.me/Vaultory_manager" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold text-lg py-3 rounded-lg mt-6 shadow-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-200">
                {t('Написать в Telegram')}
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
