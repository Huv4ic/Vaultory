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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Красивые анимированные фоновые элементы */}
      <div className="absolute inset-0">
        {/* Основные световые эффекты */}
        <div className="absolute top-20 left-10 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-cyan-400/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Дополнительные декоративные элементы */}
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-cyan-300/10 rounded-full blur-xl animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-purple-400/10 rounded-full blur-lg animate-ping delay-300"></div>
        
        {/* Сетка из точек */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-cyan-300/20 rounded-full animate-pulse delay-700"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
        <div className="relative">
          {/* Декоративная полоса слева от заголовка */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-16 sm:h-20 md:h-24 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full shadow-lg shadow-cyan-400/50 animate-pulse"></div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(34,211,238,0.5)] animate-pulse">
            📋 {t('Условия использования')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 hover:text-gray-200 transition-colors duration-300">
            Ознакомьтесь с правилами использования платформы Vaultory. 
            Мы стремимся обеспечить прозрачные и справедливые условия для всех пользователей.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основные разделы */}
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {termsSections.map((section, index) => (
              <Card 
                key={index}
                className="bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105 group relative overflow-hidden"
              >
                {/* Декоративный градиентный фон */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="text-white flex items-center text-lg sm:text-xl group-hover:text-cyan-400 transition-colors duration-300">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 backdrop-blur-xl rounded-lg flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40">
                      {section.icon}
                    </div>
                    <span className="ml-3">{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-2 sm:space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-2 sm:space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] animate-pulse" />
                        <span className="text-sm sm:text-base text-gray-300 leading-relaxed hover:text-gray-200 transition-colors duration-300">{item}</span>
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8 hover:text-cyan-400 transition-colors duration-300">
            Важные примечания
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {importantNotes.map((note, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-4 sm:p-6 text-center hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105 group relative overflow-hidden"
              >
                {/* Декоративный градиентный фон */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-500/20 to-cyan-600/30 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40">
                    {note.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">{note.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 hover:text-gray-200 transition-colors duration-300">{note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Контактная информация */}
        <div className="text-center">
          <div className="bg-gradient-to-br from-gray-800/80 via-gray-900/60 to-black/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 p-6 sm:p-8 max-w-2xl mx-auto hover:shadow-cyan-500/40 transition-all duration-500 relative overflow-hidden group">
            {/* Декоративный градиентный фон */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 hover:text-cyan-400 transition-colors duration-300">
                Вопросы по условиям?
              </h3>
              <p className="text-sm sm:text-base text-gray-300 mb-6 hover:text-gray-200 transition-colors duration-300">
                Если у вас есть вопросы по нашим условиям использования, 
                не стесняйтесь обращаться к нам.
              </p>
              <Button
                onClick={openGmail}
                className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500/20 to-cyan-600/30 backdrop-blur-xl border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:text-cyan-300 font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-cyan-500/30 text-sm sm:text-base"
              >
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300 rounded-lg sm:rounded-xl text-sm sm:text-base hover:scale-105 shadow-lg shadow-cyan-500/20"
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
