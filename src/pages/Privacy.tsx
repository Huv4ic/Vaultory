import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Политика конфиденциальности
            </h1>
            <p className="text-gray-400">Последнее обновление: 01 января 2025</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">Общие положения</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса Vaultory. Мы серьезно относимся к защите ваших данных и соблюдаем все требования законодательства о персональных данных.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Используя наш сервис, вы соглашаетесь с условиями данной политики и даете согласие на обработку своих персональных данных в соответствии с описанными принципами.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Database className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">Сбор и использование данных</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Какие данные мы собираем:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Данные Telegram аккаунта (username, user ID)</li>
                      <li>Информация о покупках и транзакциях</li>
                      <li>Данные об использовании сервиса</li>
                      <li>IP-адрес и информация о браузере</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Как мы используем данные:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Обеспечение работы сервиса</li>
                      <li>Обработка платежей и заказов</li>
                      <li>Предоставление поддержки пользователям</li>
                      <li>Улучшение качества сервиса</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">Защита данных</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Мы применяем современные технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Меры безопасности:</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Шифрование данных при передаче (SSL/TLS)</li>
                      <li>Безопасное хранение данных</li>
                      <li>Ограниченный доступ к данным</li>
                      <li>Регулярные проверки безопасности</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">Ваши права</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    В соответствии с законодательством о защите персональных данных, вы имеете следующие права:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Право на доступ к своим персональным данным</li>
                    <li>Право на исправление неточных данных</li>
                    <li>Право на удаление данных</li>
                    <li>Право на ограничение обработки</li>
                    <li>Право на отзыв согласия</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Для реализации своих прав обратитесь к нам через официальные каналы связи.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    По вопросам обработки персональных данных вы можете обратиться к нам:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> privacy@vaultory.com</li>
                    <li><strong>Telegram:</strong> @Vaultory_manager</li>
                    <li><strong>Адрес:</strong> Россия, г. Москва</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    Мы рассматриваем все обращения в течение 30 дней с момента получения.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Privacy;
