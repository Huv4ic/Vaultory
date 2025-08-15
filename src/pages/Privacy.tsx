import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, Lock, Eye, Database } from 'lucide-react';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('Политика конфиденциальности')}
            </h1>
            <p className="text-gray-400">{t('Последнее обновление')}: 01 января 2025</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Общие положения')}</h2>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сервиса Vaultory. Мы серьезно относимся к защите ваших данных и соблюдаем все требования законодательства о персональных данных.')}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {t('Используя наш сервис, вы соглашаетесь с условиями данной политики и даете согласие на обработку своих персональных данных в соответствии с описанными принципами.')}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Database className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Сбор и использование данных')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Какие данные мы собираем:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Данные Telegram аккаунта (username, user ID)')}</li>
                      <li>{t('Информация о покупках и транзакциях')}</li>
                      <li>{t('Данные об использовании сервиса')}</li>
                      <li>{t('IP-адрес и информация о браузере')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Как мы используем данные:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Обеспечение работы сервиса')}</li>
                      <li>{t('Обработка платежей и заказов')}</li>
                      <li>{t('Предоставление поддержки пользователям')}</li>
                      <li>{t('Улучшение качества сервиса')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Lock className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Защита данных')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {t('Мы применяем современные технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.')}
                  </p>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Меры безопасности:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Шифрование данных при передаче (SSL/TLS)')}</li>
                      <li>{t('Безопасное хранение данных')}</li>
                      <li>{t('Ограниченный доступ к данным')}</li>
                      <li>{t('Регулярные проверки безопасности')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Ваши права')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {t('В соответствии с законодательством о защите персональных данных, вы имеете следующие права:')}
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>{t('Право на доступ к своим персональным данным')}</li>
                    <li>{t('Право на исправление неточных данных')}</li>
                    <li>{t('Право на удаление данных')}</li>
                    <li>{t('Право на ограничение обработки')}</li>
                    <li>{t('Право на отзыв согласия')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">{t('Контактная информация')}</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {t('По вопросам обработки персональных данных вы можете обратиться к нам:')}
                  </p>
                  <ul className="space-y-2">
                    <li><strong>{t('Email:')}</strong> privacy@vaultory.com</li>
                    <li><strong>{t('Telegram:')}</strong> @VaultorySupport</li>
                    <li><strong>{t('Адрес:')}</strong> Россия, г. Москва</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    {t('Мы рассматриваем все обращения в течение 30 дней с момента получения.')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
