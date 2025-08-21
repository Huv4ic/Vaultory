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
  const { t } = useLanguage();
  const navigate = useNavigate();

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
      icon: <User className="w-6 h-6 text-emerald-400" />,
      content: [
        "Для использования сервиса необходима регистрация через Telegram.",
        "Пользователь несет ответственность за безопасность своего аккаунта.",
        "Запрещено передавать доступ к аккаунту третьим лицам."
      ]
    },
    {
      title: "Покупки и оплата",
      icon: <CreditCard className="w-6 h-6 text-purple-400" />,
      content: [
        "Все цены указаны в гривнах (₴) и включают все налоги.",
        "Оплата производится через защищенные платежные системы.",
        "После оплаты товар выдается в течение 5 минут - 2 часов."
      ]
    },
    {
      title: "Кейсы и товары",
      icon: <ShoppingBag className="w-6 h-6 text-cyan-400" />,
      content: [
        "Содержимое кейсов определяется случайным образом.",
        "Все товары являются официальными и лицензированными.",
        "Возврат товаров из кейсов невозможен."
      ]
    },
    {
      title: "Безопасность",
      icon: <Shield className="w-6 h-6 text-green-400" />,
      content: [
        "Все транзакции защищены современными технологиями шифрования.",
        "Мы не храним данные платежных карт.",
        "Персональные данные обрабатываются в соответствии с законодательством."
      ]
    },
    {
      title: "Ограничения",
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      content: [
        "Запрещено использование сервиса для незаконной деятельности.",
        "Не допускается нарушение прав интеллектуальной собственности.",
        "Запрещено использование автоматизированных средств для обхода ограничений."
      ]
    },
    {
      title: "Поддержка",
      icon: <HelpCircle className="w-6 h-6 text-blue-400" />,
      content: [
        "Техническая поддержка доступна 24/7 через Telegram и Email.",
        "Время ответа на запросы: до 30 минут в рабочее время.",
        "Для решения сложных вопросов может потребоваться до 24 часов."
      ]
    },
    {
      title: "Изменения и обновления",
      icon: <Clock className="w-6 h-6 text-orange-400" />,
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
      icon: <Info className="w-5 h-5 text-blue-400" />,
      text: "Все покупки защищены системой гарантий"
    },
    {
      type: "warning",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      text: "Кейсы открываются случайным образом, результаты не гарантированы"
    },
    {
      type: "success",
      icon: <CheckCircle className="w-5 h-5 text-green-400" />,
      text: "Поддержка доступна круглосуточно"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            📋 {t('Условия использования')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Ознакомьтесь с правилами использования платформы Vaultory. 
            Мы стремимся обеспечить прозрачные и справедливые условия для всех пользователей.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Важные заметки */}
        <div className="mb-12">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Важная информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {importantNotes.map((note, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    {note.icon}
                    <span className="text-white/90 text-sm">{note.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основные разделы */}
        <div className="space-y-8">
          {termsSections.map((section, index) => (
            <Card 
              key={index}
              className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {section.icon}
                  <span className="ml-3">{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span className="text-white/90 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Дополнительные условия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Что разрешено:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Покупка товаров для личного использования</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Открытие кейсов в разумных пределах</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Обращение в службу поддержки</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Что запрещено:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-white/80 text-sm">Использование ботов и автоматизации</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-white/80 text-sm">Нарушение правил игр</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-400" />
                      <span className="text-white/80 text-sm">Попытки обмана системы</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Контактная информация */}
        <div className="mt-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Остались вопросы?
                </h3>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                  Если у вас есть вопросы по условиям использования или нужна помощь, 
                  наша служба поддержки готова помочь 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/support')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
                  >
                    Связаться с поддержкой
                  </Button>
                  <Button
                    onClick={() => navigate('/')}
                    variant="outline"
                    className="px-8 py-3 border-amber-500/30 text-amber-400 hover:bg-amber-500/10 hover:border-amber-500 transition-all duration-300"
                  >
                    Вернуться на главную
                  </Button>
                </div>
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

export default Terms;
