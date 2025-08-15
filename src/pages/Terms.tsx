import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { FileText, AlertTriangle, CreditCard, Users } from 'lucide-react';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {t('Пользовательское соглашение')}
            </h1>
            <p className="text-gray-400">{t('Последнее обновление')}: 01 января 2025</p>
          </div>

          <div className="space-y-8">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <FileText className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Общие условия')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {t('Настоящее Пользовательское соглашение определяет условия использования сервиса Vaultory. Регистрируясь и используя наш сервис, вы соглашаетесь с данными условиями.')}
                  </p>
                  <p className="leading-relaxed">
                    {t('Vaultory - это платформа для приобретения цифровых товаров для различных игр и сервисов. Мы предоставляем удобный и безопасный способ покупки игровой валюты, предметов и других цифровых товаров.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Users className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Права и обязанности пользователей')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Пользователь имеет право:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Использовать сервис в соответствии с его назначением')}</li>
                      <li>{t('Получать качественные товары и услуги')}</li>
                      <li>{t('Обращаться в службу поддержки')}</li>
                      <li>{t('Удалить свой аккаунт в любое время')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Пользователь обязан:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Предоставлять достоверную информацию')}</li>
                      <li>{t('Не нарушать права других пользователей')}</li>
                      <li>{t('Не использовать сервис в мошеннических целях')}</li>
                      <li>{t('Соблюдать правила пользования сервисом')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <CreditCard className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Условия покупки и оплаты')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Порядок покупки:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Выбор товара и добавление в корзину')}</li>
                      <li>{t('Оформление заказа с указанием необходимых данных')}</li>
                      <li>{t('Оплата через доступные способы')}</li>
                      <li>{t('Получение товара в течение указанного времени')}</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{t('Способы оплаты:')}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>{t('Банковские карты (Visa, MasterCard, МИР)')}</li>
                      <li>{t('Электронные кошельки')}</li>
                      <li>{t('Криптовалюты')}</li>
                      <li>{t('Банковские переводы')}</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
                  <h2 className="text-2xl font-bold">{t('Возврат и возмещение')}</h2>
                </div>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    {t('Цифровые товары не подлежат возврату согласно действующему законодательству. Однако мы гарантируем качество предоставляемых услуг.')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Ответственность и ограничения</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Мы несем ответственность за предоставление качественных услуг в рамках действующего законодательства. Наша ответственность ограничивается стоимостью приобретенного товара.
                  </p>
                  <p className="leading-relaxed">
                    Пользователь несет полную ответственность за правильность предоставленных данных и за действия, совершенные с использованием его аккаунта.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700/50">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Контактная информация</h2>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    По всем вопросам, связанным с настоящим соглашением, обращайтесь:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> legal@vaultory.com</li>
                    <li><strong>Telegram:</strong> @VaultorySupport</li>
                    <li><strong>Время работы:</strong> Пн-Вс 9:00-23:00 (МСК)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
