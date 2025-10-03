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
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие частицы */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full opacity-80"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-40"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-1 h-1 bg-red-400 rounded-full opacity-90"></div>
        <div className="absolute top-3/4 left-1/2 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        
        {/* Светящиеся линии */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок с анимацией */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-full mb-6 border border-cyan-500/30 shadow-2xl shadow-cyan-500/30">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-white text-center">
              УСЛОВИЯ ИСПОЛЬЗОВАНИЯ
            </h1>
            <div className="w-32 h-1 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ознакомьтесь с <span className="text-cyan-400 font-bold">правилами использования</span> платформы Vaultory. 
            Мы стремимся обеспечить <span className="text-blue-400 font-bold">прозрачные и справедливые</span> условия для всех пользователей.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основные разделы */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              ОСНОВНЫЕ РАЗДЕЛЫ
            </h2>
            <div className="w-32 h-1 bg-cyan-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {termsSections.map((section, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-cyan-500/30 shadow-xl shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-500">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-black text-white">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-300 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Важные примечания */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              ВАЖНЫЕ ПРИМЕЧАНИЯ
            </h2>
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {importantNotes.map((note, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-6 hover:border-blue-400/50 transition-all duration-500 hover:scale-105 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-blue-500/30 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                    {note.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{note.title}</h3>
                  <p className="text-sm text-gray-300">{note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Контактная информация */}
        <div className="text-center">
          <div className="group relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-black text-white mb-4">
                Вопросы по условиям?
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Если у вас есть вопросы по нашим условиям использования, 
                не стесняйтесь обращаться к нам.
              </p>
              <Button
                onClick={openGmail}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-cyan-500/25 py-4"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </div>

        {/* Кнопка назад */}
        <div className="text-center mt-12">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="px-8 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400/50 transition-all duration-300 rounded-2xl text-lg hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Terms;
