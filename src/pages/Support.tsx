
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Mail, Phone, Clock, MessageCircle, HelpCircle } from 'lucide-react';

const Support = () => {
  const supportMethods = [
    {
      icon: <Send className="w-6 h-6" />,
      title: 'Telegram',
      description: 'Быстрый ответ в течение 5 минут',
      contact: '@VaultorySupport',
      action: 'Написать в Telegram',
      primary: true
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      description: 'Ответ в течение 1 часа',
      contact: 'support@vaultory.com',
      action: 'Отправить Email'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Телефон',
      description: 'Звонок в рабочие часы',
      contact: '+7 (999) 123-45-67',
      action: 'Позвонить'
    }
  ];

  const faqItems = [
    {
      question: 'Как быстро приходят товары?',
      answer: 'Большинство товаров доставляется автоматически в течение 5 минут после успешной оплаты. В редких случаях доставка может занять до 15 минут.'
    },
    {
      question: 'Что делать, если товар не пришел?',
      answer: 'Обратитесь в нашу поддержку через Telegram или Email с номером заказа. Мы решим проблему в течение часа или вернем деньги.'
    },
    {
      question: 'Какие способы оплаты доступны?',
      answer: 'Мы принимаем банковские карты, электронные кошельки (QIWI, WebMoney, ЮMoney), криптовалюты и переводы через банк.'
    },
    {
      question: 'Можно ли вернуть товар?',
      answer: 'Цифровые товары возврату не подлежат согласно закону о защите прав потребителей. Однако в случае технических проблем мы всегда идем навстречу клиентам.'
    },
    {
      question: 'Безопасно ли покупать у вас?',
      answer: 'Да, мы работаем с 2020 года и имеем все необходимые лицензии. Все платежи проходят через защищенные каналы.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Поддержка
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Мы всегда готовы помочь! Выберите удобный способ связи
          </p>
        </div>

        {/* Способы связи */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {supportMethods.map((method, index) => (
            <Card 
              key={index}
              className={`bg-gray-800/50 backdrop-blur-sm border-gray-700/50 hover:border-red-500/50 transition-all duration-300 transform hover:scale-105 ${
                method.primary ? 'ring-2 ring-red-500/50' : ''
              }`}
            >
              <CardHeader className="text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  method.primary ? 'bg-gradient-to-r from-red-500 to-purple-600' : 'bg-gray-700'
                }`}>
                  {method.icon}
                </div>
                <CardTitle className="text-white">{method.title}</CardTitle>
                <p className="text-gray-400 text-sm">{method.description}</p>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-red-400 font-semibold mb-4">{method.contact}</div>
                <Button 
                  className={`w-full ${
                    method.primary 
                      ? 'bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {method.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Рабочие часы */}
        <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50 mb-16">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold">Время работы поддержки</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">Telegram поддержка</h3>
                <p className="text-gray-300">24/7 - Круглосуточно</p>
                <p className="text-sm text-gray-400">Автоответчик + живая поддержка</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-red-400">Телефон и Email</h3>
                <p className="text-gray-300">Пн-Вс: 9:00 - 23:00 (МСК)</p>
                <p className="text-sm text-gray-400">Время ответа: до 1 часа</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Частые вопросы
            </h2>
            <p className="text-gray-400">Возможно, ответ на ваш вопрос уже есть здесь</p>
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
        <Card className="bg-gradient-to-r from-red-900/30 to-purple-900/30 border-red-500/50 mt-16">
          <CardContent className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Нужна срочная помощь?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Если у вас проблемы с заказом или аккаунтом, напишите нам в Telegram для получения мгновенной помощи
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 px-8 py-6 text-lg"
            >
              <Send className="w-5 h-5 mr-2" />
              Написать в Telegram
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Support;
