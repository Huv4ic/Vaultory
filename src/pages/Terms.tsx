import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Clock,
  User,
  CreditCard,
  ShoppingBag,
  HelpCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Вопрос по условиям использования Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня есть вопрос по условиям использования:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const termsSections = [
    {
      title: "Общие положения",
      icon: <FileText className="w-6 h-6 text-amber-400" />,
      content: [
        "Настоящие Условия использования регулируют отношения между Vaultory и пользователями платформы.",
        "Используя наш сервис, вы соглашаетесь с данными условиями.",
        "Мы оставляем за собой право изменять условия, уведомив пользователей заранее."
      ]
    },
    {
      title: "Регистрация и аккаунт",
      icon: <User className="w-6 h-6 text-amber-400" />,
      content: [
        "Для использования сервиса необходима регистрация через Telegram.",
        "Пользователь несет ответственность за безопасность своего аккаунта.",
        "Запрещено передавать доступ к аккаунту третьим лицам."
      ]
    },
    {
      title: "Покупки и оплата",
      icon: <CreditCard className="w-6 h-6 text-amber-400" />,
      content: [
        "Все цены указаны в гривнах (₴) и включают все налоги.",
        "Оплата производится через защищенные платежные системы.",
        "После оплаты товар выдается в течение 5 минут - 2 часов."
      ]
    },
    {
      title: "Кейсы и товары",
      icon: <ShoppingBag className="w-6 h-6 text-amber-400" />,
      content: [
        "Содержимое кейсов определяется случайным образом.",
        "Все товары являются официальными и лицензированными.",
        "Возврат товаров из кейсов невозможен."
      ]
    },
    {
      title: "Безопасность",
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      content: [
        "Все транзакции защищены современными технологиями шифрования.",
        "Мы не храним данные платежных карт.",
        "Персональные данные обрабатываются в соответствии с законодательством."
      ]
    },
    {
      title: "Ограничения",
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      content: [
        "Запрещено использование сервиса для незаконной деятельности.",
        "Не допускается нарушение прав интеллектуальной собственности.",
        "Запрещено использование автоматизированных средств для обхода ограничений."
      ]
    },
    {
      title: "Поддержка",
      icon: <HelpCircle className="w-6 h-6 text-amber-400" />,
      content: [
        "Техническая поддержка доступна 24/7 через Telegram и Email.",
        "Время ответа на запросы: до 30 минут в рабочее время.",
        "Для решения сложных вопросов может потребоваться до 24 часов."
      ]
    },
    {
      title: "Изменения и обновления",
      icon: <Clock className="w-6 h-6 text-amber-400" />,
      content: [
        "Мы регулярно обновляем функционал и улучшаем сервис.",
        "Уведомления об изменениях публикуются на сайте.",
        "Продолжение использования означает согласие с новыми условиями."
      ]
    }
  ];

  const importantNotes = [
    {
      type: "info",
      icon: <Info className="w-5 h-5 text-amber-400" />,
      text: "Все покупки защищены системой гарантий",
      title: "Гарантии",
      description: "Все покупки защищены системой гарантий"
    },
    {
      type: "warning",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      text: "Кейсы открываются случайным образом, результаты не гарантированы",
      title: "Случайность",
      description: "Кейсы открываются случайным образом, результаты не гарантированы"
    },
    {
      type: "success",
      icon: <CheckCircle className="w-5 h-5 text-amber-400" />,
      text: "Поддержка доступна круглосуточно",
      title: "Поддержка 24/7",
      description: "Поддержка доступна круглосуточно"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            📋 {t('Условия использования')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Ознакомьтесь с правилами использования платформы Vaultory. 
            Мы стремимся обеспечить прозрачные и справедливые условия для всех пользователей.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основные разделы */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {termsSections.map((section, index) => (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center text-lg sm:text-xl">
                    {section.icon}
                    <span className="ml-3">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-300 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Важные примечания */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Важные примечания
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {importantNotes.map((note, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300"
              >
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                  {note.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2">{note.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300">{note.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Контактная информация */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Вопросы по условиям?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-6">
              Если у вас есть вопросы по нашим условиям использования, 
              не стесняйтесь обращаться к нам.
            </p>
            <Button
              onClick={openGmail}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base"
            >
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Связаться с нами
            </Button>
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

export default Terms;
