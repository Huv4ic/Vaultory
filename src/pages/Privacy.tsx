import { useLanguage } from '../hooks/useLanguage';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
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
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Функция для открытия Gmail
  const openGmail = () => {
    const subject = encodeURIComponent('Вопрос по конфиденциальности Vaultory');
    const body = encodeURIComponent('Здравствуйте! У меня есть вопрос по политике конфиденциальности:\n\n');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=vaultorypoderjka@gmail.com&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const privacySections = [
    {
      title: "Сбор данных",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: [
        "Мы собираем только необходимые данные для предоставления услуг.",
        "Информация включает: Telegram ID, имя пользователя, баланс, историю покупок.",
        "Данные собираются автоматически при использовании платформы."
      ],
      description: "Мы собираем только необходимые данные для предоставления услуг. Информация включает: Telegram ID, имя пользователя, баланс, историю покупок. Данные собираются автоматически при использовании платформы."
    },
    {
      title: "Использование данных",
      icon: <Eye className="w-6 h-6 text-amber-400" />,
      content: [
        "Данные используются для обработки заказов и платежей.",
        "Аналитика помогает улучшать качество сервиса.",
        "Персональная информация не передается третьим лицам."
      ],
      description: "Данные используются для обработки заказов и платежей. Аналитика помогает улучшать качество сервиса. Персональная информация не передается третьим лицам."
    },
    {
      title: "Безопасность",
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      content: [
        "Все данные защищены современными технологиями шифрования.",
        "Доступ к серверам ограничен и контролируется.",
        "Регулярные проверки безопасности и обновления."
      ],
      description: "Все данные защищены современными технологиями шифрования. Доступ к серверам ограничен и контролируется. Регулярные проверки безопасности и обновления."
    },
    {
      title: "Права пользователей",
      icon: <User className="w-6 h-6 text-amber-400" />,
      content: [
        "Право на доступ к своим персональным данным.",
        "Возможность исправления неточной информации.",
        "Право на удаление аккаунта и связанных данных."
      ],
      description: "Право на доступ к своим персональным данным. Возможность исправления неточной информации. Право на удаление аккаунта и связанных данных."
    },
    {
      title: "Хранение данных",
      icon: <Database className="w-6 h-6 text-amber-400" />,
      content: [
        "Данные хранятся на защищенных серверах в ЕС.",
        "Резервные копии создаются регулярно.",
        "Данные удаляются при закрытии аккаунта."
      ],
      description: "Данные хранятся на защищенных серверах в ЕС. Резервные копии создаются регулярно. Данные удаляются при закрытии аккаунта."
    },
    {
      title: "Cookies и трекинг",
      icon: <Settings className="w-6 h-6 text-amber-400" />,
      content: [
        "Используем только необходимые cookies для работы сайта.",
        "Не отслеживаем поведение пользователей.",
        "Аналитика анонимная и не содержит персональных данных."
      ],
      description: "Используем только необходимые cookies для работы сайта. Не отслеживаем поведение пользователей. Аналитика анонимная и не содержит персональных данных."
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
        <div className="relative z-10 container mx-auto px-4 py-12 sm:py-16 md:py-20 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent animate-pulse">
            🔒 {t('Политика конфиденциальности')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            Мы серьезно относимся к защите ваших персональных данных. 
            Узнайте, как мы собираем, используем и защищаем вашу информацию.
          </p>
        </div>
        
        {/* Анимированные элементы фона */}
        <div className="absolute top-20 left-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-amber-400/10 rounded-full animate-bounce hidden md:block"></div>
        <div className="absolute top-40 right-20 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-amber-500/10 rounded-full animate-pulse hidden md:block"></div>
        <div className="absolute bottom-20 left-1/4 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-amber-400/10 rounded-full animate-spin hidden md:block"></div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
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
        <div className="mb-8 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {privacySections.map((section, index) => (
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
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{section.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Меры безопасности */}
        <div className="mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6 sm:mb-8">
            Меры безопасности
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {securityMeasures.map((measure, index) => (
              <div 
                key={index}
                className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-4 sm:p-6 text-center hover:shadow-amber-500/40 transition-all duration-300"
              >
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400/20 to-amber-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 border border-amber-500/30">
                  {measure.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-2">{measure.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300">{measure.description}</p>
              </div>
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
                      <button 
                        onClick={openGmail}
                        className="text-gray-300 hover:text-amber-400 transition-colors duration-300 text-sm underline"
                      >
                        Email: vaultorypoderjka@gmail.com
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-amber-400" />
                      <span className="text-gray-300 text-sm">Telegram: @Vaultory_manager</span>
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
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Вопросы по конфиденциальности?
            </h3>
            <p className="text-sm sm:text-base text-gray-300 mb-6">
              Если у вас есть вопросы по нашей политике конфиденциальности, 
              не стесняйтесь обращаться к нам.
            </p>
            <Button
              onClick={openGmail}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 shadow-xl shadow-amber-500/30 text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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

export default Privacy;
