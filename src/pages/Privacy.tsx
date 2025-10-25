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
      icon: <Database className="w-6 h-6 text-[#a31212]" />,
      content: [
        "Мы собираем только необходимые данные для предоставления услуг.",
        "Информация включает: Telegram ID, имя пользователя, баланс, историю покупок.",
        "Данные собираются автоматически при использовании платформы."
      ],
      description: "Мы собираем только необходимые данные для предоставления услуг. Информация включает: Telegram ID, имя пользователя, баланс, историю покупок. Данные собираются автоматически при использовании платформы."
    },
    {
      title: "Использование данных",
      icon: <Eye className="w-6 h-6 text-[#a31212]" />,
      content: [
        "Данные используются для обработки заказов и платежей.",
        "Аналитика помогает улучшать качество сервиса.",
        "Персональная информация не передается третьим лицам."
      ],
      description: "Данные используются для обработки заказов и платежей. Аналитика помогает улучшать качество сервиса. Персональная информация не передается третьим лицам."
    },
    {
      title: "Безопасность",
      icon: <Lock className="w-6 h-6 text-[#a31212]" />,
      content: [
        "Все данные защищены современными технологиями шифрования.",
        "Доступ к серверам ограничен и контролируется.",
        "Регулярные проверки безопасности и обновления."
      ],
      description: "Все данные защищены современными технологиями шифрования. Доступ к серверам ограничен и контролируется. Регулярные проверки безопасности и обновления."
    },
    {
      title: "Права пользователей",
      icon: <User className="w-6 h-6 text-[#a31212]" />,
      content: [
        "Право на доступ к своим персональным данным.",
        "Возможность исправления неточной информации.",
        "Право на удаление аккаунта и связанных данных."
      ],
      description: "Право на доступ к своим персональным данным. Возможность исправления неточной информации. Право на удаление аккаунта и связанных данных."
    },
    {
      title: "Хранение данных",
      icon: <Database className="w-6 h-6 text-[#a31212]" />,
      content: [
        "Данные хранятся на защищенных серверах в ЕС.",
        "Резервные копии создаются регулярно.",
        "Данные удаляются при закрытии аккаунта."
      ],
      description: "Данные хранятся на защищенных серверах в ЕС. Резервные копии создаются регулярно. Данные удаляются при закрытии аккаунта."
    },
    {
      title: "Cookies и трекинг",
      icon: <Settings className="w-6 h-6 text-[#a31212]" />,
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
      icon: <User className="w-5 h-5 text-[#a31212]" />
    },
    {
      category: "Финансовые данные",
      items: ["Баланс аккаунта", "История транзакций", "Методы оплаты"],
      icon: <CreditCard className="w-5 h-5 text-[#a31212]" />
    },
    {
      category: "Игровые данные",
      items: ["История покупок", "Открытые кейсы", "Полученные предметы"],
      icon: <Shield className="w-5 h-5 text-[#a31212]" />
    },
    {
      category: "Технические данные",
      items: ["IP адрес", "Время посещений", "Ошибки системы"],
      icon: <Database className="w-5 h-5 text-[#a31212]" />
    }
  ];

  const securityMeasures = [
    {
      title: "Шифрование",
      description: "Все данные передаются по защищенным SSL соединениям",
      icon: <Lock className="w-6 h-6 text-[#a31212]" />
    },
    {
      title: "Аутентификация",
      description: "Двухфакторная аутентификация через Telegram",
      icon: <Shield className="w-6 h-6 text-[#a31212]" />
    },
    {
      title: "Мониторинг",
      description: "Постоянный мониторинг безопасности и подозрительной активности",
      icon: <Eye className="w-6 h-6 text-[#a31212]" />
    },
    {
      title: "Обновления",
      description: "Регулярные обновления безопасности и исправления уязвимостей",
      icon: <CheckCircle className="w-6 h-6 text-[#a31212]" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e0e] relative">

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 md:py-24 text-center">
          {/* Главный заголовок */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-[#181818] rounded-full mb-6 border border-[#1c1c1c]">
              <Shield className="w-10 h-10 md:w-12 md:h-12 text-[#a31212]" />
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 text-[#f0f0f0] text-center">
              ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
            </h1>
            <div className="w-32 h-1 bg-[#a31212] mx-auto rounded-full"></div>
          </div>
          
          {/* Описание */}
          <p className="text-lg md:text-xl lg:text-2xl text-[#a0a0a0] mb-12 max-w-4xl mx-auto leading-relaxed">
            Мы серьезно относимся к <span className="text-[#a31212] font-bold">защите ваших данных</span>. 
            Узнайте, как мы <span className="text-[#f0f0f0] font-bold">собираем, используем и защищаем</span> вашу информацию.
          </p>
        </div>
      </div>

      {/* Основной контент */}
      <div className="relative z-20 container mx-auto px-4 pb-12 sm:pb-16 md:pb-20">
        {/* Краткая информация */}
        <div className="mb-16">
          <div className="group relative max-w-4xl mx-auto">
            <div className="relative bg-[#181818] rounded-3xl border border-[#1c1c1c] p-12 hover:border-[#a31212] transition-all duration-300 text-center">
              <div className="mx-auto w-24 h-24 bg-[#1c1c1c] rounded-2xl flex items-center justify-center mb-8 border border-[#a31212]">
                <Shield className="w-12 h-12 text-[#a31212]" />
              </div>
              <h3 className="text-3xl font-black text-[#f0f0f0] mb-6">
                Ваша конфиденциальность - наш приоритет
              </h3>
              <p className="text-xl text-[#a0a0a0] max-w-3xl mx-auto leading-relaxed">
                Мы используем современные технологии для защиты ваших данных и никогда не передаем 
                персональную информацию третьим лицам без вашего согласия.
              </p>
            </div>
          </div>
        </div>

        {/* Типы собираемых данных */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              КАКИЕ ДАННЫЕ МЫ СОБИРАЕМ
            </h2>
            <div className="w-32 h-1 bg-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {dataTypes.map((type, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-blue-500/30 p-8 hover:border-blue-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-blue-500/30 shadow-xl shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                      {type.icon}
                    </div>
                    <h3 className="text-xl font-black text-white">{type.category}</h3>
                  </div>
                  <div className="space-y-3">
                    {type.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Основные разделы */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              ОСНОВНЫЕ РАЗДЕЛЫ
            </h2>
            <div className="w-32 h-1 bg-purple-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {privacySections.map((section, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mr-4 border border-purple-500/30 shadow-xl shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
                      {section.icon}
                    </div>
                    <h3 className="text-xl font-black text-white">{section.title}</h3>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{section.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Меры безопасности */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
              МЕРЫ БЕЗОПАСНОСТИ
            </h2>
            <div className="w-32 h-1 bg-green-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {securityMeasures.map((measure, index) => (
              <div 
                key={index}
                className="group relative"
              >
                <div className="absolute inset-0 bg-green-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-green-500/30 p-6 hover:border-green-400/50 transition-all duration-500 hover:scale-105 text-center">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-green-500/30 shadow-xl shadow-green-500/20 group-hover:rotate-12 transition-transform duration-500">
                    {measure.icon}
                  </div>
                  <h3 className="text-lg font-black text-white mb-3">{measure.title}</h3>
                  <p className="text-sm text-gray-300">{measure.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Права пользователей */}
        <div className="mb-16">
          <div className="group relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 hover:border-cyan-400/50 transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-black text-white text-center mb-8">Ваши права</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-white font-black text-lg">Что вы можете делать:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Запросить копию ваших данных</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Изменить настройки конфиденциальности</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trash2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Удалить свой аккаунт</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-white font-black text-lg">Как связаться с нами:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <button 
                        onClick={openGmail}
                        className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm underline"
                      >
                        Email: vaultorypoderjka@gmail.com
                      </button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Telegram: @Vaultory_manager</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Info className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Время ответа: до 24 часов</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Контактная информация */}
        <div className="text-center">
          <div className="group relative max-w-2xl mx-auto">
            <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-105">
              <h3 className="text-2xl font-black text-white mb-4">
                Вопросы по конфиденциальности?
              </h3>
              <p className="text-lg text-gray-300 mb-6">
                Если у вас есть вопросы по нашей политике конфиденциальности, 
                не стесняйтесь обращаться к нам.
              </p>
              <Button
                onClick={openGmail}
                className="w-full bg-purple-500 hover:bg-purple-400 text-white font-black text-lg rounded-2xl transition-all duration-300 hover:scale-105 shadow-2xl shadow-purple-500/25 py-4"
              >
                <Mail className="w-5 h-5 mr-2" />
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
            className="px-8 py-3 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800/80 backdrop-blur-xl border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-400/50 transition-all duration-300 rounded-2xl text-lg hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
