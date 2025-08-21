import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Info,
  Clock,
  Mail,
  Phone,
  Globe,
  Key,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const privacySections = [
    {
      title: "Сбор информации",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: [
        "Мы собираем только необходимую информацию для предоставления услуг.",
        "Основные данные: имя пользователя, Telegram ID, история покупок.",
        "Дополнительная информация запрашивается только при необходимости."
      ]
    },
    {
      title: "Использование данных",
      icon: <UserCheck className="w-6 h-6 text-emerald-400" />,
      content: [
        "Данные используются исключительно для предоставления услуг.",
        "Мы не передаем информацию третьим лицам без согласия.",
        "Аналитика используется только для улучшения сервиса."
      ]
    },
    {
      title: "Защита данных",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      content: [
        "Все данные защищены современными технологиями шифрования.",
        "Доступ к серверам ограничен и контролируется.",
        "Регулярные проверки безопасности и обновления защиты."
      ]
    },
    {
      title: "Хранение данных",
      icon: <Database className="w-6 h-6 text-cyan-400" />,
      content: [
        "Данные хранятся на защищенных серверах в ЕС.",
        "Срок хранения: до удаления аккаунта пользователем.",
        "Резервные копии создаются регулярно для безопасности."
      ]
    },
    {
      title: "Права пользователей",
      icon: <Key className="w-6 h-6 text-green-400" />,
      content: [
        "Право на доступ к своим данным в любое время.",
        "Возможность исправления неточной информации.",
        "Право на удаление аккаунта и всех связанных данных."
      ]
    },
    {
      title: "Cookies и трекинг",
      icon: <Eye className="w-6 h-6 text-blue-400" />,
      content: [
        "Используем только необходимые cookies для работы сайта.",
        "Не отслеживаем пользователей между сессиями.",
        "Аналитические данные собираются анонимно."
      ]
    },
    {
      title: "Безопасность платежей",
      icon: <Shield className="w-6 h-6 text-red-400" />,
      content: [
        "Платежные данные не хранятся на наших серверах.",
        "Все транзакции проходят через защищенные шлюзы.",
        "Соответствие стандартам PCI DSS для безопасности."
      ]
    },
    {
      title: "Обновления политики",
      icon: <Clock className="w-6 h-6 text-orange-400" />,
      content: [
        "Политика может обновляться с уведомлением пользователей.",
        "Значительные изменения требуют явного согласия.",
        "История изменений доступна на сайте."
      ]
    }
  ];

  const dataTypes = [
    {
      type: "personal",
      icon: <UserCheck className="w-5 h-5 text-green-400" />,
      title: "Персональные данные",
      examples: ["Имя пользователя", "Telegram ID", "Email (опционально)"]
    },
    {
      type: "usage",
      icon: <Database className="w-5 h-5 text-blue-400" />,
      title: "Данные использования",
      examples: ["История покупок", "Предпочтения", "Время на сайте"]
    },
    {
      type: "technical",
      icon: <Globe className="w-5 h-5 text-purple-400" />,
      title: "Технические данные",
      examples: ["IP адрес", "Браузер", "Устройство"]
    }
  ];

  const securityMeasures = [
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: "Шифрование",
      description: "Все данные передаются по защищенным SSL соединениям"
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: "Контроль доступа",
      description: "Строгий контроль доступа к серверам и базе данных"
    },
    {
      icon: <Database className="w-6 h-6 text-purple-400" />,
      title: "Резервное копирование",
      description: "Регулярное создание резервных копий данных"
    },
    {
      icon: <Eye className="w-6 h-6 text-cyan-400" />,
      title: "Мониторинг",
      description: "Постоянный мониторинг безопасности и подозрительной активности"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-emerald-500 to-purple-700">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-emerald-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
            🔒 {t('Политика конфиденциальности')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Мы серьезно относимся к защите ваших персональных данных. 
            Узнайте, как мы собираем, используем и защищаем вашу информацию.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-emerald-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-400/20 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Краткая информация */}
        <div className="mb-12">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ваша конфиденциальность - наш приоритет
                </h2>
                <p className="text-white/80 max-w-3xl mx-auto leading-relaxed">
                  Мы соблюдаем все требования GDPR и украинского законодательства о защите персональных данных. 
                  Ваша информация в безопасности с нами.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Типы собираемых данных */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Какие данные мы собираем
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dataTypes.map((dataType, index) => (
              <Card 
                key={index}
                className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                    {dataType.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{dataType.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {dataType.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{example}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Меры безопасности */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Меры безопасности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityMeasures.map((measure, index) => (
              <Card 
                key={index}
                className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300 hover:scale-105"
              >
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
                    {measure.icon}
                  </div>
                  <CardTitle className="text-white text-lg">{measure.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 text-center text-sm leading-relaxed">
                    {measure.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Основные разделы */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
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

        {/* Права пользователей */}
        <div className="mt-16">
          <Card className="bg-black/20 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Ваши права</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Что вы можете делать:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Запрашивать копию ваших данных</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Исправлять неточную информацию</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Удалять свой аккаунт</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Отзывать согласие на обработку</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Что мы гарантируем:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Безопасность ваших данных</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Неразглашение третьим лицам</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Прозрачность обработки</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white/80 text-sm">Быстрое реагирование на запросы</span>
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
                  Вопросы по конфиденциальности?
                </h3>
                <p className="text-white/80 mb-6 max-w-2xl mx-auto">
                  Если у вас есть вопросы о том, как мы обрабатываем ваши данные, 
                  или вы хотите воспользоваться своими правами, свяжитесь с нами.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-6">
                  <div className="flex items-center space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <Mail className="w-5 h-5 text-amber-400" />
                    <span className="text-white/90 text-sm">privacy@vaultory.com</span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-black/30 backdrop-blur-sm rounded-xl border border-amber-500/20">
                    <Phone className="w-5 h-5 text-emerald-400" />
                    <span className="text-white/90 text-sm">Telegram: @VaultorySupport</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/support')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
                  >
                    Связаться с нами
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

export default Privacy;
