import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Shield, 
  Eye, 
  Lock, 
  User, 
  CreditCard, 
  Database, 
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Download,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const privacySections = [
    {
      title: "Сбор данных",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: [
        "Мы собираем только необходимые данные для предоставления услуг.",
        "Информация включает: Telegram ID, имя пользователя, баланс, историю покупок.",
        "Данные собираются автоматически при использовании платформы."
      ]
    },
    {
      title: "Использование данных",
      icon: <Eye className="w-6 h-6 text-amber-400" />,
      content: [
        "Данные используются для обработки заказов и платежей.",
        "Аналитика помогает улучшать качество сервиса.",
        "Персональная информация не передается третьим лицам."
      ]
    },
    {
      title: "Безопасность",
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      content: [
        "Все данные защищены современными технологиями шифрования.",
        "Доступ к серверам ограничен и контролируется.",
        "Регулярные проверки безопасности и обновления."
      ]
    },
    {
      title: "Права пользователей",
      icon: <User className="w-6 h-6 text-amber-400" />,
      content: [
        "Право на доступ к своим персональным данным.",
        "Возможность исправления неточной информации.",
        "Право на удаление аккаунта и связанных данных."
      ]
    },
    {
      title: "Хранение данных",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: [
        "Данные хранятся на защищенных серверах в ЕС.",
        "Резервные копии создаются регулярно.",
        "Данные удаляются при закрытии аккаунта."
      ]
    },
    {
      title: "Cookies и трекинг",
      icon: <Settings className="w-6 h-6 text-amber-400" />,
      content: [
        "Используем только необходимые cookies для работы сайта.",
        "Не отслеживаем поведение пользователей.",
        "Аналитика анонимная и не содержит персональных данных."
      ]
    }
  ];

  const dataTypes = [
    {
      category: "Основные данные",
      items: ["Telegram ID", "Имя пользователя", "Email (если указан)"],
      icon: <User className="w-5 h-5 text-amber-400" />
    },
    {
      category: "Финансовые данные",
      items: ["Баланс аккаунта", "История транзакций", "Методы оплаты"],
      icon: <CreditCard className="w-5 h-5 text-amber-400" />
    },
    {
      category: "Игровые данные",
      items: ["История покупок", "Открытые кейсы", "Полученные предметы"],
      icon: <Shield className="w-5 h-5 text-amber-400" />
    },
    {
      category: "Технические данные",
      items: ["IP адрес", "Время посещений", "Ошибки системы"],
      icon: <Database className="w-5 h-5 text-amber-400" />
    }
  ];

  const securityMeasures = [
    {
      title: "Шифрование",
      description: "Все данные передаются по защищенным SSL соединениям",
      icon: <Lock className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Аутентификация",
      description: "Двухфакторная аутентификация через Telegram",
      icon: <Shield className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Мониторинг",
      description: "Постоянный мониторинг безопасности и подозрительной активности",
      icon: <Eye className="w-6 h-6 text-amber-400" />
    },
    {
      title: "Обновления",
      description: "Регулярные обновления безопасности и исправления уязвимостей",
      icon: <CheckCircle className="w-6 h-6 text-amber-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🔒 {t('Политика конфиденциальности')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            Мы серьезно относимся к защите ваших персональных данных. 
            Узнайте, как мы собираем, используем и защищаем вашу информацию.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-400/10 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-amber-500/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-amber-400/10 rounded-full animate-spin"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-20">
        {/* Краткая информация */}
        <div className="mb-12">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ваша конфиденциальность - наш приоритет
                </h3>
                <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Мы используем современные технологии для защиты ваших данных и никогда не передаем 
                  персональную информацию третьим лицам без вашего согласия.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {type.icon}
                    <span className="ml-3">{type.category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {type.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Основные разделы */}
        <div className="space-y-8 mb-16">
          {privacySections.map((section, index) => (
            <Card 
              key={index}
              className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
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
                      <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Меры безопасности */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Меры безопасности
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityMeasures.map((measure, index) => (
              <Card 
                key={index}
                className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20 hover:shadow-amber-500/40 transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {measure.icon}
                    <span className="ml-3">{measure.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">
                    {measure.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Права пользователей */}
        <div className="mb-16">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardHeader>
              <CardTitle className="text-white text-center">Ваши права</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Что вы можете делать:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Запросить копию ваших данных</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Изменить настройки конфиденциальности</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trash2 className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Удалить свой аккаунт</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-semibold text-lg">Как связаться с нами:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Email: support@vaultory.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Telegram: @vaultory_support</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Info className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Время ответа: до 24 часов</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Контактная информация */}
        <div className="mt-16">
          <Card className="bg-black/40 backdrop-blur-xl border-amber-500/30 shadow-2xl shadow-amber-500/20">
            <CardContent className="pt-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Вопросы по конфиденциальности?
                </h3>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Если у вас есть вопросы по нашей политике конфиденциальности или 
                  нужна помощь с настройками, свяжитесь с нами.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/support')}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-amber-500/30"
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
