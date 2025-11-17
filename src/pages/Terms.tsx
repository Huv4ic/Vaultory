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
      icon: <FileText className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Настоящие Условия использования регулируют отношения между Vaultory и пользователями платформы.",
        "Используя наш сервис, вы соглашаетесь с данными условиями.",
        "Мы оставляем за собой право изменять условия, уведомив пользователей заранее."
      ]
    },
    {
      title: "Регистрация и аккаунт",
      icon: <User className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Для использования сервиса необходима регистрация через Telegram.",
        "Пользователь несет ответственность за безопасность своего аккаунта.",
        "Запрещено передавать доступ к аккаунту третьим лицам."
      ]
    },
    {
      title: "Покупки и оплата",
      icon: <CreditCard className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Все цены указаны в долларах ($) и включают все налоги.",
        "Оплата производится через защищенные платежные системы.",
        "После оплаты товар выдается в течение 5 минут - 2 часов."
      ]
    },
    {
      title: "Кейсы и товары",
      icon: <ShoppingBag className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Содержимое кейсов определяется случайным образом.",
        "Все товары являются официальными и лицензированными.",
        "Возврат товаров из кейсов невозможен."
      ]
    },
    {
      title: "Безопасность",
      icon: <Shield className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Все транзакции защищены современными технологиями шифрования.",
        "Мы не храним данные платежных карт.",
        "Персональные данные обрабатываются в соответствии с законодательством."
      ]
    },
    {
      title: "Ограничения",
      icon: <AlertTriangle className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Запрещено использование сервиса для незаконной деятельности.",
        "Не допускается нарушение прав интеллектуальной собственности.",
        "Запрещено использование автоматизированных средств для обхода ограничений."
      ]
    },
    {
      title: "Поддержка",
      icon: <HelpCircle className="w-6 h-6 text-[#FFD700]" />,
      content: [
        "Техническая поддержка доступна 24/7 через Telegram и Email.",
        "Время ответа на запросы: до 30 минут в рабочее время.",
        "Для решения сложных вопросов может потребоваться до 24 часов."
      ]
    },
    {
      title: "Изменения и обновления",
      icon: <Clock className="w-6 h-6 text-[#FFD700]" />,
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
      icon: <Info className="w-5 h-5 text-[#FFD700]" />,
      text: "Все покупки защищены системой гарантий",
      title: "Гарантии",
      description: "Все покупки защищены системой гарантий"
    },
    {
      type: "warning",
      icon: <AlertTriangle className="w-5 h-5 text-[#FFD700]" />,
      text: "Кейсы открываются случайным образом, результаты не гарантированы",
      title: "Случайность",
      description: "Кейсы открываются случайным образом, результаты не гарантированы"
    },
    {
      type: "success",
      icon: <CheckCircle className="w-5 h-5 text-[#FFD700]" />,
      text: "Поддержка доступна круглосуточно",
      title: "Поддержка 24/7",
      description: "Поддержка доступна круглосуточно"
    }
  ];

  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 glass rounded-full mb-6 border border-white/9">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-[#FFD700]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#f0f0f0] text-center">
              УСЛОВИЯ ИСПОЛЬЗОВАНИЯ
            </h1>
            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-base md:text-lg text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Ознакомьтесь с <span className="text-[#FFD700] font-semibold">правилами использования</span> платформы Vaultory. 
            Мы стремимся обеспечить <span className="text-[#f0f0f0] font-medium">прозрачные и справедливые</span> условия для всех пользователей.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Основные разделы */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f0f0f0]">
              ОСНОВНЫЕ РАЗДЕЛЫ
            </h2>
            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {termsSections.map((section, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="relative glass rounded-2xl border border-white/9 p-6 md:p-7 hover:border-white/15 hover-lift transition-all duration-300">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mr-4 border border-white/9">
                      {section.icon}
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-[#f0f0f0]">{section.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-[#FFD700] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#a0a0a0] leading-relaxed">{item}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f0f0f0]">
              ВАЖНЫЕ ПРИМЕЧАНИЯ
            </h2>
            <div className="w-32 h-1 bg-white/20 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {importantNotes.map((note, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="relative glass rounded-2xl border border-white/9 p-5 md:p-6 hover:border-white/15 hover-lift transition-all duration-300 text-center">
                  <div className="mx-auto w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/9">
                    {note.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#f0f0f0] mb-3">{note.title}</h3>
                  <p className="text-sm md:text-base text-[#a0a0a0]">{note.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Контактная информация */}
        <div className="text-center">
          <div className="group relative max-w-2xl mx-auto">
            <div className="relative glass rounded-2xl border border-white/9 p-6 md:p-7 hover:border-white/15 hover-lift transition-all duration-300">
              <h3 className="text-2xl font-bold text-[#f0f0f0] mb-4">
                Вопросы по условиям?
              </h3>
              <p className="text-base md:text-lg text-[#a0a0a0] mb-6">
                Если у вас есть вопросы по нашим условиям использования, 
                не стесняйтесь обращаться к нам.
              </p>
              <Button
                onClick={openGmail}
                className="w-full bg-[#FFD700] hover:bg-[#FFC107] text-[#121212] hover-lift font-semibold text-base rounded-2xl transition-all duration-300 py-4"
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
            className="px-8 py-3 glass border border-white/9 text-[#f0f0f0] hover:bg-white/5 hover:border-white/15 hover-lift hover:text-[#f0f0f0] transition-all duration-300 rounded-xl text-base"
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
